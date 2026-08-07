#!/usr/bin/env node
/**
 * Supplement the REST import from a WordPress WXR export file. The export is
 * authoritative for two things the open REST API couldn't provide:
 *
 *   1. AUTHORS — every post carries dc:creator (a login), and the header maps
 *      logins to display names. Overwrites the author column on all matching
 *      posts (the RSS/meta scrape got most right; this trues up the rest).
 *   2. DRAFTS — draft and private posts aren't in the public API. They are
 *      imported as unpublished rows (published = 0) so editors find their
 *      in-progress work in /admin. Trashed posts are skipped.
 *
 *   node scripts/import-wxr.mjs <export.xml>            # authors + drafts, local D1
 *   node scripts/import-wxr.mjs <export.xml> --users    # ALSO import the WP user accounts
 *   node scripts/import-wxr.mjs <export.xml> --alts     # ALSO backfill featured-image alt text
 *                                                       #   (needs the FULL "all content" export,
 *                                                       #   which carries attachment alt metas)
 *   node scripts/import-wxr.mjs <export.xml> --remote   # production D1
 *
 * Idempotent: everything is keyed on wp_id, and the draft upsert never
 * overwrites a post that has since been published.
 */

import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SQL_DIR = path.join(ROOT, 'scripts', 'data', 'sql');
const DB_NAME = 'changingireland-db';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const REMOTE = args.includes('--remote');
if (!file || !fs.existsSync(file)) {
  console.error('Usage: node scripts/import-wxr.mjs <export.xml> [--remote]');
  process.exit(1);
}
fs.mkdirSync(SQL_DIR, { recursive: true });

const xml = fs.readFileSync(file, 'utf8');
const sq = (s) => `'${String(s).replace(/'/g, "''")}'`;

function runSqlFile(f) {
  execFileSync('npx', ['wrangler', 'd1', 'execute', DB_NAME, '-y', REMOTE ? '--remote' : '--local', '--file', f], {
    cwd: ROOT,
    stdio: ['ignore', 'ignore', 'inherit'],
  });
}

const cdata = (block, tag) => {
  const m = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))</${tag}>`));
  return (m?.[1] ?? m?.[2] ?? '').trim();
};

const decode = (s) =>
  String(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// Same content cleaning as the REST import (import-wordpress.mjs).
function cleanContent(html) {
  return String(html)
    .replace(/<!--\s*\/?wp:[^>]*-->\s*/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[\/?(?:vc_|et_pb_|fusion_|av_|kc_|mk_)[^\]]*\]/g, '')
    .replace(/\[\/?(?:caption|gallery|embed|playlist|audio|video|su_\w+)[^\]]*\]/g, '')
    .replace(/\s(?:class|style|id|dir|data-[\w-]+)="[^"]*"/gi, '')
    .replace(/https?:\/\/(?:www\.)?changingireland\.ie\/wp-content\/uploads\//g, '/files/uploads/')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function makeExcerpt(html, limit = 500) {
  const text = decode(
    String(html)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
  return text.length <= limit ? text : text.slice(0, limit).replace(/\s+\S*$/, '') + '…';
}

const IMPORT_USERS = args.includes('--users');
const IMPORT_ALTS = args.includes('--alts');

// ---------------------------------------------------------------- parse

// login -> display name (header <wp:author> blocks)
const displayByLogin = new Map(
  [...xml.matchAll(/<wp:author>([\s\S]*?)<\/wp:author>/g)].map((m) => [
    cdata(m[1], 'wp:author_login'),
    decode(cdata(m[1], 'wp:author_display_name')),
  ])
);

const items = xml.split('<item>').slice(1);
const posts = [];
const attachments = new Map(); // wp_id -> url
const attachmentAlts = new Map(); // wp_id -> alt text

for (const raw of items) {
  const type = cdata(raw, 'wp:post_type');
  const id = Number(cdata(raw, 'wp:post_id'));
  if (type === 'attachment') {
    attachments.set(id, cdata(raw, 'wp:attachment_url'));
    const alt = raw.match(
      /<wp:meta_key><!\[CDATA\[_wp_attachment_image_alt\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]>/
    )?.[1];
    if (alt) attachmentAlts.set(id, decode(alt).trim());
    continue;
  }
  if (type !== 'post') continue;
  const status = cdata(raw, 'wp:status');
  const login = cdata(raw, 'dc:creator');
  const cats = [
    ...raw.matchAll(
      /<category domain="(category|post_tag)" nicename="([^"]+)"><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g
    ),
  ];
  const thumbId = Number(
    raw.match(
      /<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]>/
    )?.[1] ?? 0
  );
  posts.push({
    id,
    status,
    slug: decodeURIComponent(cdata(raw, 'wp:post_name')) || `post-${id}`,
    title: decode(cdata(raw, 'title')) || `(untitled ${id})`,
    author: displayByLogin.get(login) ?? login,
    content: cleanContent(cdata(raw, 'content:encoded')),
    excerpt: cdata(raw, 'excerpt:encoded'),
    dateGmt: cdata(raw, 'wp:post_date_gmt'),
    categories: cats.filter((c) => c[1] === 'category').map((c) => ({ slug: c[2], title: decode(c[3]) })),
    tags: cats.filter((c) => c[1] === 'post_tag').map((c) => ({ slug: c[2], title: decode(c[3]) })),
    thumbId,
  });
}

const published = posts.filter((p) => p.status === 'publish');
const unpublished = posts.filter((p) => p.status === 'draft' || p.status === 'private' || p.status === 'pending');
console.log(
  `WXR: ${posts.length} posts (${published.length} published, ${unpublished.length} draft/private/pending, ${posts.length - published.length - unpublished.length} other), ${attachments.size} attachments.`
);

// ---------------------------------------------------------------- users (--users)

if (IMPORT_USERS) {
  // WP never exports password hashes, so accounts arrive with a random locked
  // password — an admin gives each contributor a real one in /admin/users.
  // Same PBKDF2 format as src/lib/auth.ts.
  const hashPassword = (password) => {
    const salt = crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(password, salt, 100_000, 32, 'sha256');
    return `pbkdf2$100000$${salt.toString('hex')}$${hash.toString('hex')}`;
  };

  const authorBlocks = [...xml.matchAll(/<wp:author>([\s\S]*?)<\/wp:author>/g)].map((m) => ({
    login: cdata(m[1], 'wp:author_login'),
    email: cdata(m[1], 'wp:author_email'),
    first: decode(cdata(m[1], 'wp:author_first_name')),
    last: decode(cdata(m[1], 'wp:author_last_name')),
    display: decode(cdata(m[1], 'wp:author_display_name')),
  }));

  const userSql = authorBlocks
    .filter((a) => a.login && a.email)
    .map((a) => {
      const first = a.first || a.display.split(' ')[0] || a.login;
      const last = a.last || a.display.split(' ').slice(1).join(' ');
      const locked = hashPassword(crypto.randomBytes(24).toString('hex'));
      // OR IGNORE: skip anyone whose username or email already exists.
      return `INSERT OR IGNORE INTO users (username, email, first_name, last_name, password_hash, role)
