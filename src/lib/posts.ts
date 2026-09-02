/**
 * Magazine posts stored in D1 — the data behind /admin and every archive page.
 *
 * Ported from the iscphm site and extended for the WordPress import:
 * categories/tags are JSON arrays of {slug, title}, author is a display name,
 * and wp_id ties a row back to its original WordPress post so the import is
 * idempotent. See migrations/0002_posts.sql.
 */

import { getSetting, setSetting } from '~/lib/settings';

export interface Taxonomy {
  slug: string;
  title: string;
}

export interface PostRow {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  image_alt: string;
  categories: string; // JSON: Taxonomy[]
  tags: string; // JSON: Taxonomy[]
  author: string;
  wp_id: number | null;
  featured: number;
  published: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PostListPage {
  rows: PostRow[];
  total: number;
  page: number;
  totalPages: number;
}

export const POSTS_PER_PAGE = 12;

/** Parse a JSON taxonomy column, tolerating bad data. */
export function parseTaxonomies(json: string): Taxonomy[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((t): t is Taxonomy => !!t && typeof t.slug === 'string') : [];
  } catch {
    return [];
  }
}

/** URL-safe slug from a title. Falls back to a timestamp for non-Latin titles. */
export function slugify(input: string): string {
  const s = input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return s || `post-${Date.now()}`;
}

/** Plain-text summary used for cards and the meta description. */
export function makeExcerpt(content: string, limit = 200): string {
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length <= limit ? text : text.slice(0, limit).replace(/\s+\S*$/, '') + '…';
}

/**
 * Trim an excerpt down to something a search engine will actually show.
 *
 * Google truncates around 155–160 characters. The excerpts imported from
 * WordPress run to 350+, so every article page was shipping a description that
 * got cut mid-sentence in results. Cuts on a word boundary and only adds the
 * ellipsis when something was actually removed.
 */
export function metaDescription(text: string, limit = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  return (
    clean
      .slice(0, limit)
      .replace(/\s+\S*$/, '')
      .replace(/[,;:–—-]$/, '') + '…'
  );
}

// Order and filter on posts.sort_at — the format-normalized COALESCE(published_at,
// created_at) maintained by the triggers in migrations/0007. It's the DESC key of
// idx_posts_live(published, sort_at), so a LIMIT-ed listing reads only the rows it
// returns instead of temp-sorting the whole table (which is what
// `ORDER BY COALESCE(...)` did, and what blew the D1 free-tier row budget).
const ORDER = 'ORDER BY sort_at DESC';
const ORDER_ASC = 'ORDER BY sort_at ASC';

/**
 * A post is publicly visible when it's published AND its publish time has
 * passed. sort_at collapses that into one sargable test: a scheduled post has a
 * future published_at (hence future sort_at) and a post with no published_at
 * falls back to its always-past created_at. Comparing against the same
 * strftime() shape the trigger stores keeps it an index range scan on
 * idx_posts_live rather than a full-table datetime() evaluation.
 */
export const LIVE_WHERE = "published = 1 AND sort_at <= strftime('%Y-%m-%dT%H:%M:%SZ','now')";

/** The LIVE_WHERE rule for a row already in hand (e.g. the single-post page). */
export function isLive(row: PostRow): boolean {
  if (row.published !== 1) return false;
  if (!row.published_at) return true;
  const iso = row.published_at.replace(' ', 'T');
  const t = new Date(/[Z+]/.test(iso) ? iso : `${iso}Z`);
  // An unparseable stamp counts as live rather than vanishing the post.
  return isNaN(t.getTime()) || t.getTime() <= Date.now();
}

export async function getAllPosts(db: D1Database): Promise<PostRow[]> {
  const { results } = await db.prepare(`SELECT * FROM posts ${ORDER}`).all<PostRow>();
  return results ?? [];
}

/**
 * One page of published posts, optionally filtered by category slug, tag slug,
 * or a search query.
 *
 * When a category or tag filter is present the query drives *from* the
 * post_taxonomies join table (idx_ptax_lookup), so it touches only that
 * section's posts. Driving from `posts` instead — scanning the archive in date
 * order until enough in-section rows turn up — read hundreds of rows per
 * archive page; this reads roughly the section's size.
 */
