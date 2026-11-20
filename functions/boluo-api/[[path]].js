/**
 * Cloudflare Pages Function - 菠萝 API 反向代理
 *
 * 用途：把 /boluo-api/app/* 转发到菠萝 API 域名，避免浏览器直连触发 CORS。
 * 上游域名优先级：x-upstream-origin > 环境变量 BOLUO_API_UPSTREAM_ORIGIN > 默认值。
 * 该接口为动态数据，不做边缘缓存。
 */

const DEFAULT_UPSTREAM = 'https://g5vhof2p7u1k.srrapocybl.cc';

// 部分新域名会拒绝 Cloudflare Worker 出站请求（463），这里统一映射到可用域名。
const UPSTREAM_ALIASES = {
  '4optqx5wc17g.swizmpfobl.cc': 'g5vhof2p7u1k.srrapocybl.cc',
};

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /boluo-api/', { status: 400 });
  }

  const upstream = request.headers.get('x-upstream-origin')
    || env.BOLUO_API_UPSTREAM_ORIGIN
    || DEFAULT_UPSTREAM;
  let baseUpstream = upstream.replace(/\/$/, '');

  try {
    const upstreamUrlObj = new URL(baseUpstream);
    const alias = UPSTREAM_ALIASES[upstreamUrlObj.host];
    if (alias) {
      upstreamUrlObj.host = alias;
      baseUpstream = upstreamUrlObj.origin;
    }
  } catch {
    return new Response(`Invalid upstream URL: ${baseUpstream}`, { status: 500 });
  }

  const currentHost = new URL(request.url).host;
  let upstreamHost;
  try {
    upstreamHost = new URL(baseUpstream).host;
  } catch {
    return new Response(`Invalid upstream URL: ${baseUpstream}`, { status: 500 });
  }
  if (upstreamHost === currentHost) {
    return new Response('Loop blocked: upstream equals current host', { status: 508 });
  }

  const url = new URL(request.url);
  const upstreamPath = `${baseUpstream}/${pathParts.join('/')}`;
  const upstreamUrl = url.search ? `${upstreamPath}${url.search}` : upstreamPath;
  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') || 'application/json, text/plain, */*');
  headers.set('accept-language', request.headers.get('accept-language') || 'zh-CN,zh;q=0.9');
  headers.set('referer', `${baseUpstream}/`);
  headers.set('origin', baseUpstream);
  headers.set(
    'user-agent',
    'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36',
  );

  for (const name of ['content-type', 'uuid', 'channel-code', 'platform']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  let body = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = request.body;
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
    });
  } catch (error) {
    return new Response(`Upstream request failed: ${error}`, {
      status: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Cache-Control', 'no-store');
  responseHeaders.delete('Set-Cookie');

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
        'x-upstream-origin, x-referer-domain, content-type, accept, uuid, channel-code, platform',
      'Access-Control-Max-Age': '86400',
    },
  });
}
