/**
 * Cloudflare Pages Function - 草榴 JSON API 反向代理
 *
 * 草榴的 home / 频道 / 详情 / 搜索接口对浏览器跨域和 Referer 都有限制，
 * 统一走同源代理，由代理补 Referer / Origin / UA，并透传 trackid。
 */

const DEFAULT_UPSTREAM = 'https://jsonbfq5.alwaifu.com';
const DEFAULT_REFERER = 'https://cqihhj842.938674.online';

function cleanControlParams(url) {
  url.searchParams.delete('x-upstream-origin');
  url.searchParams.delete('x-referer-domain');
}

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /caoliu-api/', { status: 400 });
  }

  const url = new URL(request.url);
  const upstream = (url.searchParams.get('x-upstream-origin')
    || request.headers.get('x-upstream-origin')
    || env.CAOLIU_API_UPSTREAM
    || DEFAULT_UPSTREAM).replace(/\/$/, '');
  const referer = url.searchParams.get('x-referer-domain')
    || request.headers.get('x-referer-domain')
    || env.CAOLIU_REFERER
    || DEFAULT_REFERER;

  const upstreamHost = new URL(upstream).host;
  if (upstreamHost === url.host) {
    return new Response('Loop blocked', { status: 508, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
  const upstreamName = new URL(upstream).hostname;
  const allowed = env.CAOLIU_API_ALLOWED
    ? String(env.CAOLIU_API_ALLOWED).split(',').map((item) => item.trim()).filter(Boolean)
    : [];
  const isAllowed = allowed.length > 0
    ? allowed.includes(upstreamName)
    : /^(.+\.)?alwaifu\.com$/i.test(upstreamName) || /^search\d*\.sebxz\.com$/i.test(upstreamName);
  if (!isAllowed) {
    return new Response('Upstream not allowed', {
      status: 403,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  cleanControlParams(url);
  const upstreamPath = `${upstream}/${pathParts.join('/')}`;
  const upstreamUrl = url.search ? `${upstreamPath}${url.search}` : upstreamPath;

  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') || 'application/json, text/plain, */*');
  headers.set('accept-language', request.headers.get('accept-language') || 'zh-CN,zh;q=0.9');
  headers.set('referer', `${referer}/`);
  headers.set('origin', referer);
  headers.set('user-agent', request.headers.get('user-agent') || 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36');

  const trackId = request.headers.get('trackid');
  if (trackId) headers.set('trackid', trackId);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const method = request.method === 'POST' ? 'POST' : 'GET';
  const body = method === 'POST' ? await request.arrayBuffer() : undefined;
  let upstreamResponse = await fetch(upstreamUrl, { method, headers, body });

  // 草榴详情对回家域名 Referer 会 403，但 JSON 源站自身 Referer 可以通过；
  // 首页/列表两者都行，这里只在 403 时重试，避免影响正常响应。
  if (upstreamResponse.status === 403 && referer !== upstream) {
    headers.set('referer', `${upstream}/`);
    headers.set('origin', upstream);
    upstreamResponse = await fetch(upstreamUrl, { method, headers, body });
  }

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  if (upstreamResponse.ok) {
    responseHeaders.set('Cache-Control', 'public, max-age=60');
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers':
        'x-upstream-origin, x-referer-domain, trackid, content-type, accept, origin, referer, user-agent',
      'Access-Control-Max-Age': '86400',
    },
  });
}
