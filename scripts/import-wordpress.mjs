#!/usr/bin/env node
/**
 * Import the changingireland.ie WordPress content into the site's D1 database.
 *
 *   node scripts/import-wordpress.mjs            # fetch + import posts into LOCAL D1
 *   node scripts/import-wordpress.mjs --remote   # same, into the production database
 *   node scripts/import-wordpress.mjs --media    # size the media library only (no import)
 *   node scripts/import-wordpress.mjs --authors  # backfill author names from the RSS feed
 *   node scripts/import-wordpress.mjs --offline  # re-import from the cached JSON, no fetching
 *
 * Sources everything from the open REST API at /wp-json/wp/v2/ (the /users
 * endpoint is 401, so author names come from ?_embed on each post). Fetched
 * data is cached under scripts/data/ so re-runs and the later design pass
 * (which needs the 17 WP pages) don't re-download. The import is idempotent:
 * rows are keyed on wp_id (UNIQUE) and upserted, so it is safe to re-run.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'scripts', 'data');
const SQL_DIR = path.join(DATA_DIR, 'sql');
const API = 'https://changingireland.ie/wp-json/wp/v2';
const DB_NAME = 'changingireland-db';

const args = new Set(process.argv.slice(2));
const REMOTE = args.has('--remote');
const MEDIA_ONLY = args.has('--media');
const AUTHORS_ONLY = args.has('--authors');
const OFFLINE = args.has('--offline');

fs.mkdirSync(SQL_DIR, { recursive: true });

// ---------------------------------------------------------------- helpers

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'changingireland-astro-import/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return { body: await res.json(), totalPages: Number(res.headers.get('x-wp-totalpages') ?? 1) };
    } catch (err) {
      if (attempt === 4) throw err;
      console.warn(`  retry ${attempt} after: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

/** Fetch every page of a paginated collection endpoint. */
async function fetchAll(endpoint, params = {}) {
  const items = [];
  let page = 1;
  let totalPages = 1;
  do {
    const qs = new URLSearchParams({ per_page: '100', page: String(page), ...params });
    const url = `${API}/${endpoint}?${qs}`;
    process.stdout.write(`  ${endpoint} page ${page}${totalPages > 1 ? `/${totalPages}` : ''}…\r`);
    const { body, totalPages: tp } = await fetchJson(url);
    totalPages = tp;
    items.push(...body);
    page++;
  } while (page <= totalPages);
  console.log(`  ${endpoint}: ${items.length} items${' '.repeat(20)}`);
  return items;
}

