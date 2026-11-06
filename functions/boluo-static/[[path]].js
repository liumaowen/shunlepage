/**
 * Cloudflare Pages Function - 菠萝静态资源反向代理
 *
 * 用途：代理 /boluo-static/* 请求到真实的静态资源域名
 * 解决 Flutter Web 部署后的 CORS 跨域问题
 *
 * 请求路径：/boluo-static/static/common/xxx.js
 * 转发目标：https://bltsta.0852w.com/static/common/xxx.js
 *
 * 动态域名配置（优先级从高到低）：
 *   1. 请求头 x-upstream-origin / x-referer-domain（客户端控制）
 *   2. 环境变量 env.UPSTREAM_ORIGIN / env.REFERER_DOMAIN（部署时配置）
 *   3. 默认值（兜底）
 */

const DEFAULT_UPSTREAM = 'https://bltsta.0852w.com';
const DEFAULT_REFERER_DOMAIN = 'https://g5vhof2p7u1k.s0l1gkhpbl.cc';

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /boluo-static/', { status: 400 });
  }

  // 动态上游域名：请求头 > 环境变量 > 默认值
  const upstream = request.headers.get('x-upstream-origin')
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
    console.error('[boluo-static] 循环检测拦截: 上游域名与当前域名相同', {
      currentHost, upstreamHost, baseUpstream
    });
    return new Response(
      `Loop blocked: upstream host (${upstreamHost}) equals current host (${currentHost}). ` +
      `请检查客户端 x-upstream-origin 请求头配置。`,
      { status: 508, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const upstreamUrl = `${baseUpstream}/${pathParts.join('/')}`;

  // 动态 referer 域名：请求头 > 环境变量 > 默认值
  const refererDomain = request.headers.get('x-referer-domain')
    || env.REFERER_DOMAIN
    || DEFAULT_REFERER_DOMAIN;

  console.log('[boluo-static] path:', pathParts.join('/'));
  console.log('[boluo-static] upstream:', upstreamUrl);

  // 构造请求头
  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') || '*/*');
  headers.set('accept-language', request.headers.get('accept-language') || 'zh-CN,zh;q=0.9');

  // referer/origin 优先使用浏览器原始值，本地测试或无值时使用动态 refererDomain
  const browserReferer = request.headers.get('referer');
  const referer = browserReferer && !browserReferer.includes('127.0.0.1') && !browserReferer.includes('localhost')
                   && !browserReferer.includes('dpdns.org')
    ? browserReferer
    : `${refererDomain}/`;
  headers.set('referer', referer);

  const browserOrigin = request.headers.get('origin');
  const origin = browserOrigin && !browserOrigin.includes('127.0.0.1') && !browserOrigin.includes('localhost')
                   && !browserOrigin.includes('dpdns.org')
    ? browserOrigin
    : refererDomain;
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

  // 透传 App 自定义头
  const passThroughHeaders = ['uuid', 'channel-code', 'platform', 'content-type'];
  for (const headerName of passThroughHeaders) {
    const value = request.headers.get(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }

  console.log('[boluo-static] referer:', referer, 'origin:', origin);

  // 发送请求到上游
  const upstreamResponse = await fetch(upstreamUrl, {
    method: 'GET',
    headers,
  });

  console.log('[boluo-static] upstream status:', upstreamResponse.status);

  // 构建响应
  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  // 只对成功响应缓存，错误不缓存，避免错误被长时间缓存
  if (upstreamResponse.status >= 200 && upstreamResponse.status < 300) {
    responseHeaders.set('Cache-Control', 'public, max-age=86400');
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
