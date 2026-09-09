import { cachedContentValue, resetContentState } from '~/lib/content-cache';
import { isReservedPostSlug } from '~/lib/reserved-post-slugs';

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

export type PostSummary = Omit<PostRow, 'content'>;

export interface PostListPage {
  rows: PostSummary[];
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

export const LIVE_WHERE = "published = 1 AND sort_at <= strftime('%Y-%m-%dT%H:%M:%SZ','now')";
const fields = [
  'id',
  'title',
  'slug',
  'excerpt',
  'image_url',
  'image_alt',
  'categories',
  'tags',
  'author',
  'wp_id',
  'featured',
  'published',
  'created_at',
  'updated_at',
  'published_at',
];
const summaryColumns = (alias = 'p') => fields.map((field) => `${alias}.${field}`).join(', ');
const validPage = (page?: number) => (Number.isSafeInteger(page) && page! > 0 ? page! : 1);
const validLimit = (n: number | undefined, fallback: number) =>
  Number.isSafeInteger(n) && n! > 0 ? Math.min(n!, 100) : fallback;

export function publicationTime(value: string): number {
  const iso = value.trim().replace(' ', 'T');
  const parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!parts) return NaN;
  const [, year, month, day, hour, minute] = parts.map(Number);
  const monthEnd = new Date(0);
  monthEnd.setUTCFullYear(year, month, 0);
  if (month < 1 || month > 12 || day < 1 || day > monthEnd.getUTCDate() || hour > 23 || minute > 59) return NaN;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?$/i.test(iso)) return NaN;
  return Date.parse(/(?:Z|[+-]\d{2}:\d{2})$/i.test(iso) ? iso : `${iso}Z`);
}

export function isLive(row: Pick<PostRow, 'published' | 'published_at' | 'created_at'>): boolean {
  if (row.published !== 1) return false;
  const stamp = publicationTime(row.published_at || row.created_at);
  return Number.isFinite(stamp) && stamp <= Date.now();
}

function validatePostInput(p: PostInput): void {
  if (isReservedPostSlug(p.slug)) throw new Error('This web address is reserved for a site page.');
  if (p.publishedAt && !Number.isFinite(publicationTime(p.publishedAt)))
    throw new Error('Please choose a valid publication date.');
}

