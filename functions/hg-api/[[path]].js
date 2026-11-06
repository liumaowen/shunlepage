/**
 * 黄果短剧 — Cloudflare Pages Functions API (数据库操作层)
 *
 * 职责：
 *   - 接收 Lambda 同步的数据写入 D1
 *   - 提供查询接口给前端
 *   - 不执行爬取逻辑（爬取在 Lambda 端完成）
 *
 * 部署：
 *   1. 将静态文件放在项目根目录（或自定义目录）
 *   2. 将此文件放在 functions/_worker.js
 *   3. npx wrangler pages deploy
 *
 * 测试：
 *   https://<your-project>.pages.dev/               — 状态
 *   https://<your-project>.pages.dev/home/latest     — 从 D1 读取最新快照
 *   https://<your-project>.pages.dev/home/history    — 所有爬取记录
 *   https://<your-project>.pages.dev/dramas          — 从 D1 查作品列表
 *   https://<your-project>.pages.dev/dramas?category=ai-duanju
 *   https://<your-project>.pages.dev/dramas/search?q=复仇
 *   https://<your-project>.pages.dev/categories      — 分类列表
 *
 * 部署步骤：
 *   1. npx wrangler pages project create huangguo-pages --production-branch main
 *   2. npx wrangler d1 create huangguo-db
 *      → 记下返回的 database_id
 *   3. 在 Cloudflare Dashboard 绑定 D1 数据库到 Pages Functions：
 *      - 进入 Pages 项目 → Settings → Functions → Bindings
 *      - 添加 D1 Database binding，变量名填 DB，选择 huangguo-db
 *   4. 初始化表结构：
 *      npx wrangler d1 execute huangguo-db --remote --file=schema.sql
 *   5. 部署：
 *      npx wrangler pages deploy .
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 配置区
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** 分类列表（硬编码） */
const CATEGORIES = [
	{ id: 'ai-duanju', name: 'AI短剧' },
	{ id: 'ai-manju', name: 'AI漫剧' },
	{ id: 'ai-huanlian', name: 'AI换脸' },
	{ id: 'ai-mogai', name: 'AI魔改' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. D1 数据库操作
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** 开始一次爬取任务，返回 crawl_run_id */
async function startCrawlRun(db, mirror) {
	console.log('[startCrawlRun] mirror:', mirror);
	const safeMirror = mirror ?? 'unknown';

	const now = new Date();
	const cnTime = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

	const row = await db
		.prepare("INSERT INTO crawl_runs (status, mirror, started_at) VALUES ('running', ?, ?) RETURNING id")
		.bind(safeMirror, cnTime)
		.first();
	console.log('[startCrawlRun] row:', row, 'crawlId:', row?.id);
	return row?.id ?? null;
}

/** 结束爬取任务，更新状态和统计 */
async function finishCrawlRun(db, crawlId, { status = 'unknown', pagesCrawled = 0, dramasFound = 0, errorMessage = null } = {}) {
	console.log('[finishCrawlRun] params:', { crawlId, status, pagesCrawled, dramasFound, errorMessage });

	if (!crawlId) {
		console.log('[finishCrawlRun] skip: crawlId is null');
		return;
	}

	const safeStatus = status ?? 'unknown';
	const safePages = pagesCrawled ?? 0;
	const safeDramas = dramasFound ?? 0;
	const safeError = errorMessage ?? null;

	const now = new Date();
	const cnTime = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

	console.log('[finishCrawlRun] safe params:', { crawlId, safeStatus, safePages, safeDramas, safeError, cnTime });

	await db
		.prepare(
			`UPDATE crawl_runs
			 SET status = ?, finished_at = ?,
			     pages_crawled = ?, dramas_found = ?, error_message = ?
			 WHERE id = ?`
		)
		.bind(safeStatus, cnTime, safePages, safeDramas, safeError, crawlId)
		.run();
}

/** Cloudflare D1 单次 batch 最大变量数（保守值，实测限制约 200-300） */
const D1_MAX_VARS = 100;

/** D1 batch 限制：每次最多语句数 */
const BATCH_LIMIT = 100;

/**
 * 分批执行批量 SQL
 * @param {D1Database} db
 * @param {D1PreparedStatement[]} statements - 已 bind 的语句列表
 * @param {number} [varsPerStmt=1] - 每条语句绑定的变量数
 */
async function batchExecute(db, statements, varsPerStmt = 1) {
	if (statements.length === 0) return;
	const safeBatchLimit = Math.min(BATCH_LIMIT, Math.floor(D1_MAX_VARS / varsPerStmt));
	for (let i = 0; i < statements.length; i += safeBatchLimit) {
		const batch = statements.slice(i, i + safeBatchLimit);
		await db.batch(batch);
	}
}

/** UPSERT 作品主表（批量） */
async function upsertDramas(db, items) {
	const now = new Date();
	const cnNow = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

	const stmt = db.prepare(
		`INSERT INTO dramas (id, title, cover, description, score, category, tags, home_featured, home_latest, first_seen_at, last_seen_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		 ON CONFLICT(id) DO UPDATE SET
		   title=excluded.title,
		   cover=excluded.cover,
		   description=excluded.description,
		   score=excluded.score,
		   category=excluded.category,
		   tags=excluded.tags,
		   home_featured=excluded.home_featured,
		   home_latest=excluded.home_latest,
		   last_seen_at=?`
	);

	const statements = items
		.filter((item) => item.id && item.title)
		.map((item) =>
			stmt.bind(
				item.id,
				item.title,
				item.cover || '',
				item.description || '',
				item.score || '',
				item.category || '',
				JSON.stringify(item.tags || []),
				item.homeFeatured ? 1 : 0,
				item.homeLatest ? 1 : 0,
				cnNow,
				cnNow,
				cnNow  // ON CONFLICT 更新中的 last_seen_at
			)
		);

	await batchExecute(db, statements, 10);
}

/** 从 D1 查作品列表（支持分类、标签、搜索、首页分区筛选） */
async function queryDramas(db, { category, tag, search, homeFeatured, homeLatest, limit = 50, offset = 0 } = {}) {
	const conditions = [];
	const params = [];

	if (tag) {
		// 标签查询：使用 json_each 查询 JSON 数组
		conditions.push("EXISTS (SELECT 1 FROM json_each(dramas.tags) WHERE value = ?)");
		params.push(tag);
	}
	if (category) {
		conditions.push('dramas.category = ?');
		params.push(category);
	}
	if (search) {
		conditions.push('dramas.title LIKE ?');
		params.push(`%${search}%`);
	}
	if (homeFeatured && homeLatest) {
		conditions.push('(dramas.home_featured = 1 OR dramas.home_latest = 1)');
	} else if (homeFeatured) {
		conditions.push('dramas.home_featured = 1');
	} else if (homeLatest) {
		conditions.push('dramas.home_latest = 1');
	}

	const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
	// 按 id 倒序，ID 越大越新（last_seen_at 是爬取时间，不准确）
	const sql = `SELECT * FROM dramas ${where} ORDER BY id DESC LIMIT ? OFFSET ?`;
	params.push(Math.min(limit, 200), offset);

	const { results } = await db.prepare(sql).bind(...params).all();
	return results;
}

/**
 * 将数据库记录转换为 camelCase 格式，并解析 tags
 */
function formatDrama(drama) {
	return {
		id: drama.id,
		title: drama.title || '',
		cover: drama.cover || '',
		description: drama.description || '',
		score: drama.score || '',
		watchCount: drama.watch_count || '',
		likeCount: drama.like_count || '',
		episodeLabel: drama.episode_label || '',
		category: drama.category || '',
		categoryName: drama.category_name || '',
		tags: parseTags(drama.tags),
		homeFeatured: drama.home_featured === 1,
		homeLatest: drama.home_latest === 1,
		totalEpisodes: drama.total_episodes || null,
		duration: drama.duration || null,
		publishedAt: drama.published_at || '',
		author: drama.author || '',
		firstSeenAt: drama.first_seen_at || '',
		lastSeenAt: drama.last_seen_at || '',
	};
}

/**
 * 解析 tags 字段（JSON 字符串 → 数组）
 */
function parseTags(tags) {
	if (!tags) return [];
	if (Array.isArray(tags)) return tags;
	if (typeof tags === 'string') {
		try {
			const parsed = JSON.parse(tags);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	}
	return [];
}

/** 从 D1 查所有标签（带作品数，从 dramas.tags JSON 字段聚合） */
async function getAllTags(db) {
	const { results } = await db
		.prepare(
			`SELECT value AS name, COUNT(*) AS drama_count
			 FROM dramas, json_each(dramas.tags)
			 GROUP BY value
			 ORDER BY drama_count DESC`
		)
		.all();
	return results;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. 详情页 & 专题页 入库 / 读取
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** 更新作品详情 + 统计数据（作品已存在，只需 UPDATE） */
async function upsertDramaDetail(db, detail) {
	const now = new Date();
	const cnNow = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	await db
		.prepare(
			`UPDATE dramas SET
			title=?, cover=?, description=?, score=?, total_episodes=?,episode_label=?,
			category=?, category_name=?, duration=?, content_rating=?,
			embed_url=?, published_at=?, author=?, last_seen_at=?,
			watch_count=?, like_count=?, comment_count=?, stats_updated_at=?,
			tags=?, tags_updated_at=?, last_checked_at=?
		WHERE id=?`
		)
		.bind(
			detail.title || '',
			detail.cover || '',
			detail.description || '',
			detail.score || '',
			detail.totalEpisodes ?? null,
			detail.episodeLabel ?? null,
			detail.category || '',
			detail.categoryName || '',
			detail.duration ?? null,
			detail.contentRating || '',
			detail.embedUrl || '',
			detail.publishedAt || '',
			detail.author || '',
			cnNow,
			detail.stats?.watchCount || 0,
			detail.stats?.likeCount || 0,
			detail.stats?.commentCount || 0,
			cnNow,
			JSON.stringify(detail.tags || []),
			cnNow,
			cnNow,  // last_checked_at: 检查详情更新的时间
			detail.id
		)
		.run();
}

/** 批量更新作品的标签（JSON 数组） */
async function upsertDramaTags(db, items) {
	if (!items || items.length === 0) return;
	const now = new Date();
	const cnNow = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

	const stmt = db.prepare(
		`UPDATE dramas SET tags = ?, tags_updated_at = ? WHERE id = ?`
	);

	const statements = items
		.filter((item) => item.id)
		.map((item) =>
			stmt.bind(JSON.stringify(item.tags || []), cnNow, item.id)
		);

	await batchExecute(db, statements, 3);
}

/** 批量写入/更新专题，返回带 id 的专题列表 */
async function upsertTopics(db, topics) {
	const now = new Date();
	const cnNow = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

	const out = [];
	for (const t of topics) {
		const row = await db
			.prepare(
				`INSERT INTO topics (slug, title, description, cover, drama_count, created_at)
				 VALUES (?, ?, ?, ?, ?, ?)
				 ON CONFLICT(slug) DO UPDATE SET
				   title=excluded.title,
				   description=excluded.description,
				   cover=excluded.cover,
				   drama_count=excluded.drama_count
				 RETURNING id`
			)
			.bind(t.slug, t.title || '', t.description || '', t.cover || '', t.dramaCount || (t.dramas ? t.dramas.length : 0), cnNow)
			.first();
		out.push({ ...t, id: row?.id });
	}
	return out;
}

/** 建立专题-作品关联（增量模式） */
async function saveTopicDramas(db, topicsWithIds) {
	const candidateIds = new Set();
	for (const t of topicsWithIds) {
		for (const d of t.dramas || []) {
			if (d.id) candidateIds.add(d.id);
		}
	}
	const existingIds = new Set();
	if (candidateIds.size > 0) {
		const ids = [...candidateIds];
		for (let i = 0; i < ids.length; i += 90) {
			const chunk = ids.slice(i, i + 90);
			const placeholders = chunk.map(() => '?').join(',');
			const { results } = await db
				.prepare(`SELECT id FROM dramas WHERE id IN (${placeholders})`)
				.bind(...chunk)
				.all();
			for (const r of results) existingIds.add(r.id);
		}
	}
	const statements = [];
	const ins = db.prepare(
		'INSERT OR IGNORE INTO topic_dramas (topic_id, drama_id, position) VALUES (?, ?, ?)'
	);
	for (const t of topicsWithIds) {
		(t.dramas || []).forEach((d, i) => {
			if (d.id && existingIds.has(d.id)) {
				statements.push(ins.bind(t.id, d.id, i));
			}
		});
	}
	if (statements.length > 0) {
		await batchExecute(db, statements, 3);
	}
}

// ── 读取接口 ──

/** 从 D1 读取单个作品详情 + 集数 */
async function getDramaDetail(db, dramaId) {
	const drama = await db.prepare('SELECT * FROM dramas WHERE id = ?').bind(dramaId).first();
	if (!drama) return null;
	// episodes 表已废弃，播放源改为实时爬取
	return { drama, episodes: [] };
}

/** 专题列表 */
async function getTopicsList(db) {
	const { results } = await db
		.prepare('SELECT id, slug, title, description, cover, drama_count FROM topics ORDER BY id')
		.all();
	return results;
}

/** 单个专题详情 + 包含的作品 */
async function getTopicDetail(db, slug) {
	const topic = await db.prepare('SELECT * FROM topics WHERE slug = ?').bind(slug).first();
	if (!topic) return null;
	const { results } = await db
		.prepare(
			`SELECT d.*, td.position
			 FROM topic_dramas td
			 JOIN dramas d ON td.drama_id = d.id
			 WHERE td.topic_id = ?
			 ORDER BY td.position`
		)
		.bind(topic.id)
		.all();
	return { topic, dramas: results };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2.5 视频播放源抓取
//     每集页面内嵌 <script id="videoInitialData"> JSON，
//     其中 epPlaySrcs 包含 {当前集-1, 当前集, 当前集+1} 的 m3u8 链接
//     调用方可灵活指定要抓取哪些集
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const HG_ORIGIN = 'https://huangguoai.com';

/**
 * 从 HTML 页面解析 videoInitialData JSON
 */
function parseVideoInitData(html) {
	const m = html.match(/<script[^>]*id\s*=\s*["']videoInitialData["'][^>]*>([\s\S]*?)<\/script>/i);
	if (!m) return null;
	try {
		return JSON.parse(m[1].trim());
	} catch {
		return null;
	}
}

/**
 * 解析集数参数
 * 支持格式: "1,3,5" 或 "1-5" 或混合 "1,3-5,7"
 */
function parseEpisodesParam(input) {
	const result = new Set();
	const parts = input.split(',').map(s => s.trim()).filter(Boolean);

	for (const part of parts) {
		const rangeMatch = part.match(/^(\d+)-(\d+)$/);
		if (rangeMatch) {
			const start = parseInt(rangeMatch[1], 10);
			const end = parseInt(rangeMatch[2], 10);
			if (start > 0 && end >= start) {
				for (let i = start; i <= end; i++) result.add(i);
			}
		} else {
			const num = parseInt(part, 10);
			if (num > 0) result.add(num);
		}
	}

	return [...result].sort((a, b) => a - b);
}

/**
 * 抓取单个剧集页面，返回 videoInitialData 解析结果
 */
async function fetchEpisodeInitData(dramaId, episodeNum) {
	const path = episodeNum === 1
		? `/video/${dramaId}/`
		: `/video/${dramaId}/ep-${episodeNum}/`;

	const res = await fetch(`${HG_ORIGIN}${path}`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			'Accept': 'text/html,application/xhtml+xml',
			'Accept-Language': 'zh-CN,zh;q=0.9',
		},
		redirect: 'follow',
	});
	if (!res.ok) {
		console.warn(`[fetchEpisodeInitData] ep${episodeNum} HTTP ${res.status}`);
		return null;
	}
	const html = await res.text();
	return parseVideoInitData(html);
}

/**
 * 抓取指定集的播放源
 *
 * @param {string|number} dramaId - 作品ID
 * @param {number[]} episodes - 要抓取的集数列表，如 [1, 3, 5]
 * @returns {Promise<object>} 包含所有集 m3u8 链接的对象
 */
async function fetchEpisodeSources(dramaId, episodes) {
	const id = String(dramaId).replace(/[^0-9]/g, '');

	if (!id) {
		return { ok: false, error: '无效的参数: dramaId' };
	}
	if (!Array.isArray(episodes) || episodes.length === 0) {
		return { ok: false, error: '无效的参数: episodes 不能为空' };
	}
	if (episodes.length > 50) {
		return { ok: false, error: `集数过多: ${episodes.length}，建议分批请求` };
	}

	// 并行请求所有指定集页面
	const fetches = episodes.map(async (ep) => {
		try {
			const data = await fetchEpisodeInitData(id, ep);
			return { ep, data };
		} catch (err) {
			console.warn(`[fetchEpisodeSources] ep${ep} 请求失败:`, err.message);
			return { ep, data: null };
		}
	});
	const results = await Promise.all(fetches);

	// 合并所有 epPlaySrcs
	const epPlaySrcs = {};
	const perEp = {};
	let okCount = 0;

	for (const { ep, data } of results) {
		if (!data) continue;
		okCount++;

		const srcs = data.epPlaySrcs || {};
		for (const [k, v] of Object.entries(srcs)) {
			if (v) {
				epPlaySrcs[k] = v;
			}
		}

		perEp[ep] = {
			videoSrc: data.videoSrc || '',
			epCount: Object.keys(srcs).length,
		};
	}

	return {
		ok: true,
		id,
		requested: episodes,
		requests: episodes.length,
		successCount: okCount,
		failCount: episodes.length - okCount,
		epPlaySrcs,
		perEp,
	};
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 查询接口（供 Lambda 调用）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 处理 /api/query/* 查询请求
 */
async function handleQueryApi(path, db, url) {
	switch (path) {
		case '/api/query/dramas/pending-details': {
			const limit = parseInt(url.searchParams.get('limit') || '20', 10);
			const { results } = await db
				.prepare(
					`SELECT id FROM dramas
					WHERE episode_label != '已完结'
					ORDER BY
						CASE WHEN last_checked_at IS NULL THEN 0 ELSE 1 END,
						last_checked_at ASC
					LIMIT ?`
				)
				.bind(limit)
				.all();
			const ids = results.map(r => r.id);
			return jsonResponse({ ok: true, ids, count: ids.length });
		}

		default:
			return jsonResponse({ error: 'Unknown query API endpoint' }, 404);
	}
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. 内部写入接口（供 Lambda 调用）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 处理 /api/sync/* 写入请求
 */
async function handleSyncApi(path, db, request) {
	let body;
	try {
		body = await request.json();
	} catch {
		return jsonResponse({ error: 'Invalid JSON body' }, 400);
	}

	switch (path) {
		case '/api/sync/dramas': {
			const { items } = body;
			if (!Array.isArray(items)) {
				return jsonResponse({ error: 'items must be an array' }, 400);
			}
			await upsertDramas(db, items);
			return jsonResponse({ ok: true, processed: items.length });
		}

		case '/api/sync/drama-detail': {
			const { detail } = body;
			if (!detail || !detail.id) {
				return jsonResponse({ error: 'detail.id is required' }, 400);
			}
			await upsertDramaDetail(db, detail);
			return jsonResponse({ ok: true, id: detail.id });
		}

		case '/api/sync/tags': {
			const { items } = body;
			if (!Array.isArray(items) || items.length === 0) {
				return jsonResponse({ error: 'items must be a non-empty array' }, 400);
			}
			// 直接批量更新 dramas.tags 字段
			await upsertDramaTags(db, items);
			return jsonResponse({ ok: true, processed: items.length });
		}

		case '/api/sync/topics': {
			const { topics } = body;
			if (!Array.isArray(topics)) {
				return jsonResponse({ error: 'topics must be an array' }, 400);
			}
			const saved = await upsertTopics(db, topics);
			await saveTopicDramas(db, saved);
			return jsonResponse({ ok: true, topicCount: saved.length });
		}

		case '/api/sync/crawl-run/start': {
			const { mirror } = body;
			const crawlId = await startCrawlRun(db, mirror);
			return jsonResponse({ ok: true, crawlId });
		}

		case '/api/sync/crawl-run/finish': {
			const { crawlId, status, pagesCrawled, dramasFound, errorMessage } = body;
			if (!crawlId) {
				return jsonResponse({ error: 'crawlId is required' }, 400);
			}
			await finishCrawlRun(db, crawlId, {
				status: status || 'unknown',
				pagesCrawled: pagesCrawled || 0,
				dramasFound: dramasFound || 0,
				errorMessage: errorMessage || null,
			});
			return jsonResponse({ ok: true, crawlId });
		}

		default:
			return jsonResponse({ error: 'Unknown sync API endpoint' }, 404);
	}
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. 路由
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleRequest(request, env) {
	const url = new URL(request.url);
	const db = env.DB;
	// 剥离 /hg-api 前缀，使路由匹配与独立部署时一致
	const rawPath = url.pathname;
	const path = rawPath.replace(/^\/hg-api\/?/, '/') || '/';
	const method = request.method;

	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
	// 查询接口（供 Lambda 调用，需要鉴权）
	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

	if (path.startsWith('/api/query/') && method === 'GET') {
		const apiKey = request.headers.get('X-API-Key');
		if (!env.WORKER_API_SECRET || apiKey !== env.WORKER_API_SECRET) {
			return jsonResponse({ error: 'Unauthorized' }, 401);
		}
		return handleQueryApi(path, db, url);
	}

	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
	// 内部写入接口（供 Lambda 调用，需要鉴权）
	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

	if (path.startsWith('/api/sync/') && method === 'POST') {
		const apiKey = request.headers.get('X-API-Key');
		if (!env.WORKER_API_SECRET || apiKey !== env.WORKER_API_SECRET) {
			return jsonResponse({ error: 'Unauthorized' }, 401);
		}
		return handleSyncApi(path, db, request);
	}

	// 动态路由：/dramas/{id} 详情、/topics/{slug} 专题详情
	let m;
	if ((m = path.match(/^\/dramas\/(\d+)$/))) {
		const detail = await getDramaDetail(db, decodeURIComponent(m[1]));
		return detail ? jsonResponse(detail) : jsonResponse({ error: '未找到作品' }, 404);
	}
	if ((m = path.match(/^\/topics\/([^/]+)$/))) {
		const detail = await getTopicDetail(db, decodeURIComponent(m[1]));
		return detail ? jsonResponse(detail) : jsonResponse({ error: '未找到专题' }, 404);
	}

	switch (path) {
		case '/':
			return jsonResponse({
				name: '黄果短剧 Pages API',
				version: '0.5.0',
				description: '数据库操作层（爬取逻辑在 Lambda 端）',
				endpoints: [
					'/home/latest',
					'/home/history',
					'/dramas',
					'/dramas/{id}',
					'/dramas/search',
					'/tags',
					'/topics',
					'/topics/{slug}',
					'/categories',
					'/episodes/sources?dramaId=10268&episodes=1,3,5',
					'/episodes/sources?dramaId=10268&episodes=1-10',
				],
				categories: CATEGORIES,
			});

		case '/home/latest': {
			const dramas = await queryDramas(db, { limit: 50 });
			const crawlInfo = await db
				.prepare("SELECT * FROM crawl_runs WHERE status = 'success' ORDER BY finished_at DESC LIMIT 1")
				.first();
			return jsonResponse({
				dramas,
				total: dramas.length,
				lastSync: crawlInfo
					? { at: crawlInfo.finished_at, mirror: crawlInfo.mirror, found: crawlInfo.dramas_found }
					: null,
			});
		}

		case '/home/history': {
			const { results } = await db
				.prepare('SELECT * FROM crawl_runs ORDER BY id DESC LIMIT 20')
				.all();
			return jsonResponse({ runs: results });
		}

		case '/dramas': {
			const category = url.searchParams.get('category');
			const tag = url.searchParams.get('tag');
			const homeFeatured = url.searchParams.get('home_featured');
			const homeLatest = url.searchParams.get('home_latest');
			const limit = parseInt(url.searchParams.get('limit') || '50');
			const offset = parseInt(url.searchParams.get('offset') || '0');
			const rawDramas = await queryDramas(db, { category, tag, homeFeatured, homeLatest, limit, offset });
			const dramas = rawDramas.map(formatDrama);

			// 分离精选推荐和最近上新
			const featured = dramas.filter(d => d.homeFeatured);
			const latest = dramas.filter(d => d.homeLatest);

			return jsonResponse({ dramas, featured, latest, total: dramas.length, limit, offset });
		}

		case '/dramas/search': {
			const q = url.searchParams.get('q') || '';
			if (!q) return jsonResponse({ error: '缺少搜索词 ?q=' }, 400);
			const rawDramas = await queryDramas(db, { search: q });
			const dramas = rawDramas.map(formatDrama);
			return jsonResponse({ dramas, total: dramas.length, query: q });
		}

		case '/tags': {
			const tags = await getAllTags(db);
			return jsonResponse({ tags, total: tags.length });
		}

		case '/topics': {
			const topics = await getTopicsList(db);
			return jsonResponse({ topics, total: topics.length });
		}

		case '/categories':
			return jsonResponse({ categories: CATEGORIES });

		case '/episodes/sources': {
			const dramaId = url.searchParams.get('dramaId');
			const episodesParam = url.searchParams.get('episodes');

			if (!dramaId) return jsonResponse({ error: '缺少 ?dramaId= 参数' }, 400);
			if (!episodesParam) return jsonResponse({ error: '缺少 ?episodes= 参数，如 episodes=1,3,5' }, 400);

			// 解析集数列表：支持 "1,3,5" 或 "1-5" 格式
			const episodes = parseEpisodesParam(episodesParam);
			if (!episodes.length) return jsonResponse({ error: '无法解析集数列表' }, 400);

			const result = await fetchEpisodeSources(dramaId, episodes);
			return jsonResponse(result);
		}

		default:
			return jsonResponse({ error: 'Not found' }, 404);
	}
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 工具函数
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data, null, 2), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
			'Cache-Control': 'public, max-age=60',
		},
	});
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 入口 — Cloudflare Pages Functions 格式
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Pages Functions 使用 onRequest 导出
 * 可以导出 onRequestGet/onRequestPost 等限定 HTTP 方法，
 * 或导出 onRequest 处理所有方法
 */
export const onRequest = async ({ request, env, next }) => {
	// 处理 CORS 预检请求
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
			},
		});
	}

	try {
		return await handleRequest(request, env);
	} catch (err) {
		return jsonResponse(
			{ error: err.message, stack: err.stack },
			500
		);
	}
};
