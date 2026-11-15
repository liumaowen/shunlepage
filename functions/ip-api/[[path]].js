/**
 * Cloudflare Pages Function - IP 查询 API 反向代理
 *
 * 用途：代理 /ip-api/* 请求到 ip9.com.cn API 服务器
 * 解决 Flutter Web 部署后 IP 查询请求的跨域问题
 *
 * 重要：通过 CF-Connecting-IP 获取客户端真实 IP，
 *       然后通过 ?ip= 参数查询，获取真实地理位置
 */

const DEFAULT_UPSTREAM = 'https://ip9.com.cn';

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /ip-api/', { status: 400 });
  }

  // 获取客户端真实 IP（Cloudflare 自动添加）
  const clientIP = request.headers.get('CF-Connecting-IP');
  const pathname = pathParts.join('/');

  if (pathname === 'get' && clientIP) {
    try {
      const upstream = env.IP_API_UPSTREAM_ORIGIN || DEFAULT_UPSTREAM;
      const baseUpstream = upstream.replace(/\/$/, '');

      // 循环检测
      const currentHost = new URL(request.url).host;
      let upstreamHost;
      try {
        upstreamHost = new URL(baseUpstream).host;
      } catch (_e) {
        return new Response(`Invalid upstream URL: ${baseUpstream}`, { status: 500 });
      }

      if (upstreamHost === currentHost) {
        return new Response('Loop detected', { status: 508 });
      }

      // 关键：使用客户端真实 IP 作为查询参数
      const upstreamUrl = `${baseUpstream}/get?ip=${encodeURIComponent(clientIP)}`;

      const headers = new Headers();
      headers.set('accept', 'application/json');
      headers.set('user-agent', request.headers.get('user-agent') || 'Mozilla/5.0');
      headers.set('referer', 'https://ip9.com.cn/');
      headers.set('origin', 'https://ip9.com.cn');

      console.log('[ip-api] 查询客户端 IP:', clientIP);

      const upstreamResponse = await fetch(upstreamUrl, {
        method: 'GET',
        headers,
      });

      if (upstreamResponse.ok) {
        const data = await upstreamResponse.json();

        const responseHeaders = new Headers(upstreamResponse.headers);
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Accept');

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: responseHeaders,
        });
      }
    } catch (error) {
      console.error('[ip-api] error:', error);
    }
  }

  return new Response('Not found', { status: 404 });
}

// 处理 OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400',
    },
  });
}
