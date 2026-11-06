/**
 * Cloudflare Pages Function - 免费视频播放反向代理
 *
 * 用途：代理 /free-play/* 请求到真实的免费视频域名
 * 解决 Flutter Web 部署后的 CORS 跨域问题，支持视频 seek (Range)
 *
 * 动态域名配置（优先级从高到低）：
 *   1. 请求头 x-upstream-origin / x-referer-domain（客户端控制）
 *   2. 环境变量 env.FREE_UPSTREAM_ORIGIN / env.FREE_REFERER_DOMAIN（部署时配置）
 *   3. 默认值（兜底）
 */

const DEFAULT_UPSTREAM = 'https://t02h.beikept.com';
const DEFAULT_REFERER_DOMAIN = 'https://www.1tow2.com';

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /free-play/', { status: 400 });
  }

  // 动态上游域名：请求头 > 环境变量 > 默认值
  const upstream = request.headers.get('x-upstream-origin')
    || env.FREE_UPSTREAM_ORIGIN
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
    console.error('[free-play] 循环检测拦截: 上游域名与当前域名相同', {
      currentHost, upstreamHost, baseUpstream
    });
    return new Response(
      `Loop blocked: upstream host (${upstreamHost}) equals current host (${currentHost}). ` +
      `请检查客户端 x-upstream-origin 请求头配置。`,
      { status: 508, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const upstreamPath = `${baseUpstream}/${pathParts.join('/')}`;

  // 动态 referer 域名：请求头 > 环境变量 > 默认值
  const refererDomain = request.headers.get('x-referer-domain')
    || env.FREE_REFERER_DOMAIN
    || DEFAULT_REFERER_DOMAIN;

  // 把原始请求的查询参数拼到上游 URL
  const url = new URL(request.url);
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
  // m3u8 文件不发送 Range 头（浏览器 HLS 播放器会自动添加 bytes=0-，上游服务器处理有 bug 会截断响应）
  // 只在请求 .ts 视频片段时才透传 Range 头以支持 seek
  const isTsFile = url.pathname.toLowerCase().endsWith('.ts');
  const range = isTsFile ? request.headers.get('range') : null;
  if (range) headers.set('range', range);
  const ifRange = isTsFile ? request.headers.get('if-range') : null;
  if (ifRange) headers.set('if-range', ifRange);

  console.log('[free-play] upstream:', upstreamUrl);
  console.log('[free-play] range:', range || 'none');

  const upstreamResponse = await fetch(upstreamUrl, {
    method: 'GET',
    headers,
  });

  console.log('[free-play] upstream status:', upstreamResponse.status);

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');

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
        'x-upstream-origin, x-referer-domain, referer, origin, user-agent, content-type, range, if-range',
      'Access-Control-Max-Age': '86400',
    },
  });
}