export async function getAdminPostPage(
  db: D1Database,
  opts: {
    page?: number;
    q?: string;
    status?: string;
    category?: string;
    sort?: string;
  } = {}
): Promise<PostListPage> {
  const where: string[] = [];
  const binds: (number | string)[] = [];
  if (opts.q) {
    where.push("(p.title LIKE ? ESCAPE '\\' OR p.slug LIKE ? ESCAPE '\\' OR p.author LIKE ? ESCAPE '\\')");
    const like = `%${opts.q.replace(/[\\%_]/g, '\\$&')}%`;
    binds.push(like, like, like);
  }
  if (opts.status === 'published') where.push(`p.${LIVE_WHERE.replace('sort_at', 'p.sort_at')}`);
  if (opts.status === 'draft') where.push('p.published = 0');
  if (opts.status === 'scheduled') where.push("p.published = 1 AND p.sort_at > strftime('%Y-%m-%dT%H:%M:%SZ','now')");
  if (opts.status === 'featured') where.push('p.featured = 1');
  if (opts.category) {
    where.push("p.id IN (SELECT post_id FROM post_taxonomies WHERE kind = 'categories' AND slug = ?)");
    binds.push(opts.category);
  }
  const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const total =
    (
      await db
        .prepare(`SELECT COUNT(*) AS n FROM posts p ${filter}`)
        .bind(...binds)
        .first<{ n: number }>()
    )?.n ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 25));
  const page = Math.min(validPage(opts.page), totalPages);
  const order =
    opts.sort === 'title'
      ? 'p.title COLLATE NOCASE, p.id'
      : opts.sort === 'oldest'
        ? 'p.sort_at ASC, p.id'
        : !opts.status
          ? 'p.published DESC, p.sort_at DESC, p.id DESC'
          : 'p.sort_at DESC, p.id DESC';
  const { results } = await db
    .prepare(`SELECT ${summaryColumns()} FROM posts p ${filter} ORDER BY ${order} LIMIT 25 OFFSET ?`)
    .bind(...binds, (page - 1) * 25)
    .all<PostSummary>();
  return { rows: results ?? [], total, totalPages, page };
}

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
  const perPage = validLimit(opts.perPage, POSTS_PER_PAGE);
  const driver = opts.category
    ? { kind: 'categories', slug: opts.category }
    : opts.tag
      ? { kind: 'tags', slug: opts.tag }
      : null;
  const alias = driver ? 'pt' : 'p';
  const from = driver ? 'post_taxonomies pt CROSS JOIN posts p' : 'posts p';
  const where = [`${alias}.published = 1`, `${alias}.sort_at <= strftime('%Y-%m-%dT%H:%M:%SZ','now')`];
  const binds: (string | number)[] = [];
  if (driver) {
    where.push('p.id = pt.post_id', 'pt.kind = ?', 'pt.slug = ?');
    binds.push(driver.kind, driver.slug);
  }
  if (opts.category && opts.tag) {
    where.push("p.id IN (SELECT post_id FROM post_taxonomies WHERE kind = 'tags' AND slug = ?)");
    binds.push(opts.tag);
  }
  if (opts.q) {
    where.push('(p.title LIKE ? OR p.content LIKE ? OR p.author LIKE ?)');
    const like = `%${opts.q}%`;
    binds.push(like, like, like);
  }
  let total: number;
  if (!driver && !opts.q) total = await getCachedLiveCount(db);
  else if (driver && !opts.q && !(opts.category && opts.tag)) {
    // Cache the whole count map, including uncategorized, rather than a row
    // for every arbitrary user-supplied taxonomy slug.
    const counts = await cachedContentValue<Record<string, number>>(db, `section-counts:${driver.kind}`, async () => {
      const { results } = await db
        .prepare(`SELECT slug, COUNT(*) AS n FROM post_taxonomies WHERE kind = ? AND ${LIVE_WHERE} GROUP BY slug`)
        .bind(driver.kind)
        .all<{ slug: string; n: number }>();
      return Object.fromEntries((results ?? []).map((row) => [row.slug, row.n]));
    });
    total = Object.hasOwn(counts, driver.slug) ? counts[driver.slug] : 0;
  } else {
    total =
      (
        await db
          .prepare(`SELECT COUNT(*) AS n FROM ${from} WHERE ${where.join(' AND ')}`)
          .bind(...binds)
          .first<{ n: number }>()
      )?.n ?? 0;
  }
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(validPage(opts.page), totalPages);
  const { results } = await db
    .prepare(
      `SELECT ${summaryColumns()} FROM ${from} WHERE ${where.join(' AND ')} ORDER BY ${alias}.sort_at ${opts.sort === 'oldest' ? 'ASC' : 'DESC'} LIMIT ? OFFSET ?`
    )
    .bind(...binds, perPage, (page - 1) * perPage)
    .all<PostSummary>();
  return { rows: results ?? [], total, page, totalPages };
}

export async function getFeaturedPosts(db: D1Database, limit = 6): Promise<PostSummary[]> {
  return (
    (
      await db
        .prepare(
          `SELECT ${summaryColumns()} FROM posts p WHERE ${LIVE_WHERE} AND featured = 1 ORDER BY sort_at DESC LIMIT ?`
        )
        .bind(validLimit(limit, 6))
        .all<PostSummary>()
    ).results ?? []
  );
}

export async function getPublishedPosts(db: D1Database, limit = 20): Promise<PostSummary[]> {
  return (
    (
      await db
        .prepare(`SELECT ${summaryColumns()} FROM posts p WHERE ${LIVE_WHERE} ORDER BY sort_at DESC LIMIT ?`)
        .bind(validLimit(limit, 20))
        .all<PostSummary>()
    ).results ?? []
  );
}

