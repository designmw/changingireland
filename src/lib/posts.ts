/**
 * Magazine posts stored in D1 — the data behind /admin and every archive page.
 *
 * Ported from the iscphm site and extended for the WordPress import:
 * categories/tags are JSON arrays of {slug, title}, author is a display name,
 * and wp_id ties a row back to its original WordPress post so the import is
 * idempotent. See migrations/0002_posts.sql.
 */

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

const ORDER = 'ORDER BY COALESCE(published_at, created_at) DESC';

export async function getAllPosts(db: D1Database): Promise<PostRow[]> {
  const { results } = await db.prepare(`SELECT * FROM posts ${ORDER}`).all<PostRow>();
  return results ?? [];
}

/**
 * One page of published posts, optionally filtered by category slug, tag slug,
 * or a search query. Filters run in SQL (JSON columns matched with LIKE on the
 * serialised `"slug":"…"` pair — fine at this scale, ~1k rows).
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
  const where: string[] = ['published = 1'];
  const binds: (string | number)[] = [];

  if (opts.category) {
    where.push('categories LIKE ?');
    binds.push(`%"slug":${JSON.stringify(opts.category)}%`);
  }
  if (opts.tag) {
    where.push('tags LIKE ?');
    binds.push(`%"slug":${JSON.stringify(opts.tag)}%`);
  }
  if (opts.q) {
    where.push('(title LIKE ? OR content LIKE ? OR author LIKE ?)');
    const like = `%${opts.q}%`;
    binds.push(like, like, like);
  }

  const whereSql = where.join(' AND ');
  const count = await db
    .prepare(`SELECT COUNT(*) AS n FROM posts WHERE ${whereSql}`)
    .bind(...binds)
    .first<{ n: number }>();
  const total = count?.n ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, opts.page ?? 1), totalPages);

  const order = opts.sort === 'oldest' ? 'ORDER BY COALESCE(published_at, created_at) ASC' : ORDER;
  const { results } = await db
    .prepare(`SELECT * FROM posts WHERE ${whereSql} ${order} LIMIT ? OFFSET ?`)
    .bind(...binds, perPage, (page - 1) * perPage)
    .all<PostRow>();

  return { rows: results ?? [], total, page, totalPages };
}

/** Featured posts for the homepage hero, newest first. */
export async function getFeaturedPosts(db: D1Database, limit = 6): Promise<PostRow[]> {
  const { results } = await db
    .prepare(`SELECT * FROM posts WHERE published = 1 AND featured = 1 ${ORDER} LIMIT ?`)
    .bind(limit)
    .all<PostRow>();
  return results ?? [];
}

export async function getPublishedPosts(db: D1Database, limit = 0): Promise<PostRow[]> {
  const sql = `SELECT * FROM posts WHERE published = 1 ${ORDER}${limit ? ` LIMIT ${limit}` : ''}`;
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
    const { results } = await db
      .prepare(`SELECT * FROM posts WHERE published = 1 AND id != ? AND categories LIKE ? ${ORDER} LIMIT ?`)
      .bind(row.id, `%"slug":${JSON.stringify(cats[0].slug)}%`, limit)
      .all<PostRow>();
    if (results && results.length > 0) return results;
  }
  const { results } = await db
    .prepare(`SELECT * FROM posts WHERE published = 1 AND id != ? ${ORDER} LIMIT ?`)
    .bind(row.id, limit)
    .all<PostRow>();
  return results ?? [];
}

/**
 * Every category (or tag) in use on published posts, with counts, derived from
 * the JSON columns. Reads slugs+titles only, so it stays cheap enough to run
 * per request on the archive pages.
 */
export async function getTaxonomyCounts(
  db: D1Database,
  column: 'categories' | 'tags'
): Promise<(Taxonomy & { count: number })[]> {
  const { results } = await db.prepare(`SELECT ${column} AS tax FROM posts WHERE published = 1`).all<{ tax: string }>();
  const counts = new Map<string, Taxonomy & { count: number }>();
  for (const r of results ?? []) {
    for (const t of parseTaxonomies(r.tax)) {
      const cur = counts.get(t.slug);
      if (cur) cur.count++;
      else counts.set(t.slug, { ...t, count: 1 });
    }
  }
  // WP's default bucket isn't a real section — keep it off menus and strips
  // (the /category/uncategorized archive itself still resolves).
  counts.delete('uncategorized');
  return [...counts.values()].sort((a, b) => b.count - a.count);
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
      p.publish ? new Date().toISOString() : null
    )
    .run();
  return Number(res.meta.last_row_id);
}

export async function updatePost(db: D1Database, id: number, p: PostInput): Promise<void> {
  // published_at is stamped the first time a post goes live and kept thereafter,
  // so re-editing a published post doesn't reorder the archive.
  await db
    .prepare(
      `UPDATE posts
          SET title = ?, slug = ?, content = ?, excerpt = ?, image_url = ?, image_alt = ?,
              categories = ?, tags = ?, author = ?, featured = ?,
              published = ?, updated_at = datetime('now'),
              published_at = CASE WHEN ? = 1 AND published_at IS NULL THEN ? ELSE published_at END
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
      p.publish ? 1 : 0,
      new Date().toISOString(),
      id
    )
    .run();
}

export async function deletePost(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
}
