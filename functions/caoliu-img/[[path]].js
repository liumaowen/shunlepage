/**
 * Cloudflare Pages Function - 草榴图片反向代理
 *
 * 草榴封面/截图不是普通图片，而是把 Base64 拆成 _13.txt / _23.txt / _33.txt 三个分片。
 * merge=1 时由代理合并并解码成真正的图片；否则只做同源转发（供客户端自行解密）。
 */

const DEFAULT_UPSTREAM = 'https://mstatic2.alwaifu.com';
const DEFAULT_REFERER = 'https://cqihhj842.938674.online';

function buildHeaders(request, referer) {
  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') || '*/*');
  headers.set('referer', `${referer}/`);
  headers.set('origin', referer);
  headers.set('user-agent', request.headers.get('user-agent') || 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36');
  return headers;
}

function base64ToBytes(base64) {
  const cleaned = base64.replace(/[^A-Za-z0-9+/=]/g, '');
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function imageType(bytes) {
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg';
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
  return 'image/jpeg';
}

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /caoliu-img/', { status: 400 });
  }

  const url = new URL(request.url);
  const upstream = (url.searchParams.get('x-upstream-origin')
    || request.headers.get('x-upstream-origin')
    || env.CAOLIU_IMG_UPSTREAM
    || DEFAULT_UPSTREAM).replace(/\/$/, '');
  const referer = url.searchParams.get('x-referer-domain')
    || request.headers.get('x-referer-domain')
    || env.CAOLIU_REFERER
    || DEFAULT_REFERER;

  const upstreamHost = new URL(upstream).host;
  if (upstreamHost === url.host) {
    return new Response('Loop blocked', { status: 508 });
  }
  const upstreamName = new URL(upstream).hostname;
  const allowed = env.CAOLIU_IMG_ALLOWED
    ? String(env.CAOLIU_IMG_ALLOWED).split(',').map((item) => item.trim()).filter(Boolean)
    : [];
  const isAllowed = allowed.length > 0
    ? allowed.includes(upstreamName)
    : /^(.+\.)?alwaifu\.com$/i.test(upstreamName);
  if (!isAllowed) {
    return new Response('Upstream not allowed', { status: 403 });
  }

  const merge = url.searchParams.get('merge') === '1';
  url.searchParams.delete('x-upstream-origin');
  url.searchParams.delete('x-referer-domain');
  url.searchParams.delete('merge');

  const path = pathParts.join('/');
  const suffix = url.search ? url.search : '';
  const headers = buildHeaders(request, referer);

  if (merge) {
    const noQuery = path.split('?')[0];
    const dot = noQuery.lastIndexOf('.');
    const base = dot === -1 ? noQuery : noQuery.slice(0, dot);
    const parts = await Promise.all(
      ['13', '23', '33'].map(async (part) => {
        const response = await fetch(`${upstream}/${base}_${part}.txt`, { headers });
        if (!response.ok) throw new Error(`part ${part}: ${response.status}`);
        return (await response.text()).slice(2);
      }),
    );
    const bytes = base64ToBytes(parts.join(''));
    const responseHeaders = new Headers({
      'content-type': imageType(bytes),
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    });
    return new Response(bytes, { status: 200, headers: responseHeaders });
  }

  const upstreamUrl = `${upstream}/${path}${suffix}`;
  const upstreamResponse = await fetch(upstreamUrl, { headers });
  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  if (upstreamResponse.ok) responseHeaders.set('Cache-Control', 'public, max-age=86400');

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
      'Access-Control-Allow-Headers': 'x-upstream-origin, x-referer-domain, origin, referer, user-agent',
      'Access-Control-Max-Age': '86400',
    },
  });
}