VALUES (${sq(a.login)}, ${sq(a.email)}, ${sq(first)}, ${sq(last)}, ${sq(locked)}, 'editor');`;
    });

  const usersFile = path.join(SQL_DIR, 'wxr-users.sql');
  fs.writeFileSync(usersFile, userSql.join('\n'));
  runSqlFile(usersFile);
  console.log(
    `Users imported (existing usernames/emails skipped): ${userSql.length}. ` +
      `Passwords are locked until an admin sets one in /admin/users.`
  );
}

// ---------------------------------------------------------------- featured-image alt text (--alts)

if (IMPORT_ALTS) {
  // Only fills gaps: never overwrites an alt an editor already wrote.
  const altSql = posts
    .filter((p) => p.thumbId && attachmentAlts.get(p.thumbId))
    .map(
      (p) =>
        `UPDATE posts SET image_alt = ${sq(attachmentAlts.get(p.thumbId))} WHERE wp_id = ${p.id} AND image_alt = '';`
    );
  const altsFile = path.join(SQL_DIR, 'wxr-alts.sql');
  fs.writeFileSync(altsFile, altSql.join('\n'));
  runSqlFile(altsFile);
  console.log(`Featured-image alt text backfilled where empty: ${altSql.length} candidate posts.`);
}

// ---------------------------------------------------------------- authors (authoritative)

const authorSql = published
  .filter((p) => p.author)
  .map((p) => `UPDATE posts SET author = ${sq(p.author)} WHERE wp_id = ${p.id};`);
const authorsFile = path.join(SQL_DIR, 'wxr-authors.sql');
fs.writeFileSync(authorsFile, authorSql.join('\n'));
runSqlFile(authorsFile);
console.log(`Authors trued up on ${authorSql.length} published posts.`);

// ---------------------------------------------------------------- drafts / private

const mediaUrl = (id) => {
  const url = attachments.get(id);
  return url ? url.replace(/https?:\/\/(?:www\.)?changingireland\.ie\/wp-content\/uploads\//, '/files/uploads/') : '';
};

const draftSql = unpublished.map((p) => {
  const excerpt = makeExcerpt(p.excerpt || p.content);
  const date = p.dateGmt && p.dateGmt !== '0000-00-00 00:00:00' ? p.dateGmt.replace(' ', 'T') + 'Z' : '';
  return `INSERT INTO posts (title, slug, content, excerpt, image_url, categories, tags, author, wp_id, published, created_at, updated_at)
VALUES (${sq(p.title)}, ${sq(p.slug)}, ${sq(p.content)}, ${sq(excerpt)}, ${sq(mediaUrl(p.thumbId))}, ${sq(JSON.stringify(p.categories))}, ${sq(JSON.stringify(p.tags))}, ${sq(p.author)}, ${p.id}, 0, ${date ? sq(date) : "datetime('now')"}, ${date ? sq(date) : "datetime('now')"})
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, content = excluded.content, excerpt = excluded.excerpt,
  image_url = excluded.image_url, categories = excluded.categories, tags = excluded.tags,
  author = excluded.author
WHERE posts.published = 0;
`;
});
// Slug collisions with existing rows would violate the UNIQUE index; suffix on conflict.
const draftsFile = path.join(SQL_DIR, 'wxr-drafts.sql');
fs.writeFileSync(draftsFile, draftSql.join('\n'));
try {
  runSqlFile(draftsFile);
  console.log(`Drafts/private imported or refreshed: ${draftSql.length} (visible in /admin as Draft).`);
} catch {
  console.warn('Draft batch hit a conflict — importing one by one with slug fallback…');
  let ok = 0;
  for (const [i, stmt] of draftSql.entries()) {
    const f = path.join(SQL_DIR, 'wxr-draft-one.sql');
    try {
      fs.writeFileSync(f, stmt);
      runSqlFile(f);
      ok++;
    } catch {
      const p = unpublished[i];
      fs.writeFileSync(f, stmt.replaceAll(sq(p.slug), sq(`${p.slug}-draft-${p.id}`)));
      try {
        runSqlFile(f);
        ok++;
      } catch {
        console.warn(`  ✗ could not import draft wp_id ${p.id} (${p.slug})`);
      }
    }
  }
  console.log(`Drafts/private imported: ${ok}/${draftSql.length}.`);
}
