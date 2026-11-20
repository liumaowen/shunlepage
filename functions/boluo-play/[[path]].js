/**
 * Cloudflare Pages Function - 菠萝视频播放反向代理
 *
 * 用途：代理 /boluo-play/* 请求到真实的视频域名
 * 解决 Flutter Web 部署后的 CORS 跨域问题，支持视频 seek (Range)
 *
 * 动态域名配置（优先级从高到低）：
 *   1. 请求头 x-upstream-origin / x-referer-domain（客户端控制）
 *   2. 环境变量 env.UPSTREAM_ORIGIN / env.REFERER_DOMAIN（部署时配置）
 *   3. 默认值（兜底）
 */

const DEFAULT_UPSTREAM = 'https://bltenvpic.bfjfwj.cn';
const DEFAULT_REFERER_DOMAIN = 'https://4optqx5wc17g.swizmpfobl.cc';

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /boluo-play/', { status: 400 });
  }

  const url = new URL(request.url);
  const queryUpstream = url.searchParams.get('x-upstream-origin');
  const queryReferer = url.searchParams.get('x-referer-domain');

  // 动态上游域名：查询参数（供 <video> 使用） > 请求头 > 环境变量 > 默认值
  const upstream = queryUpstream
    || request.headers.get('x-upstream-origin')
    || env.UPSTREAM_ORIGIN
    || DEFAULT_UPSTREAM;
  const baseUpstream = upstream.replace(/\/$/, '');

  // 循环检测：如果上游域名和当前代理域名相同，直接拒绝，避免 Forward Loop
  const currentHost = new URL(request.url).host;
  let upstreamHost;
  try {
    upstreamHost = new URL(baseUpstream).host;
  } catch (_e) {
    return new Response(`Invalid upstream URL: ${baseUpstream}`, { status: 500 });
  }
  if (upstreamHost === currentHost) {
    console.error('[boluo-play] 循环检测拦截: 上游域名与当前域名相同', {
      currentHost, upstreamHost, baseUpstream
    });
    return new Response(
      `Loop blocked: upstream host (${upstreamHost}) equals current host (${currentHost}). ` +
      `请检查客户端 x-upstream-origin 请求头配置。`,
      { status: 508, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const upstreamPath = `${baseUpstream}/${pathParts.join('/')}`;

  // 动态 referer 域名：查询参数 > 请求头 > 环境变量 > 默认值
  const refererDomain = queryReferer
    || request.headers.get('x-referer-domain')
    || env.REFERER_DOMAIN
    || DEFAULT_REFERER_DOMAIN;

  // 把原始请求的查询参数拼到上游 URL，代理控制参数不下发
  url.searchParams.delete('x-upstream-origin');
  url.searchParams.delete('x-referer-domain');
  const upstreamUrl = url.search ? `${upstreamPath}${url.search}` : upstreamPath;

  // 构造请求头
  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') || '*/*');
  headers.set('accept-language', request.headers.get('accept-language') || 'zh-CN,zh;q=0.9');

  // 始终使用默认 referer/origin 域名，因为上游有防盗链白名单
  // 浏览器原始 referer 是代理域名（如 shunle.cc.cd），上游不认会返回 403
  const referer = `${refererDomain}/`;
  headers.set('referer', referer);
  const origin = refererDomain;
  headers.set('origin', origin);

  headers.set('user-agent', request.headers.get('user-agent') || 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36');

  // 透传浏览器安全头
  const secChUa = request.headers.get('sec-ch-ua');
  if (secChUa) headers.set('sec-ch-ua', secChUa);
  const secChUaMobile = request.headers.get('sec-ch-ua-mobile');
  if (secChUaMobile) headers.set('sec-ch-ua-mobile', secChUaMobile);
  const secChUaPlatform = request.headers.get('sec-ch-ua-platform');
  if (secChUaPlatform) headers.set('sec-ch-ua-platform', secChUaPlatform);
  const secFetchDest = request.headers.get('sec-fetch-dest');
  if (secFetchDest) headers.set('sec-fetch-dest', secFetchDest);
  const secFetchMode = request.headers.get('sec-fetch-mode');
  if (secFetchMode) headers.set('sec-fetch-mode', secFetchMode);
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite) headers.set('sec-fetch-site', secFetchSite);

  // 透传 Range 和 If-Range，支持视频 seek
  const range = request.headers.get('range');
  if (range) headers.set('range', range);
  const ifRange = request.headers.get('if-range');
  if (ifRange) headers.set('if-range', ifRange);

  // 添加 App 自定义头
  headers.set('uuid', 'baef75165e1d41b190d379e1533ef699');
  headers.set('platform', '3');

  console.log('[boluo-play] upstream:', upstreamUrl);
  console.log('[boluo-play] range:', range || 'none');

  const upstreamResponse = await fetch(upstreamUrl, {
    method: 'GET',
    headers,
  });

  console.log('[boluo-play] upstream status:', upstreamResponse.status);

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');

  const contentType = upstreamResponse.headers.get('content-type') || '';
  const isPlaylist = contentType.includes('mpegurl') || upstreamUrl.split('?')[0].endsWith('.m3u8');

  // HLS 子请求（切片/密钥）不会带上播放列表里的查询参数，这里把代理控制参数写进播放列表每一行，
  // 否则切片会回落到默认上游域名并被防盗链拦截（403）。
  if (isPlaylist && upstreamResponse.ok) {
    const control = new URLSearchParams({
      'x-upstream-origin': baseUpstream,
      'x-referer-domain': refererDomain,
    }).toString();
    const text = await upstreamResponse.text();
    const rewritten = text
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;
        if (trimmed.startsWith('#')) {
          if (trimmed.startsWith('#EXT-X-KEY') && trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/, (_m, uri) => {
              if (/^https?:\/\//.test(uri)) return `URI="${uri}"`;
              return `URI="${uri}${uri.includes('?') ? '&' : '?'}${control}"`;
            });
          }
          return line;
        }
        if (/^https?:\/\//.test(trimmed)) return line;
        return `${line}${trimmed.includes('?') ? '&' : '?'}${control}`;
      })
      .join('\n');
    responseHeaders.set('content-type', 'application/vnd.apple.mpegurl');
    responseHeaders.delete('content-length');
    return new Response(rewritten, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

// 处理 OPTIONS 预检请求
export async function onRequestOptions({ request }) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers':
        'x-upstream-origin, x-referer-domain, referer, origin, uuid, channel-code, platform, content-type, range, if-range',
      'Access-Control-Max-Age': '86400',
    },
  });
}