export async function getPublishedPage(
  db: D1Database,
  opts: {
    page?: number;
    perPage?: number;
    category?: string;
    tag?: string;
    q?: string;
    sort?: 'newest' | 'oldest';
  } = {}
): Promise<PostListPage> {
  const perPage = opts.perPage ?? POSTS_PER_PAGE;
  const where: string[] = [];
  const binds: (string | number)[] = [];

  // Pick the primary taxonomy to drive the query from (its index gives us the
  // section directly). A second taxonomy filter stays a membership test.
  const driver = opts.category
    ? { kind: 'categories', slug: opts.category }
    : opts.tag
      ? { kind: 'tags', slug: opts.tag }
      : null;

  let from = 'posts p';
  if (driver) {
    // CROSS JOIN pins the join order: SQLite drives from the taxonomy index
    // (just this section's rows) and PK-looks-up each post. A plain JOIN lets
    // it drive from posts-by-date and probe membership, which scans the whole
    // live table for a small section.
    from = 'post_taxonomies pt CROSS JOIN posts p';
    where.push('p.id = pt.post_id', 'pt.kind = ?', 'pt.slug = ?');
    binds.push(driver.kind, driver.slug);
  }
  where.push('p.published = 1', "p.sort_at <= strftime('%Y-%m-%dT%H:%M:%SZ','now')");

  if (opts.category && opts.tag) {
    where.push("p.id IN (SELECT post_id FROM post_taxonomies WHERE kind = 'tags' AND slug = ?)");
    binds.push(opts.tag);
  }
  if (opts.q) {
    where.push('(p.title LIKE ? OR p.content LIKE ? OR p.author LIKE ?)');
    const like = `%${opts.q}%`;
    binds.push(like, like, like);
  }

  const whereSql = where.join(' AND ');
  const order = opts.sort === 'oldest' ? 'ORDER BY p.sort_at ASC' : 'ORDER BY p.sort_at DESC';

  // The unfiltered live archive (every ?page=N of /news) is the page bots walk,
  // and its COUNT(*) range-scans every published row. That total barely moves
  // between edits, so read it from the settings cache (refreshed on every write)
  // instead of counting live. Filtered and searched listings keep the live
  // count: a category/tag drives from the taxonomy index (just that section),
  // and search is disallowed to crawlers.
  let total: number;
  if (!driver && !opts.q) {
    total = await getCachedLiveCount(db);
  } else {
    const count = await db
      .prepare(`SELECT COUNT(*) AS n FROM ${from} WHERE ${whereSql}`)
      .bind(...binds)
      .first<{ n: number }>();
    total = count?.n ?? 0;
  }
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, opts.page ?? 1), totalPages);

  const { results } = await db
    .prepare(`SELECT p.* FROM ${from} WHERE ${whereSql} ${order} LIMIT ? OFFSET ?`)
    .bind(...binds, perPage, (page - 1) * perPage)
    .all<PostRow>();

  return { rows: results ?? [], total, page, totalPages };
}

/** Featured posts for the homepage hero, newest first. */
export async function getFeaturedPosts(db: D1Database, limit = 6): Promise<PostRow[]> {
  const { results } = await db
    .prepare(`SELECT * FROM posts WHERE ${LIVE_WHERE} AND featured = 1 ${ORDER} LIMIT ?`)
    .bind(limit)
    .all<PostRow>();
  return results ?? [];
}

export async function getPublishedPosts(db: D1Database, limit = 0): Promise<PostRow[]> {
  const sql = `SELECT * FROM posts WHERE ${LIVE_WHERE} ${ORDER}${limit ? ` LIMIT ${limit}` : ''}`;
  const { results } = await db.prepare(sql).all<PostRow>();
  return results ?? [];
}

export async function getPostBySlug(db: D1Database, slug: string): Promise<PostRow | null> {
  return await db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first<PostRow>();
}

export async function getPostById(db: D1Database, id: number): Promise<PostRow | null> {
  return await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first<PostRow>();
}

/**
 * Posts sharing a category with `row`, newest first — the "related" strip
 * under a single post.
 */
