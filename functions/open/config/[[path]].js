/**
 * Cloudflare Pages Function - 启动配置代理
 *
 * 用途：同源代理 /open/config/configs.json 到原版优先使用的 CDN 配置文件。
 * 原版 ConfigApiService 会先请求 CDN 静态配置，失败才回退 /api/configs；
 * 浏览器直连 CDN 会被 CORS 拦截，因此 Web 端通过本代理保持同样的优先级。
 */

const CONFIG_UPSTREAM = 'https://apks.slkk.dpdns.org/config';

export async function onRequest({ request, params }) {
  const path = (params.path || []).join('/');
  if (request.method !== 'GET' || path !== 'configs.json') {
    return new Response('Not found', { status: 404 });
  }

  const upstreamUrl = `${CONFIG_UPSTREAM}/configs.json`;
  const upstreamResponse = await fetch(upstreamUrl, {
    headers: {
      accept: 'application/json,*/*',
      'user-agent': request.headers.get('user-agent') || 'shunle-web',
    },
  });

  if (!upstreamResponse.ok) {
    return new Response('Config upstream error', { status: 502 });
  }

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Content-Type', 'application/json; charset=utf-8');
  responseHeaders.set('Cache-Control', 'public, max-age=300');
  responseHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
