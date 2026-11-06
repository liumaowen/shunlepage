/**
 * Cloudflare Pages Function - 字体反向代理
 *
 * 用途：代理 /open/fonts/* 请求到 loli.net 字体 CDN
 * 解决 Flutter Web 字体加载慢的问题
 */

const FONT_UPSTREAM = 'https://gstatic.loli.net/s';

export async function onRequest({ request, params }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing font path', { status: 400 });
  }

  const upstreamPath = pathParts.join('/');
  const upstreamUrl = `${FONT_UPSTREAM}/${upstreamPath}`;

  console.log('[font-proxy] upstream:', upstreamUrl);

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers: {
      'accept': request.headers.get('accept') || '*/*',
      'accept-language': request.headers.get('accept-language') || 'zh-CN,zh;q=0.9',
      'user-agent': request.headers.get('user-agent'),
    },
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