export async function getRelatedPosts(db: D1Database, row: PostRow, limit = 4): Promise<PostRow[]> {
  const cats = parseTaxonomies(row.categories);
  if (cats.length > 0) {
    // Drive from the category's join rows rather than scanning posts by date.
    // CROSS JOIN drives from the category's index rows (see getPublishedPage).
    const { results } = await db
      .prepare(
        `SELECT p.* FROM post_taxonomies pt
           CROSS JOIN posts p
          WHERE p.id = pt.post_id AND pt.kind = 'categories' AND pt.slug = ?
            AND p.published = 1 AND p.sort_at <= strftime('%Y-%m-%dT%H:%M:%SZ','now')
            AND p.id != ?
          ORDER BY p.sort_at DESC LIMIT ?`
      )
      .bind(cats[0].slug, row.id, limit)
      .all<PostRow>();
    if (results && results.length > 0) return results;
  }
  const { results } = await db
    .prepare(`SELECT * FROM posts WHERE ${LIVE_WHERE} AND id != ? ${ORDER} LIMIT ?`)
    .bind(row.id, limit)
    .all<PostRow>();
  return results ?? [];
}

/**
 * Every category (or tag) in use on published posts, with counts. Reads the
 * indexed post_taxonomies join table (migrations/0007) instead of pulling and
 * JSON-parsing every row, but it still aggregates across all live posts — a few
 * thousand index rows. That's fine for the archive pages that ask for a fresh
 * count, but too much to run on every page: the header uses the cached wrapper
 * below instead. See getCachedTaxonomyCounts.
 */
export async function getTaxonomyCounts(
  db: D1Database,
  column: 'categories' | 'tags'
): Promise<(Taxonomy & { count: number })[]> {
  const { results } = await db
    .prepare(
      `SELECT pt.slug AS slug, pt.title AS title, COUNT(*) AS count
         FROM post_taxonomies pt
         JOIN posts p ON p.id = pt.post_id
        WHERE pt.kind = ?
          AND p.published = 1 AND p.sort_at <= strftime('%Y-%m-%dT%H:%M:%SZ','now')
          AND pt.slug != 'uncategorized'
        GROUP BY pt.slug, pt.title
        ORDER BY count DESC`
    )
    .bind(column)
    .all<Taxonomy & { count: number }>();
  return results ?? [];
}

/** settings keys holding the pre-aggregated taxonomy counts. */
const TAX_CACHE_KEY = { categories: 'tax_counts_categories', tags: 'tax_counts_tags' } as const;

/** settings key holding the pre-aggregated count of live (published, past) posts. */
const LIVE_COUNT_KEY = 'live_post_count';

/**
 * The number of live posts, for the unfiltered archive's pagination — read from
 * the settings cache, not counted per request.
 *
 * The COUNT(*) this replaces range-scans every published row (~1k) on every
 * `/news` and `?page=N` render, and crawlers walking the pagination made that
 * the single biggest source of D1 row reads on the Workers Free plan. The total
 * moves only when a post is created/deleted or crosses its publish time, so a
 * cached value refreshed on every write (like the taxonomy counts) is
 * effectively always right; a scheduled post going live can leave it off by a
 * few until the next write, which at most misplaces a handful of posts on the
 * final archive page — immaterial, and the same staleness the nav counts accept.
 */
export async function getCachedLiveCount(db: D1Database): Promise<number> {
  const cached = await getSetting<number | null>(db, LIVE_COUNT_KEY, null);
  if (typeof cached === 'number') return cached;
  const fresh = await countLivePosts(db);
  await setSetting(db, LIVE_COUNT_KEY, fresh);
  return fresh;
}

