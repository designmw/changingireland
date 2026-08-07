#!/usr/bin/env node
/**
 * Mirror every wp-content/uploads file referenced by the imported posts into
 * the UPLOADS R2 bucket, then (optionally) rewrite the URLs in D1 to serve
 * from /files/uploads/… instead of hotlinking changingireland.ie.
 *
 *   node scripts/mirror-media.mjs --limit 20          # trial run, local R2
 *   node scripts/mirror-media.mjs                     # full mirror into local R2
 *   node scripts/mirror-media.mjs --remote            # full mirror into production R2
 *   node scripts/mirror-media.mjs --rewrite [--remote]  # rewrite D1 URLs -> /files/uploads/…
 *
 * ~5.5k files (images incl. srcset variants, a few PDFs/videos), roughly
 * 1.5–2.5 GB. Downloads are cached in scripts/data/media-mirror/ so re-runs
 * resume where they left off; R2 uploads skip keys that already exist in the
 * cache manifest. Run the mirror BEFORE --rewrite, and only rewrite once the
 * mirror finished without failures — until then the site hotlinks the old
 * WordPress host, which keeps working as long as that site stays up.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'scripts', 'data');
const MIRROR = path.join(DATA_DIR, 'media-mirror');
const MANIFEST = path.join(MIRROR, 'uploaded.json');
const DB_NAME = 'changingireland-db';
const BUCKET = 'changingireland-uploads';

const argv = process.argv.slice(2);
const REMOTE = argv.includes('--remote');
const REWRITE = argv.includes('--rewrite');
const LIMIT = Number(argv[argv.indexOf('--limit') + 1] || 0) || Infinity;
const flag = REMOTE ? '--remote' : '--local';

fs.mkdirSync(MIRROR, { recursive: true });

const sq = (s) => `'${String(s).replace(/'/g, "''")}'`;

function wrangler(args) {
  execFileSync('npx', ['wrangler', ...args], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
}

// ---------------------------------------------------------------- rewrite

if (REWRITE) {
  // Idempotent string rewrites: every reference shape (https/http, with and
  // without www) becomes a root-relative /files/uploads/… URL.
  const variants = [
    'https://changingireland.ie/wp-content/uploads/',
    'https://www.changingireland.ie/wp-content/uploads/',
    'http://changingireland.ie/wp-content/uploads/',
    'http://www.changingireland.ie/wp-content/uploads/',
  ];
  // Unconditional REPLACE — a WHERE … LIKE guard trips D1's "pattern too
  // complex" limit, and REPLACE is a no-op on rows without the substring.
  const stmts = [];
  for (const v of variants) {
    stmts.push(`UPDATE posts SET content = REPLACE(content, ${sq(v)}, '/files/uploads/');`);
    stmts.push(`UPDATE posts SET image_url = REPLACE(image_url, ${sq(v)}, '/files/uploads/');`);
  }
  const file = path.join(MIRROR, 'rewrite.sql');
  fs.writeFileSync(file, stmts.join('\n'));
  wrangler(['d1', 'execute', DB_NAME, '-y', flag, '--file', file]);
  console.log(`Done. Post bodies + featured images in ${REMOTE ? 'REMOTE' : 'local'} D1 now point at /files/uploads/…`);
  process.exit(0);
}

// ---------------------------------------------------------------- mirror

const posts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'wp-posts.json'), 'utf8'));
const urls = new Set();
const re = /https?:\/\/(?:www\.)?changingireland\.ie\/wp-content\/uploads\/[^\s"'\\)<>,]+/g;
for (const p of posts) {
  for (const m of (p.content?.rendered ?? '').matchAll(re)) urls.add(m[0]);
  const media = p._embedded?.['wp:featuredmedia']?.[0];
  if (media?.source_url) urls.add(media.source_url);
}

const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
const manifestKey = REMOTE ? 'remote' : 'local';
manifest[manifestKey] ??= {};
const done = manifest[manifestKey];

const typeOf = (f) =>
  ({
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.m4v': 'video/x-m4v',
  })[path.extname(f).toLowerCase()] ?? 'application/octet-stream';

const list = [...urls].sort().slice(0, LIMIT);
console.log(`${urls.size} referenced files; processing ${list.length} into ${REMOTE ? 'REMOTE' : 'local'} R2…`);

let ok = 0;
let failed = 0;
let skipped = 0;
for (const [i, url] of list.entries()) {
  // uploads/2026/04/photo.jpg (path under wp-content/, decoded)
  const rel = decodeURIComponent(new URL(url).pathname.replace(/^\/wp-content\//, ''));
  const key = rel;
  if (done[key]) {
    skipped++;
    continue;
  }
  const cached = path.join(MIRROR, rel);
  try {
    if (!fs.existsSync(cached) || fs.statSync(cached).size === 0) {
      fs.mkdirSync(path.dirname(cached), { recursive: true });
      const res = await fetch(url, { headers: { 'User-Agent': 'changingireland-astro-import/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fs.writeFileSync(cached, Buffer.from(await res.arrayBuffer()));
    }
    wrangler(['r2', 'object', 'put', `${BUCKET}/${key}`, '--file', cached, '--content-type', typeOf(key), flag]);
    done[key] = true;
    ok++;
  } catch (err) {
    failed++;
    console.warn(`\n  ✗ ${url}: ${err.message}`);
  }
  if ((i + 1) % 10 === 0) {
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest));
    process.stdout.write(`  ${i + 1}/${list.length} (ok ${ok}, skipped ${skipped}, failed ${failed})\r`);
  }
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest));
console.log(`\nDone. ok ${ok}, already-done ${skipped}, failed ${failed}.`);
if (failed === 0 && list.length === urls.size) {
  console.log(`Mirror complete — safe to run: node scripts/mirror-media.mjs --rewrite${REMOTE ? ' --remote' : ''}`);
} else if (failed > 0) {
  console.log('Some files failed — re-run to retry before using --rewrite.');
}
