#!/usr/bin/env node
/**
 * Backfill descriptions, richer titles, and real cover images for the older
 * magazine issues from the old site's "digital magazine archive" page (now
 * only on the Wayback Machine — the current /magazines/ page lists just the
 * newest ~25 issues).
 *
 *   node scripts/import-archive-descriptions.mjs            # local D1/R2
 *   node scripts/import-archive-descriptions.mjs --remote   # production
 *
 * Guards: never overwrites a non-empty description, and never touches the
 * title/cover of issues that came from the live /magazines/ page (>= 68).
 * Covers are fetched from the live uploads path first, Wayback as fallback.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, 'scripts', 'data');
const MAG_CACHE = path.join(CACHE, 'magazines');
const DB_NAME = 'changingireland-db';
const BUCKET = 'changingireland-uploads';
const REMOTE = process.argv.includes('--remote');
const flag = REMOTE ? '--remote' : '--local';
// Issues on the current /magazines/ page keep their live titles/covers.
const LIVE_PAGE_MIN_ISSUE = 68;

fs.mkdirSync(MAG_CACHE, { recursive: true });

const sq = (s) => `'${String(s).replace(/'/g, "''")}'`;

function wrangler(args) {
  for (let attempt = 1; ; attempt++) {
    try {
      execFileSync('npx', ['wrangler', ...args], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
      return;
    } catch (err) {
      if (attempt >= 3) throw err;
      execFileSync('sleep', [String(2 * attempt)]);
    }
  }
}

const decode = (s) =>
  String(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&(ldquo|rdquo|quot);/g, '"')
    .replace(/&(lsquo|rsquo|#039);/g, '’')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .trim();

// ---------------------------------------------------------------- fetch page

const cacheFile = path.join(CACHE, 'wb-archive.html');
let html;
if (fs.existsSync(cacheFile) && fs.statSync(cacheFile).size > 10_000) {
  html = fs.readFileSync(cacheFile, 'utf8');
  console.log('Using cached Wayback archive page.');
} else {
  console.log('Fetching the archived digital-magazine-archive page from the Wayback Machine…');
  const res = await fetch('http://web.archive.org/web/2024/https://www.changingireland.ie/digital-magazine-archive/', {
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Wayback fetch failed: HTTP ${res.status}`);
  html = await res.text();
  fs.writeFileSync(cacheFile, html);
}

// ---------------------------------------------------------------- parse blurbs

const blurbs = html.split('et_pb_blurb_content').slice(1);
const issues = new Map();
for (const b of blurbs) {
  const title = decode(b.match(/<h4[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<\/h4>/)?.[1]?.replace(/<[^>]+>/g, '') ?? '');
  const issue = Number(title.match(/Issue\s+(\d+)/i)?.[1] ?? 0);
  if (!issue) continue;
  const descHtml = b.match(/<div class="et_pb_blurb_description">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const lines = [...descHtml.matchAll(/<(p|li)[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((m) => decode(m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim())
    .filter(Boolean);
  const coverWb = b.match(/<img[^>]*src="(http[^"]+)"/)?.[1] ?? '';
  const coverOriginal = coverWb.replace(/^https?:\/\/web\.archive\.org\/web\/\d+im_\//, '');
  // Keep the first (newest snapshot) occurrence of each issue.
  if (!issues.has(issue)) issues.set(issue, { issue, title, description: lines.join('\n'), coverWb, coverOriginal });
}
console.log(`Parsed ${issues.size} issues from the archive page.`);

// ---------------------------------------------------------------- covers (older issues only)

async function fetchCover(iss) {
  const dest = path.join(
    MAG_CACHE,
    `wb-cover-issue-${iss.issue}${path.extname(new URL(iss.coverOriginal).pathname) || '.png'}`
  );
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return dest;
  for (const url of [iss.coverOriginal, iss.coverWb]) {
    if (!url) continue;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'changingireland-astro-import/1.0' },
        redirect: 'follow',
      });
      if (res.ok && (res.headers.get('content-type') ?? '').startsWith('image/')) {
        fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
        return dest;
      }
    } catch {
      // try the next source
    }
  }
  return null;
}

const stmts = [];
let covers = 0;
let n = 0;
for (const iss of [...issues.values()].sort((a, b) => b.issue - a.issue)) {
  n++;
  process.stdout.write(`  [${n}/${issues.size}] issue ${iss.issue}\r`);

  if (iss.description) {
    stmts.push(
      `UPDATE magazines SET description = ${sq(iss.description)} WHERE issue = ${iss.issue} AND description = '';`
    );
  }
  if (iss.issue < LIVE_PAGE_MIN_ISSUE) {
    stmts.push(`UPDATE magazines SET title = ${sq(iss.title)} WHERE issue = ${iss.issue};`);
    const file = await fetchCover(iss);
    if (file) {
      const ext = path.extname(file).toLowerCase();
      const key = `magazines/covers/issue-${iss.issue}${ext}`;
      const type = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      wrangler(['r2', 'object', 'put', `${BUCKET}/${key}`, '--file', file, '--content-type', type, flag]);
      stmts.push(`UPDATE magazines SET cover_key = ${sq(key)} WHERE issue = ${iss.issue};`);
      covers++;
    }
  }
}
console.log();

const sqlFile = path.join(MAG_CACHE, 'wb-descriptions.sql');
fs.writeFileSync(sqlFile, stmts.join('\n'));
wrangler(['d1', 'execute', DB_NAME, '-y', flag, '--file', sqlFile]);

console.log(`Done. Descriptions/titles updated for ${issues.size} issues; ${covers} real covers replaced PDF renders.`);