/** Count live posts directly (the range scan the cache exists to avoid). */
async function countLivePosts(db: D1Database): Promise<number> {
  const row = await db
    .prepare(`SELECT COUNT(*) AS n FROM posts WHERE ${LIVE_WHERE}`)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

/**
 * Taxonomy counts for the hot path (the header renders on every page). Reads a
 * single pre-aggregated row from `settings` rather than scanning the join table
 * per request. Refreshed by refreshTaxonomyCache() whenever a post is written;
 * the first read after a deploy computes and stores it lazily. Scheduled posts
 * crossing their publish time can leave a count a little stale until the next
 * write, which is immaterial for nav counts.
 */
export async function getCachedTaxonomyCounts(
  db: D1Database,
  column: 'categories' | 'tags'
): Promise<(Taxonomy & { count: number })[]> {
  const cached = await getSetting<(Taxonomy & { count: number })[] | null>(db, TAX_CACHE_KEY[column], null);
  if (cached) return cached;
  const fresh = await getTaxonomyCounts(db, column);
  await setSetting(db, TAX_CACHE_KEY[column], fresh);
  return fresh;
}

/**
 * Recompute and store the cached counts the public pages read without scanning:
 * both taxonomy count lists and the live-post total. Called after any post
 * write (create/update/delete), so the caches never drift from a content edit.
 */
export async function refreshTaxonomyCache(db: D1Database): Promise<void> {
  for (const column of ['categories', 'tags'] as const) {
    await setSetting(db, TAX_CACHE_KEY[column], await getTaxonomyCounts(db, column));
  }
  await setSetting(db, LIVE_COUNT_KEY, await countLivePosts(db));
}

/**
 * The display title for one category/tag slug — a single indexed lookup, so the
 * archive pages don't aggregate every taxonomy just to name their heading.
 */
export async function getTaxonomyTitle(
  db: D1Database,
  kind: 'categories' | 'tags',
  slug: string
): Promise<string | null> {
  const row = await db
    .prepare('SELECT title FROM post_taxonomies WHERE kind = ? AND slug = ? LIMIT 1')
    .bind(kind, slug)
    .first<{ title: string }>();
  return row?.title ?? null;
}

/** True when `slug` is already taken by a different post. */
export async function slugTaken(db: D1Database, slug: string, exceptId = 0): Promise<boolean> {
  const row = await db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').bind(slug, exceptId).first<{
    id: number;
  }>();
  return !!row;
}

export interface PostInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  imageAlt?: string;
  categories?: Taxonomy[];
  tags?: Taxonomy[];
  author?: string;
  featured?: boolean;
  publish: boolean;
  /**
   * UTC instant to publish at (ISO string). Empty/undefined means automatic:
   * stamped the first time the post goes live, kept thereafter. A future
   * instant queues the post — it goes live on the site at that moment.
   */
  publishedAt?: string;
}

export async function createPost(db: D1Database, p: PostInput): Promise<number> {
  const res = await db
    .prepare(
      `INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, featured, published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      p.title,
      p.slug,
      p.content,
      p.excerpt,
      p.imageUrl ?? '',
      p.imageAlt ?? '',
      JSON.stringify(p.categories ?? []),
      JSON.stringify(p.tags ?? []),
      p.author ?? '',
      p.featured ? 1 : 0,
      p.publish ? 1 : 0,
      p.publishedAt || (p.publish ? new Date().toISOString() : null)
    )
    .run();
  // The triggers in migrations/0007 have already filled post_taxonomies for the
  // new row; refresh the cached counts the header reads.
  await refreshTaxonomyCache(db);
  return Number(res.meta.last_row_id);
}

export async function updatePost(db: D1Database, id: number, p: PostInput): Promise<void> {
  // An explicit publishedAt always wins (backdating or scheduling). Otherwise
  // published_at is stamped the first time a post goes live and kept
  // thereafter, so re-editing a published post doesn't reorder the archive.
  const publishedAt = p.publishedAt ?? '';
  await db
    .prepare(
      `UPDATE posts
          SET title = ?, slug = ?, content = ?, excerpt = ?, image_url = ?, image_alt = ?,
              categories = ?, tags = ?, author = ?, featured = ?,
              published = ?, updated_at = datetime('now'),
              published_at = CASE
                WHEN ? != '' THEN ?
                WHEN ? = 1 AND published_at IS NULL THEN ?
                ELSE published_at END
        WHERE id = ?`
    )
    .bind(
      p.title,
      p.slug,
      p.content,
      p.excerpt,
      p.imageUrl ?? '',
      p.imageAlt ?? '',
      JSON.stringify(p.categories ?? []),
      JSON.stringify(p.tags ?? []),
      p.author ?? '',
      p.featured ? 1 : 0,
      p.publish ? 1 : 0,
      publishedAt,
      publishedAt,
      p.publish ? 1 : 0,
      new Date().toISOString(),
      id
    )
    .run();
  await refreshTaxonomyCache(db);
}

export async function deletePost(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  await refreshTaxonomyCache(db);
}
