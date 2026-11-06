/**
 * Cloudflare Pages Function - 免费视频 API 反向代理
 *
 * 用途：代理 /free-api/videos/* 请求到免费视频 API 服务器
 * 解决 Flutter Web 部署后 API 请求被上游服务器限制的问题
 *
 * 动态域名配置（优先级从高到低）：
 *   1. 请求头 x-upstream-origin（客户端控制）
 *   2. 环境变量 env.FREE_API_UPSTREAM_ORIGIN（部署时配置）
 *   3. 默认值（兜底）
 */

const DEFAULT_UPSTREAM = 'https://a64d.vd9h4.com';

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /free-api/', { status: 400 });
  }

  // 动态上游域名：请求头 > 环境变量 > 默认值
  const upstream = request.headers.get('x-upstream-origin')
    || env.FREE_API_UPSTREAM_ORIGIN
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
    console.error('[free-api] 循环检测拦截: 上游域名与当前域名相同', {
      currentHost, upstreamHost, baseUpstream
    });
    return new Response(
      `Loop blocked: upstream host (${upstreamHost}) equals current host (${currentHost}). ` +
      `请检查客户端 x-upstream-origin 请求头配置。`,
      { status: 508, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const upstreamPath = `${baseUpstream}/${pathParts.join('/')}`;

  // 把原始请求的查询参数拼到上游 URL
  const url = new URL(request.url);
  const upstreamUrl = url.search ? `${upstreamPath}${url.search}` : upstreamPath;

  // 构造请求头（发给上游服务器）
  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') || 'application/json, text/plain, */*');
  headers.set('accept-language', request.headers.get('accept-language') || 'zh-CN,zh;q=0.9');

  // 设置上游服务器的 referer/origin
  const refererDomain = request.headers.get('x-referer-domain') || 'https://www.1tow2.com';
  headers.set('referer', `${refererDomain}/`);
  headers.set('origin', refererDomain);

  // 使用手机 User-Agent
  headers.set('user-agent', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36');

  // 透传客户端原始头
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  const source = request.headers.get('source');
  if (source) headers.set('source', source);
  const did = request.headers.get('did');
  if (did) headers.set('did', did);
  const range = request.headers.get('range');
  if (range) headers.set('range', range);

  console.log('[free-api] upstream:', upstreamUrl);

  // 获取请求体
  let body = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = request.body;
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body,
  });

  console.log('[free-api] upstream status:', upstreamResponse.status);

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  responseHeaders.set('Access-Control-Allow-Headers', 'x-upstream-origin, x-referer-domain, content-type, accept, source, did');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

// 处理 OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers':
        'x-upstream-origin, x-referer-domain, content-type, accept, source, did, user-agent',
      'Access-Control-Max-Age': '86400',
    },
  });
}
