/**
 * Cloudflare Pages Function - 免费视频播放反向代理
 *
 * 关键点：免费视频接口会轮换 CDN 子域名（t02h / t04c ...），
 * 客户端必须把接口返回的真实 origin 通过查询参数带进来；
 * 代理再把播放列表里的每一行（含密钥、子清单、ts 分片）重写为同源代理地址，
 * 否则 HLS 子请求会丢掉上游域名，回落到写死的旧域名后 DNS 失败。
 */

const DEFAULT_UPSTREAM = 'https://t04c.beikept.com';
const DEFAULT_REFERER_DOMAIN = 'https://www.1tow2.com';

function buildControl(upstream, referer) {
  return new URLSearchParams({
    'x-upstream-origin': upstream,
    'x-referer-domain': referer,
  }).toString();
}

function withControl(urlString, upstream, referer) {
  const control = buildControl(upstream, referer);
  return `${urlString}${urlString.includes('?') ? '&' : '?'}${control}`;
}

function proxyLine(rawLine, basePath, upstream, referer) {
  const line = rawLine.trim();
  if (!line) return rawLine;

  if (line.startsWith('#')) {
    // #EXT-X-KEY / #EXT-X-MAP 里的 URI 也要走代理
    if (!line.includes('URI="')) return rawLine;
    return line.replace(/URI="([^"]+)"/g, (_match, uri) => {
      const target = rewriteTarget(uri, basePath, upstream);
      return `URI="${withControl(target, targetOrigin(uri, upstream), referer)}"`;
    });
  }

  const target = rewriteTarget(line, basePath, upstream);
  return withControl(target, targetOrigin(line, upstream), referer);
}

function targetOrigin(raw, fallback) {
  if (!/^https?:\/\//i.test(raw)) return fallback;
  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
}

function rewriteTarget(raw, basePath, upstream) {
  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      return `/free-play/${parsed.pathname.replace(/^\/+/, '')}${parsed.search}`;
    } catch {
      return raw;
    }
  }
  const path = raw.startsWith('/') ? raw : `${basePath}${raw}`;
  return `/free-play/${path.replace(/^\/+/, '')}`;
}

function isPlaylist(url, contentType) {
  return contentType.includes('mpegurl') || url.pathname.toLowerCase().endsWith('.m3u8');
}

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /free-play/', { status: 400 });
  }

  const url = new URL(request.url);
  const queryUpstream = url.searchParams.get('x-upstream-origin');
  const queryReferer = url.searchParams.get('x-referer-domain');

  const upstream = queryUpstream
    || request.headers.get('x-upstream-origin')
    || env.FREE_UPSTREAM_ORIGIN
    || DEFAULT_UPSTREAM;
  const baseUpstream = upstream.replace(/\/$/, '');

  const currentHost = new URL(request.url).host;
  let upstreamHost;
  try {
    upstreamHost = new URL(baseUpstream).hostname;
  } catch (_e) {
    return new Response(`Invalid upstream URL: ${baseUpstream}`, { status: 500 });
  }
  if (upstreamHost === currentHost) {
    return new Response(`Loop blocked: ${upstreamHost}`, {
      status: 508,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
  // 只允许免费视频 CDN 域名，避免 /free-play 变成任意站点的开放代理
  if (!/^(.+\.)?beikept\.com$/i.test(upstreamHost)) {
    return new Response('Upstream not allowed', {
      status: 403,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  const refererDomain = queryReferer
    || request.headers.get('x-referer-domain')
    || env.FREE_REFERER_DOMAIN
    || DEFAULT_REFERER_DOMAIN;

  const upstreamPath = `${baseUpstream}/${pathParts.join('/')}`;
  url.searchParams.delete('x-upstream-origin');
  url.searchParams.delete('x-referer-domain');
  const upstreamUrl = url.search ? `${upstreamPath}${url.search}` : upstreamPath;

  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') || '*/*');
  headers.set('accept-language', request.headers.get('accept-language') || 'zh-CN,zh;q=0.9');
  headers.set('referer', `${refererDomain}/`);
  headers.set('origin', refererDomain);
  headers.set('user-agent', request.headers.get('user-agent') || 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36');

  const isTsFile = url.pathname.toLowerCase().endsWith('.ts');
  const range = isTsFile ? request.headers.get('range') : null;
  if (range) headers.set('range', range);
  const ifRange = isTsFile ? request.headers.get('if-range') : null;
  if (ifRange) headers.set('if-range', ifRange);

  const upstreamResponse = await fetch(upstreamUrl, { method: 'GET', headers });
  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');

  if (isPlaylist(url, upstreamResponse.headers.get('content-type') || '') && upstreamResponse.ok) {
    const text = await upstreamResponse.text();
    const basePath = `/${pathParts.slice(0, -1).join('/')}${pathParts.length > 1 ? '/' : ''}`;
    const rewritten = text
      .split('\n')
      .map((line) => proxyLine(line, basePath, baseUpstream, refererDomain))
      .join('\n');

    responseHeaders.set('content-type', 'application/vnd.apple.mpegurl');
    responseHeaders.delete('content-length');
    return new Response(rewritten, { status: 200, headers: responseHeaders });
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers':
        'x-upstream-origin, x-referer-domain, referer, origin, user-agent, content-type, range, if-range',
      'Access-Control-Max-Age': '86400',
    },
  });
}
