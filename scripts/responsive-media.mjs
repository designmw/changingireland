#!/usr/bin/env node
/**
 * Generate real responsive WebP candidates for recent/featured post images.
 * The /files route serves these for URLs such as `photo.jpg?w=480` and falls
 * back to the existing full-size object whenever a candidate is absent.
 *
 *   npm run media:responsive -- --limit 10
 *   npm run media:responsive -- --remote
 *   npm run media:responsive -- --remote --recent 150
 */

import { execFile, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIRROR = path.join(ROOT, 'scripts', 'data', 'media-mirror');
const DB_NAME = 'changingireland-db';
const BUCKET = 'changingireland-uploads';
const WRANGLER = path.join(ROOT, 'node_modules', '.bin', 'wrangler');
const WIDTHS = [160, 320, 480, 720, 960, 1280];
const QUALITY = 76;

const argv = process.argv.slice(2);
const REMOTE = argv.includes('--remote');
const numberArg = (name, fallback) => {
  const index = argv.indexOf(name);
  const value = index === -1 ? fallback : Number(argv[index + 1]);
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
};
const RECENT = numberArg('--recent', 100);
const LIMIT = numberArg('--limit', Infinity);
const flag = REMOTE ? '--remote' : '--local';
const manifestPath = path.join(MIRROR, `responsive-manifest.${REMOTE ? 'remote' : 'local'}.json`);
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-responsive-'));

const query = `SELECT image_url, featured
  FROM posts
  WHERE published = 1
    AND (published_at IS NULL OR datetime(published_at) <= datetime('now'))
    AND image_url != ''
  ORDER BY COALESCE(published_at, created_at) DESC`;
const dbOutput = execFileSync(WRANGLER, ['d1', 'execute', DB_NAME, flag, '--json', '--command', query], {
  cwd: ROOT,
  encoding: 'utf8',
});
const rows = JSON.parse(dbOutput)[0]?.results ?? [];

const keyFromUrl = (value) => {
  try {
    const url = new URL(String(value), 'https://changingireland.ie');
    if (!url.pathname.startsWith('/files/')) return null;
    return decodeURIComponent(url.pathname.slice('/files/'.length));
  } catch {
    return null;
  }
};

const keys = [
  ...new Set(
    rows
      .filter((row, index) => index < RECENT || Number(row.featured) === 1)
      .map((row) => keyFromUrl(row.image_url))
      .filter(Boolean)
  ),
].slice(0, LIMIT);

async function fetchSource(key) {
  const mirrored = path.join(MIRROR, key);
  if (fs.existsSync(mirrored) && fs.statSync(mirrored).size > 0) return mirrored;

  const cached = path.join(tempDir, path.basename(key));
  for (const candidate of [key, `${key}.webp`]) {
    try {
      await execFileAsync(WRANGLER, ['r2', 'object', 'get', `${BUCKET}/${candidate}`, '--file', cached, flag], {
        cwd: ROOT,
      });
      if (fs.existsSync(cached) && fs.statSync(cached).size > 0) return cached;
    } catch {
      fs.rmSync(cached, { force: true });
    }
  }
  throw new Error('source is missing from the mirror and R2');
}

let uploaded = 0;
let skipped = 0;
let failed = 0;
let completed = 0;

async function handle(key, jobIndex) {
  try {
    const source = await fetchSource(key);
    const image = sharp(source, { failOn: 'truncated', limitInputPixels: false }).rotate();
    const metadata = await image.metadata();
    const sourceWidth = metadata.width ?? 0;
    const done = new Set(Array.isArray(manifest[key]) ? manifest[key] : []);

    for (const width of WIDTHS) {
      if (done.has(width)) continue;
      if (sourceWidth <= width) {
        done.add(width);
        skipped++;
        continue;
      }
      // jobIndex is stable and unique across the worker pool; `completed` is
      // shared mutable progress and caused concurrent jobs to overwrite the
      // same temporary file.
      const output = path.join(tempDir, `${jobIndex}-${width}.webp`);
      await sharp(source, { failOn: 'truncated', limitInputPixels: false })
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(output);
      await execFileAsync(
        WRANGLER,
        [
          'r2',
          'object',
          'put',
          `${BUCKET}/${key}.w${width}.webp`,
          '--file',
          output,
          '--content-type',
          'image/webp',
          flag,
        ],
        { cwd: ROOT }
      );
      fs.rmSync(output, { force: true });
      done.add(width);
      uploaded++;
    }
    manifest[key] = [...done].sort((a, b) => a - b);
  } catch (error) {
    failed++;
    console.warn(`\n  ✗ ${key}: ${String(error.message ?? error).split('\n')[0]}`);
  } finally {
    completed++;
    if (completed % 5 === 0 || completed === keys.length) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest));
      process.stdout.write(
        `  ${completed}/${keys.length} images (uploaded ${uploaded}, skipped ${skipped}, failed ${failed})\r`
      );
    }
  }
}

console.log(
  `${keys.length} recent/featured images; generating ${WIDTHS.join(', ')}px variants in ${REMOTE ? 'REMOTE' : 'local'} R2…`
);
const queue = keys.map((key, index) => ({ key, index }));
await Promise.all(
  Array.from({ length: REMOTE ? 6 : 1 }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) await handle(job.key, job.index);
  })
);
fs.writeFileSync(manifestPath, JSON.stringify(manifest));
fs.rmSync(tempDir, { recursive: true, force: true });
console.log(`\nDone. Uploaded ${uploaded}, skipped ${skipped}, failed ${failed}.`);
if (failed > 0) process.exitCode = 1;
