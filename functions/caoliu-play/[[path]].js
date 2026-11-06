/**
 * Cloudflare Pages Function - 草榴视频播放反向代理
 *
 * 用途：代理 /caoliu-play/* 请求到真实的视频域名
 * 关键功能：自动为每个请求（m3u8 + ts 分片）添加 CDN 签名
 *
 * CDN 签名算法（参考 decoded_video.html）：
 *   SHA-256("${pathname}-${timestamp}-${rand}-${uid}-${privateKey}")
 *   返回格式："${timestamp}-${rand}-${uid}-${hash}"
 *   追加参数：auth_key_sigh
 */

const DEFAULT_UPSTREAM = 'https://videos.yngte.com:65443';
const DEFAULT_REFERER_DOMAIN = 'https://adt3fqzvg.110367.cc';
const DEFAULT_PRIVATE_KEY = '3q6yv6Ra1aex8i56HRO2IwCCTPg2Y1Bk';

// 生成随机十六进制字符串
function generateRand(length = 32) {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// SHA-256 哈希
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 生成 CDN 签名
async function generateSign(pathname,private_key) {
  const timestamp = Math.floor(Date.now() / 1000);
  const rand = generateRand();
  const uid = '0';
  const signString = `${pathname}-${timestamp}-${rand}-${uid}-${private_key}`;
  const hash = await sha256(signString);
  return `${timestamp}-${rand}-${uid}-${hash}`;
}

// 给 URL 追加 auth_key_sigh 签名参数
async function appendAuthParam(urlString,private_key) {
  const urlObj = new URL(urlString);
  const pathname = urlObj.pathname;
  const sign = await generateSign(pathname,private_key);
  urlObj.searchParams.set('auth_key_sigh', sign);
  return urlObj.toString();
}

export async function onRequest({ request, params, env }) {
  const pathParts = params.path || [];
  if (pathParts.length === 0) {
    return new Response('Missing path after /caoliu-play/', { status: 400 });
  }

  // 上游域名：请求头 > 环境变量 > 默认值
  const upstream = request.headers.get('x-upstream-origin')
    || env.CAOLIU_UPSTREAM_ORIGIN
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
    console.error('[caoliu-play] 循环检测拦截: 上游域名与当前域名相同', {
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
    || env.REFERER_DOMAIN
    || DEFAULT_REFERER_DOMAIN;

  // 拼接查询参数
  const url = new URL(request.url);
  let upstreamUrl = url.search ? `${upstreamPath}${url.search}` : upstreamPath;

  // 关键：为请求添加 CDN 签名
  const privateKey = request.headers.get('x-private-key')
    || DEFAULT_PRIVATE_KEY;
  upstreamUrl = await appendAuthParam(upstreamUrl,privateKey);

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

  // 透传 Range / If-Range（ts 分片支持 seek）
  const range = request.headers.get('range');
  if (range) headers.set('range', range);
  const ifRange = request.headers.get('if-range');
  if (ifRange) headers.set('if-range', ifRange);


  const isM3u8 = url.pathname.toLowerCase().endsWith('.m3u8');
  console.log(`[caoliu-play] ${isM3u8 ? 'm3u8' : 'ts'}:`, upstreamUrl.split('?')[0]);

  const upstreamResponse = await fetch(upstreamUrl, { method: 'GET', headers });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Headers', '*');

  // 如果是 m3u8 文件，需要改写内容中的相对路径为代理路径
  // 确保 ts 分片请求也经过代理，由代理自动签名
  if (isM3u8 && upstreamResponse.ok) {
    let m3u8Content = await upstreamResponse.text();

    // 计算当前 m3u8 的目录路径（用于解析相对路径）
    const currentPath = '/' + pathParts.join('/');
    const dirPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);

    // 替换 m3u8 中的相对路径为代理路径
    // 例如：h264/1500kb/0001.ts → /caoliu-play/voss/trans-free-video/.../h264/1500kb/0001.ts
    m3u8Content = m3u8Content.replace(/^(?!#)(.+)$/gm, (match, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return line;
      // 已经是完整 URL 的情况
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return line;
      // 相对路径：拼接当前目录路径，返回代理路径
      const fullPath = dirPath + trimmed;
      return `/caoliu-play${fullPath}`;
    });

    return new Response(m3u8Content, {
      status: 200,
      headers: responseHeaders,
    });
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

// OPTIONS 预检
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers':
        'x-upstream-origin, referer, origin, user-agent, content-type, range, if-range, trackid, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform, sec-fetch-dest, sec-fetch-mode, sec-fetch-site',
      'Access-Control-Max-Age': '86400',
    },
  });
}
