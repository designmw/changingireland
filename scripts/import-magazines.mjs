#!/usr/bin/env node
/**
 * Import the magazine back-issues into the UPLOADS R2 bucket + the magazines
 * D1 table.
 *
 *   node scripts/import-magazines.mjs            # recent issues from /magazines/, LOCAL R2 + D1
 *   node scripts/import-magazines.mjs --archive  # ALSO the full 2001-onwards archive from the
 *                                                #   WP media library, covers rendered from
 *                                                #   PDF page 1 (macOS sips)
 *   node scripts/import-magazines.mjs --remote   # either mode against production
 *
 * The /magazines/ page lists only the newest ~25 issues, each with a real
 * cover image and a contents blurb (scraped as the description). The rest of
 * the archive (issues 1–92) exists as plain PDFs in wp-content/uploads and is
 * discovered from the cached media API listing (scripts/data/wp-media.json,
 * fetched by import-wordpress.mjs --media). Downloads cache in
 * scripts/data/magazines/; upserts are keyed on the issue number, and an
 * empty cover/description never overwrites a real one.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, 'scripts', 'data', 'magazines');
const DB_NAME = 'changingireland-db';
const BUCKET = 'changingireland-uploads';
const REMOTE = process.argv.includes('--remote');
const ARCHIVE = process.argv.includes('--archive');
const flag = REMOTE ? '--remote' : '--local';

fs.mkdirSync(CACHE, { recursive: true });

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&(ldquo|rdquo|quot);/g, '"')
    .replace(/&(lsquo|rsquo|#039);/g, '’')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .trim();

const sq = (s) => `'${String(s).replace(/'/g, "''")}'`;

function wrangler(args) {
  // Retry: concurrent wrangler runs (e.g. the media mirror) can hold the
  // local miniflare state briefly and fail a put with a lock error.
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

function putR2(key, file, contentType) {
  wrangler(['r2', 'object', 'put', `${BUCKET}/${key}`, '--file', file, '--content-type', contentType, flag]);
}

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return false;
  const res = await fetch(url, { headers: { 'User-Agent': 'changingireland-astro-import/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return true;
}

/** First page of a PDF as PNG via macOS sips (595×842 @72dpi — fine for a grid cover). */
function pdfCover(pdfFile, pngFile) {
  if (fs.existsSync(pngFile) && fs.statSync(pngFile).size > 0) return;
  execFileSync('sips', ['-s', 'format', 'png', pdfFile, '--out', pngFile], { stdio: 'ignore' });
}

const contentTypeOf = (key) =>
  key.endsWith('.png') ? 'image/png' : key.endsWith('.webp') ? 'image/webp' : 'image/jpeg';

// ---------------------------------------------------------------- recent issues (magazines page)

console.log('Fetching /magazines/ …');
const res = await fetch('https://changingireland.ie/magazines/', {
  headers: { 'User-Agent': 'changingireland-astro-import/1.0' },
});
if (!res.ok) throw new Error(`HTTP ${res.status} fetching the magazines page`);
const html = await res.text();