/** Decode the HTML entities WordPress leaves in titles and excerpts. */
function decodeEntities(s) {
  return String(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&(ldquo|rdquo);/g, '"')
    .replace(/&(lsquo|rsquo);/g, '’')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** Strip WP block comments and shortcode litter; keep the real HTML. */
function cleanContent(html) {
  return (
    String(html)
      // Gutenberg block delimiters: <!-- wp:paragraph {...} --> … <!-- /wp:paragraph -->
      .replace(/<!--\s*\/?wp:[^>]*-->\s*/g, '')
      // Any other HTML comments WP litters about (e.g. more tag)
      .replace(/<!--[\s\S]*?-->/g, '')
      // Page-builder / plugin shortcodes that render as visible litter
      .replace(/\[\/?(?:vc_|et_pb_|fusion_|av_|kc_|mk_)[^\]]*\]/g, '')
      .replace(/\[\/?(?:caption|gallery|embed|playlist|audio|video|su_\w+)[^\]]*\]/g, '')
      // WP attribute litter (class="wp-block-paragraph" etc.) so the /admin
      // editor shows clean HTML. Keeps href/src/alt/srcset/width/height.
      .replace(/\s(?:class|style|id|dir|data-[\w-]+)="[^"]*"/gi, '')
      // Collapse the blank-line runs the stripped block comments leave behind
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

/** Plain-text excerpt from WP's rendered excerpt (or content as fallback). */
// Generous limit: the single-post template shows the excerpt as the intro
// paragraph, so cutting at ~200 chars left it ending mid-sentence ("It…").
// Cards clamp visually (line-clamp) and meta descriptions slice at render.
function makeExcerpt(html, limit = 500) {
  const text = decodeEntities(
    String(html)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
  return text.length <= limit ? text : text.slice(0, limit).replace(/\s+\S*$/, '') + '…';
}

const sq = (s) => `'${String(s).replace(/'/g, "''")}'`;

function runSqlFile(file) {
  const flags = [REMOTE ? '--remote' : '--local', '--file', file];
  execFileSync('npx', ['wrangler', 'd1', 'execute', DB_NAME, '-y', ...flags], {
    cwd: ROOT,
    stdio: ['ignore', 'ignore', 'inherit'],
  });
}

function cachePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function saveCache(name, data) {
  fs.writeFileSync(cachePath(name), JSON.stringify(data, null, 1));
}

function loadCache(name) {
  return JSON.parse(fs.readFileSync(cachePath(name), 'utf8'));
}

// ---------------------------------------------------------------- media sizing

async function sizeMedia() {
  console.log('Fetching media library…');
  const media = OFFLINE
    ? loadCache('wp-media')
    : await fetchAll('media', { _fields: 'id,source_url,mime_type,media_details,alt_text' });
  if (!OFFLINE) saveCache('wp-media', media);

  let known = 0;
  let knownBytes = 0;
  const byType = new Map();
  for (const m of media) {
    const size = m.media_details?.filesize;
    const type = m.mime_type ?? 'unknown';
    const t = byType.get(type) ?? { count: 0, bytes: 0 };
    t.count++;
    if (size) {
      known++;
      knownBytes += size;
      t.bytes += size;
    }
    byType.set(type, t);
  }
  const fmt = (b) => `${(b / 1024 / 1024).toFixed(1)} MB`;
  console.log(`\nMedia library: ${media.length} items`);
  console.log(`Sizes known for ${known} items (media_details.filesize): ${fmt(knownBytes)}`);
  if (known > 0 && known < media.length) {
    const est = (knownBytes / known) * media.length;
    console.log(`Estimated total (scaled): ${fmt(est)}`);
  }
  console.log('\nBy type:');
  for (const [type, t] of [...byType.entries()].sort((a, b) => b[1].bytes - a[1].bytes)) {
    console.log(`  ${type.padEnd(30)} ${String(t.count).padStart(5)} items  ${fmt(t.bytes)}`);
  }
}

// ---------------------------------------------------------------- authors

/**
 * The REST API hides users entirely (every author embed 404s), but the RSS
 * feed carries real names in dc:creator. Walk /feed/?paged=N (10 posts a
 * page), map each item's guid (?p=<wp_id>) to its creator, and backfill the
 * author column.
 */
async function backfillAuthors() {
  let byId;
  if (OFFLINE && fs.existsSync(cachePath('wp-authors'))) {
    byId = new Map(Object.entries(loadCache('wp-authors')).map(([k, v]) => [Number(k), v]));
  } else {
    byId = new Map();
    for (let page = 1; page <= 200; page++) {
      const res = await fetch(`https://changingireland.ie/feed/?paged=${page}`, {
        headers: { 'User-Agent': 'changingireland-astro-import/1.0' },
        redirect: 'follow',
      });
      if (res.status === 404) break; // past the last page
      if (!res.ok) throw new Error(`HTTP ${res.status} on feed page ${page}`);
      const xml = await res.text();
      const items = xml.split('<item>').slice(1);
      if (items.length === 0) break;
      for (const item of items) {
        const guid = item.match(/<guid[^>]*>([^<]+)<\/guid>/)?.[1] ?? '';
        const creator = item.match(/<dc:creator><!\[CDATA\[([\s\S]*?)\]\]><\/dc:creator>/)?.[1]?.trim() ?? '';
        const wpId = Number(guid.match(/[?&]p=(\d+)/)?.[1] ?? 0);
        if (wpId && creator) byId.set(wpId, creator);
      }
      process.stdout.write(`  feed page ${page} (${byId.size} authors mapped)\r`);
    }
    console.log();

    // The feed only reaches back so far; older posts expose their author via
    // <meta name="author"> on the live page (Yoast). Fetch just the stragglers.
    const posts = loadCache('wp-posts');
    const missing = posts.filter((p) => !byId.has(p.id));
    if (missing.length > 0) {
      console.log(`Fetching ${missing.length} older post pages for their author meta tag…`);
      let done = 0;
      const POOL = 8;
      const queue = [...missing];
      await Promise.all(
        Array.from({ length: POOL }, async () => {
          for (let p = queue.shift(); p; p = queue.shift()) {
            try {
              const res = await fetch(p.link, {
                headers: { 'User-Agent': 'changingireland-astro-import/1.0' },
                redirect: 'follow',
              });
              if (res.ok) {
                const html = await res.text();
                const name =
                  html.match(/<meta\s+name="author"\s+content="([^"]+)"/i)?.[1] ??
                  html.match(/"author":\{"name":"([^"]+)"/)?.[1] ??
                  '';
                if (name) byId.set(p.id, decodeEntities(name));
              }
            } catch {
              // leave this post authorless rather than failing the run
            }
            done++;
            if (done % 20 === 0) process.stdout.write(`  ${done}/${missing.length}\r`);
          }
        })
      );
      console.log(`  ${done}/${missing.length} pages checked`);
    }
    saveCache('wp-authors', Object.fromEntries(byId));
  }

  const updates = [...byId.entries()].map(
    ([wpId, name]) => `UPDATE posts SET author = ${sq(name)} WHERE wp_id = ${wpId};`
  );
  const CHUNK = 200;
  console.log(`Backfilling ${updates.length} author names into ${REMOTE ? 'REMOTE' : 'local'} D1…`);
  for (let i = 0; i < updates.length; i += CHUNK) {
    const file = path.join(SQL_DIR, `authors-${String(i / CHUNK).padStart(3, '0')}.sql`);
    fs.writeFileSync(file, updates.slice(i, i + CHUNK).join('\n'));
    runSqlFile(file);
    process.stdout.write(`  ${Math.min(i + CHUNK, updates.length)}/${updates.length}\r`);
  }
  console.log(`\nDone. Authors set on ${updates.length} posts.`);
}

// ---------------------------------------------------------------- import

async function importAll() {
  let categories, tags, posts, pages;
  if (OFFLINE) {
    console.log('Using cached JSON from scripts/data/…');
    categories = loadCache('wp-categories');
    tags = loadCache('wp-tags');
    posts = loadCache('wp-posts');
    pages = loadCache('wp-pages');
  } else {
    console.log('Fetching taxonomies…');
    categories = await fetchAll('categories', { _fields: 'id,slug,name,count' });
    tags = await fetchAll('tags', { _fields: 'id,slug,name,count' });
    console.log('Fetching posts (with _embed for authors + featured images)…');
    posts = await fetchAll('posts', { _embed: '1' });
    console.log('Fetching pages…');
    pages = await fetchAll('pages', {});
    saveCache('wp-categories', categories);
    saveCache('wp-tags', tags);
    saveCache('wp-posts', posts);
    saveCache('wp-pages', pages);
    console.log(`Cached raw JSON in scripts/data/ (pages are used later by the design pass).`);
  }

  const catById = new Map(categories.map((c) => [c.id, { slug: c.slug, title: decodeEntities(c.name) }]));
  const tagById = new Map(tags.map((t) => [t.id, { slug: t.slug, title: decodeEntities(t.name) }]));

  const seenSlugs = new Set();
  const rows = [];
  let missingAuthor = 0;

  for (const p of posts) {
    if (p.status && p.status !== 'publish') continue;
    let slug = decodeURIComponent(p.slug);
    // Slug collisions shouldn't happen in WP, but the column is UNIQUE — keep
    // the first occurrence and suffix any duplicate rather than dropping it.
    while (seenSlugs.has(slug.toLowerCase())) slug = `${slug}-${p.id}`;
    seenSlugs.add(slug.toLowerCase());

    const author = decodeEntities(p._embedded?.author?.[0]?.name ?? '');
    if (!author) missingAuthor++;

    const media = p._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl = media?.source_url ?? '';
    const imageAlt = decodeEntities(media?.alt_text ?? '');

    const content = cleanContent(p.content?.rendered ?? '');
    const excerpt = makeExcerpt(p.excerpt?.rendered || content);

    rows.push({
      wp_id: p.id,
      title: decodeEntities(p.title?.rendered ?? '').trim() || `(untitled ${p.id})`,
      slug,
      content,
      excerpt,
      image_url: imageUrl,
      image_alt: imageAlt,
      categories: (p.categories ?? []).map((id) => catById.get(id)).filter(Boolean),
      tags: (p.tags ?? []).map((id) => tagById.get(id)).filter(Boolean),
      author,
      // date_gmt is naive UTC ("2026-03-01T09:00:00") — mark it as such
      published_at: p.date_gmt ? `${p.date_gmt}Z`.replace('ZZ', 'Z') : null,
      updated_at: p.modified_gmt ? `${p.modified_gmt}Z`.replace('ZZ', 'Z') : null,
    });
  }

  if (missingAuthor > 0) {
    console.warn(
      `⚠ ${missingAuthor}/${rows.length} posts had no author name in _embedded — ` +
        `if that number is large, fall back to a WXR export for authors.`
    );
  }

  // Chunked SQL files: one upsert per post, keyed on wp_id so re-runs update
  // in place. published_at only ever moves forward from NULL.
  //
  // D1 rejects statements over 100KB (SQLITE_TOOBIG), and a handful of posts
  // have bodies bigger than that. Those are inserted with empty content and
  // the body appended in <=60KB slices via UPDATE … content || '…'.
  const SLICE = 60_000;
  const statementsFor = (r) => {
    const oversized = r.content.length > SLICE;
    const head = `INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES (${sq(r.title)}, ${sq(r.slug)}, ${oversized ? "''" : sq(r.content)}, ${sq(r.excerpt)}, ${sq(r.image_url)}, ${sq(r.image_alt)}, ${sq(JSON.stringify(r.categories))}, ${sq(JSON.stringify(r.tags))}, ${sq(r.author)}, ${r.wp_id}, 1, ${sq(r.published_at ?? '')}, ${sq(r.updated_at ?? '')}, ${r.published_at ? sq(r.published_at) : 'NULL'})
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);`;
    if (!oversized) return [head];
    const parts = [head];
    for (let off = 0; off < r.content.length; off += SLICE) {
      parts.push(
        `UPDATE posts SET content = content || ${sq(r.content.slice(off, off + SLICE))} WHERE wp_id = ${r.wp_id};`
      );
    }
    return parts;
  };

  const CHUNK = 40;
  const files = [];
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const sql = chunk.flatMap(statementsFor).join('\n');
    const file = path.join(SQL_DIR, `posts-${String(i / CHUNK).padStart(3, '0')}.sql`);
    fs.writeFileSync(file, sql);
    files.push(file);
  }

  console.log(`Importing ${rows.length} posts into ${REMOTE ? 'REMOTE' : 'local'} D1 in ${files.length} batches…`);
  files.forEach((file, i) => {
    process.stdout.write(`  batch ${i + 1}/${files.length}\r`);
    runSqlFile(file);
  });
  console.log(`\nDone. ${rows.length} posts imported/updated. ${pages.length} WP pages cached for the design pass.`);
}

if (MEDIA_ONLY) await sizeMedia();
else if (AUTHORS_ONLY) await backfillAuthors();
else await importAll();