export async function getLatestCategoryPosts(
  db: D1Database,
  slug: string,
  limit = 1,
  exceptId = 0
): Promise<PostSummary[]> {
  return (
    (
      await db
        .prepare(
          `SELECT ${summaryColumns()} FROM post_taxonomies pt CROSS JOIN posts p
    WHERE pt.kind = 'categories' AND pt.slug = ? AND pt.published = 1
      AND pt.sort_at <= strftime('%Y-%m-%dT%H:%M:%SZ','now') AND p.id = pt.post_id AND pt.post_id != ?
    ORDER BY pt.sort_at DESC LIMIT ?`
        )
        .bind(slug, exceptId, validLimit(limit, 1))
        .all<PostSummary>()
    ).results ?? []
  );
}

export async function getRelatedPosts(db: D1Database, row: PostRow, limit = 4): Promise<PostSummary[]> {
  const cats = parseTaxonomies(row.categories);
  if (cats.length) {
    const results = await getLatestCategoryPosts(db, cats[0].slug, limit, row.id);
    if (results.length) return results;
  }
  return (
    (
      await db
        .prepare(
          `SELECT ${summaryColumns()} FROM posts p WHERE ${LIVE_WHERE} AND id != ? ORDER BY sort_at DESC LIMIT ?`
        )
        .bind(row.id, validLimit(limit, 4))
        .all<PostSummary>()
    ).results ?? []
  );
}

export async function getPostBySlug(db: D1Database, slug: string): Promise<PostRow | null> {
  return db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first<PostRow>();
}
export async function getPostById(db: D1Database, id: number): Promise<PostRow | null> {
  return db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first<PostRow>();
}

export async function getTaxonomyCounts(
  db: D1Database,
  column: 'categories' | 'tags'
): Promise<(Taxonomy & { count: number })[]> {
  return (
    (
      await db
        .prepare(
          `SELECT slug, title, COUNT(*) AS count FROM post_taxonomies WHERE kind = ? AND ${LIVE_WHERE} AND slug != 'uncategorized' GROUP BY slug, title ORDER BY count DESC`
        )
        .bind(column)
        .all<Taxonomy & { count: number }>()
    ).results ?? []
  );
}
export const getCachedTaxonomyCounts = (db: D1Database, column: 'categories' | 'tags') =>
  cachedContentValue(db, `tax:${column}`, () => getTaxonomyCounts(db, column));
export const getCachedLiveCount = (db: D1Database) =>
  cachedContentValue(
    db,
    'live-count',
    async () => (await db.prepare(`SELECT COUNT(*) AS n FROM posts WHERE ${LIVE_WHERE}`).first<{ n: number }>())?.n ?? 0
  );

export async function getTaxonomyTitle(
  db: D1Database,
  kind: 'categories' | 'tags',
  slug: string
): Promise<string | null> {
  return (
    (
      await db
        .prepare('SELECT title FROM post_taxonomies WHERE kind = ? AND slug = ? LIMIT 1')
        .bind(kind, slug)
        .first<{ title: string }>()
    )?.title ?? null
  );
}
export async function slugTaken(db: D1Database, slug: string, exceptId = 0): Promise<boolean> {
  if (isReservedPostSlug(slug)) return true;
  return !!(await db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').bind(slug, exceptId).first());
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
  validatePostInput(p);
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
  // Triggers update taxonomy rows and the public cache revision atomically.
  resetContentState(db);
  return Number(res.meta.last_row_id);
}

export async function updatePost(db: D1Database, id: number, p: PostInput): Promise<void> {
  // An explicit publishedAt always wins (backdating or scheduling). Otherwise
  // published_at is stamped the first time a post goes live and kept
  // thereafter, so re-editing a published post doesn't reorder the archive.
  validatePostInput(p);
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
  resetContentState(db);
}

export async function deletePost(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  resetContentState(db);
}