const coverRe = /<a href="(https:\/\/[^"]+\.pdf)">\s*<img[^>]*src="([^"]+)"/g;
const pairs = [...html.matchAll(coverRe)].map((m) => ({ pdf: m[1], cover: m[2], index: m.index }));
const titles = [...html.matchAll(/class="elementor-heading-title[^"]*"><a href="[^"]*">([^<]+)<\/a>/g)].map((m) =>
  decode(m[1])
);
if (pairs.length === 0 || pairs.length !== titles.length) {
  throw new Error(`Parse mismatch: ${pairs.length} cover/PDF pairs vs ${titles.length} titles — page layout changed?`);
}

/**
 * Description: the visible text between this issue's block and the next
 * (paragraphs + bullet lines, minus the title itself and button labels).
 */
function descriptionFor(i) {
  const start = pairs[i].index;
  const end = i + 1 < pairs.length ? pairs[i + 1].index : html.indexOf('elementor-location-footer');
  const seg = html.slice(start, end === -1 ? undefined : end);
  const bits = [...seg.matchAll(/<(p|li)[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((m) => decode(m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim())
    .filter((t) => t && !/^(download|read( for free)?|open pdf)/i.test(t) && t !== titles[i]);
  return bits.join('\n').slice(0, 4000);
}

const issues = pairs.map((pair, i) => {
  const title = titles[i];
  const issue = Number(title.match(/Issue\s+(\d+)/i)?.[1] ?? 0);
  if (!issue) throw new Error(`No issue number in title: ${title}`);
  // Publication date: best effort from the uploads path (/2026/04/)
  const [, y, mo] = pair.pdf.match(/\/uploads\/(\d{4})\/(\d{2})\//) ?? [];
  return {
    issue,
    title,
    description: descriptionFor(i),
    pdfUrl: pair.pdf,
    coverUrl: pair.cover,
    publishedDate: y ? `${y}-${mo}` : '',
    pdfKey: `magazines/issue-${issue}${path.extname(new URL(pair.pdf).pathname)}`,
    coverKey: `magazines/covers/issue-${issue}${path.extname(new URL(pair.cover).pathname)}`,
  };
});

console.log(
  `${issues.length} recent issues on the page (issue ${Math.min(...issues.map((i) => i.issue))}–${Math.max(...issues.map((i) => i.issue))}).`
);

// ---------------------------------------------------------------- archive issues (media library)

const archiveIssues = [];
if (ARCHIVE) {
  const mediaPath = path.join(ROOT, 'scripts', 'data', 'wp-media.json');
  if (!fs.existsSync(mediaPath)) {
    throw new Error('scripts/data/wp-media.json missing — run: node scripts/import-wordpress.mjs --media');
  }
  const media = JSON.parse(fs.readFileSync(mediaPath, 'utf8'));
  const onPage = new Set(issues.map((i) => i.issue));
  const seasons = /(spring|summer|autumn|winter)/i;

  const byIssue = new Map();
  for (const m of media) {
    if (m.mime_type !== 'application/pdf') continue;
    const name = decodeURIComponent(new URL(m.source_url).pathname.split('/').pop() ?? '');
    const num = Number(name.match(/iss(?:ue)?[-_ ]?0*(\d{1,3})/i)?.[1] ?? 0);
    if (!num || num > 200 || onPage.has(num)) continue;
    // Later media IDs win when an issue was uploaded more than once.
    const prev = byIssue.get(num);
    if (!prev || m.id > prev.id) byIssue.set(num, { id: m.id, url: m.source_url, name });
  }

  for (const [issue, m] of [...byIssue.entries()].sort((a, b) => b[0] - a[0])) {
    const [, y, mo] = m.url.match(/\/uploads\/(\d{4})\/(\d{2})\//) ?? [];
    const season = m.name.match(seasons)?.[1];
    const year = m.name.match(/(20[0-2]\d|19\d\d)/)?.[1];
    const title =
      season && year
        ? `Issue ${issue} – ${season[0].toUpperCase()}${season.slice(1).toLowerCase()} ${year}`
        : year
          ? `Issue ${issue} (${year})`
          : `Issue ${issue}`;
    archiveIssues.push({
      issue,
      title,
      description: '',
      pdfUrl: m.url,
      coverUrl: null, // generated from the PDF below
      publishedDate: y ? `${y}-${mo}` : '',
      pdfKey: `magazines/issue-${issue}.pdf`,
      coverKey: `magazines/covers/issue-${issue}.png`,
    });
  }
  console.log(`${archiveIssues.length} archive issues found in the media library.`);
}

// ---------------------------------------------------------------- download + upload + upsert

const all = [...issues, ...archiveIssues];
for (const [n, iss] of all.entries()) {
  const pdfFile = path.join(CACHE, path.basename(iss.pdfKey));
  const coverFile = path.join(CACHE, path.basename(iss.coverKey));
  process.stdout.write(`  [${n + 1}/${all.length}] issue ${iss.issue}: downloading…    \r`);
  await download(iss.pdfUrl, pdfFile);
  if (iss.coverUrl) await download(iss.coverUrl, coverFile);
  else pdfCover(pdfFile, coverFile);

  process.stdout.write(`  [${n + 1}/${all.length}] issue ${iss.issue}: uploading to R2…\r`);
  putR2(iss.pdfKey, pdfFile, 'application/pdf');
  putR2(iss.coverKey, coverFile, contentTypeOf(iss.coverKey));
}
console.log();

// Empty covers/descriptions never clobber real ones on re-runs.
const sql = all
  .map(
    (i) => `INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (${i.issue}, ${sq(i.title)}, ${sq(i.coverKey)}, ${sq(i.pdfKey)}, ${sq(i.description)}, ${sq(i.publishedDate)}, ${i.issue})
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;`
  )
  .join('\n');
const sqlFile = path.join(CACHE, 'magazines.sql');
fs.writeFileSync(sqlFile, sql);
wrangler(['d1', 'execute', DB_NAME, '-y', flag, '--file', sqlFile]);

console.log(`Done. ${all.length} issues in ${REMOTE ? 'REMOTE' : 'local'} D1 + R2.`);
