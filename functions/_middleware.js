/**
 * Cloudflare Pages 中间件：给 /open/ 下的静态资源做边缘缓存
 *
 * 背景：
 *   Cloudflare 默认只按“静态扩展名”缓存（.js/.css/图片…），
 *   .wasm 不在默认名单里，所以 canvaskit.wasm（压缩后约 2.8MB）
 *   每次请求都回源、边缘不缓存（cf-cache-status: DYNAMIC）。
 *   这里用 Cache API 显式缓存，绕过扩展名限制。
 *
 * 说明：
 *   Cache API 命中不会回写 cf-cache-status（仍会显示 DYNAMIC），
 *   请用响应头 X-Edge-Cache: HIT / MISS 来判断是否命中。
 */

const DAY = 86400;

/**
 * 按路径决定边缘缓存时长（秒）；返回 0 表示不缓存（始终回源）。
 * 发版后如需立即生效：Cloudflare 控制台 Purge，或等 TTL 过期。
 */
function ttlFor(path) {
  // 这两个必须实时，否则 Flutter 的版本检测/更新会失效
  if (path === '/open/version.json') return 0;
  if (path.endsWith('/flutter_service_worker.js')) return 0;

  // 引擎运行时：canvaskit.wasm / skwasm.wasm / skwasm_heavy.wasm / *.js
  // 随 Flutter SDK 版本走，极少变，长缓存 7 天
  if (path.startsWith('/open/canvaskit/')) return 7 * DAY;

  // 应用主程序（wasm 构建新增 main.dart.wasm / main.dart.mjs）：
  // 文件名都不带 hash，绝不能长缓存，否则发版后用户长期拿到旧版本
  if (/^\/open\/main\.dart\.(js|mjs|wasm)$/.test(path)) return 300;
  if (path.endsWith('/flutter_bootstrap.js')) return 300;

  // 字体 / 图片 / assets：变化少，中长缓存
  if (path.startsWith('/open/assets/')) return 7 * DAY;
  if (/\.(png|jpe?g|gif|webp|svg|otf|ttf|woff2?)$/i.test(path)) return 7 * DAY;

  // 其它脚本/配置：短缓存，兼顾速度和发版时效
  if (path.endsWith('.js') || path.endsWith('.mjs')) return 300;
  if (path.endsWith('.json') || path.endsWith('.bin')) return 300;

  // 兜底：其它 wasm（引擎变体）按长缓存处理
  if (path.endsWith('.wasm')) return 7 * DAY;

  return 0;
}

// CORS 配置
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',      // 或指定具体域名，如 'https://example.com'
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': '*',     // 允许所有请求头
  'Access-Control-Max-Age': '86400',       // 预检请求缓存 1 天
};

export async function onRequest(context) {
  const { request, next, waitUntil } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 处理 CORS 预检请求（OPTIONS）- 对所有路径生效
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  // 只处理 /open/ 下的 GET 静态资源；HTML 页面原样放行（4KB，不值得缓存）
  if (request.method !== 'GET' || !path.startsWith('/open/')) {
    // 非缓存请求，也添加 CORS 头后返回
    const res = await next();
    const out = new Response(res.body, res);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      out.headers.set(key, value);
    }
    return out;
  }
  // HTML 页面也添加 CORS 头
  if (path.endsWith('/') || path.endsWith('/index.html')) {
    const res = await next();
    const out = new Response(res.body, res);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      out.headers.set(key, value);
    }
    return out;
  }

  const ttl = ttlFor(path);
  // 不缓存，或运行环境没有 Cache API 时，直接放行（兜底，不影响功能）
  if (!ttl || typeof caches === 'undefined' || !caches.default) return next();

  const cache = caches.default;
  // 统一用 GET 请求作缓存键（带 query，保证不同版本互不污染）
  const cacheKey = new Request(url.toString(), { method: 'GET' });

  const hit = await cache.match(cacheKey);
  if (hit) {
    const r = new Response(hit.body, hit);
    r.headers.set('X-Edge-Cache', 'HIT');
    // 添加 CORS 头
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      r.headers.set(key, value);
    }
    return r;
  }

  const res = await next();
  if (res.status !== 200) return res;

  const out = new Response(res.body, res);
  out.headers.set(
    'Cache-Control',
    `public, max-age=${ttl}, stale-while-revalidate=${Math.min(ttl, DAY)}`
  );
  out.headers.delete('Set-Cookie');
  out.headers.set('X-Edge-Cache', 'MISS');
  // 添加 CORS 头
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    out.headers.set(key, value);
  }

  waitUntil(cache.put(cacheKey, out.clone()));
  return out;
}
