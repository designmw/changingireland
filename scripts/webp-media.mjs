#!/usr/bin/env node
/**
 * Generate WebP variants for every PNG/JPEG the site serves from R2 and upload
 * them as `<key>.webp` siblings. The /files route content-negotiates: browsers
 * that accept image/webp get the sibling, everything else gets the original,
 * so no URL stored in D1 ever changes.
 *
 *   node scripts/webp-media.mjs --limit 20     # trial run, local R2
 *   node scripts/webp-media.mjs                # full run into local R2
 *   node scripts/webp-media.mjs --remote       # full run into production R2
 *
 * Sources: the mirrored post images in scripts/data/media-mirror/, the
 * magazine covers in scripts/data/magazines/, and the ad images listed in D1
 * (fetched from R2 into the cache when missing). Variants are capped at
 * 1600px wide (content column is ~900px, so that covers 2x DPR), quality 80.
 * A variant that comes out no smaller than its original is skipped — the
 * route's fallback serves the original there. Progress is manifest-tracked in
 * scripts/data/media-mirror/webp-manifest.{local,remote}.json, so re-runs
 * resume where they left off and only retry failures.
 */

import { execFile, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'scripts', 'data');
const MIRROR = path.join(DATA_DIR, 'media-mirror');
const MAGAZINES = path.join(DATA_DIR, 'magazines');
const DB_NAME = 'changingireland-db';
const BUCKET = 'changingireland-uploads';
const WRANGLER = path.join(ROOT, 'node_modules', '.bin', 'wrangler');

const MAX_WIDTH = 1600;
const QUALITY = 80;

const argv = process.argv.slice(2);
const REMOTE = argv.includes('--remote');
// --limit N caps how many pending images this run processes (for trial runs).
// Absent or malformed means no cap.
const limitIdx = argv.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? Number(argv[limitIdx + 1]) || Infinity : Infinity;
// Every wrangler call targets either the local miniflare store or production.
const flag = REMOTE ? '--remote' : '--local';
// Local R2 is one sqlite store — too many concurrent wrangler writes trip
// over each other (a re-run retries any that do). Remote uploads are
// network-bound and parallelise fine.
const CONCURRENCY = REMOTE ? 8 : 4;
// One manifest per target so a local and a remote run can go concurrently
// without clobbering each other's progress file.
const MANIFEST = path.join(MIRROR, `webp-manifest.${REMOTE ? 'remote' : 'local'}.json`);

// ---------------------------------------------------------------- work list

/** @type {{ key: string, file: string }[]} key in R2, file on disk */
const jobs = [];
const IMG = /\.(png|jpe?g)$/i;

// 1. Mirrored WordPress post images (cache is complete after mirror-media.mjs).
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (IMG.test(entry.name)) jobs.push({ key: path.relative(MIRROR, full), file: full });
  }
};
if (fs.existsSync(path.join(MIRROR, 'uploads'))) walk(path.join(MIRROR, 'uploads'));

// 2. Magazine covers (cache file names match the R2 key basenames).
for (const name of fs.readdirSync(MAGAZINES)) {
  if (IMG.test(name)) jobs.push({ key: `magazines/covers/${name}`, file: path.join(MAGAZINES, name) });
}

// 3. Ad images, listed in D1 and pulled from R2 into the cache when missing.
try {
  const out = execFileSync(
    WRANGLER,
    ['d1', 'execute', DB_NAME, flag, '--json', '--command', 'SELECT image_key FROM ads'],
    { cwd: ROOT, encoding: 'utf8' }
  );
  const rows = JSON.parse(out)[0]?.results ?? [];
  for (const { image_key: key } of rows) {
    if (!IMG.test(key)) continue;
    const cached = path.join(MIRROR, key);
    if (!fs.existsSync(cached) || fs.statSync(cached).size === 0) {
      fs.mkdirSync(path.dirname(cached), { recursive: true });
      try {
        execFileSync(WRANGLER, ['r2', 'object', 'get', `${BUCKET}/${key}`, '--file', cached, flag], {
          cwd: ROOT,
          stdio: 'ignore',
        });
      } catch {
        console.warn(`  ✗ ad image ${key}: not in ${REMOTE ? 'remote' : 'local'} R2, skipping`);
        continue;
      }
    }
    jobs.push({ key, file: cached });
  }
} catch (err) {
  console.warn(`  ✗ could not list ads from D1 (${err.message}) — continuing without them`);
}

// ---------------------------------------------------------------- convert + upload

// Manifest maps R2 key → true (webp uploaded) or 'no-win' (original already
// smaller, deliberately skipped). Failures are never recorded, so a re-run
// retries exactly the files that didn't make it.
const done = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};

const pending = jobs.filter((j) => !done[j.key]);
const todo = pending.slice(0, LIMIT);
console.log(
  `${jobs.length} images (${jobs.length - pending.length} already done); processing ${todo.length} into ${REMOTE ? 'REMOTE' : 'local'} R2…`
);

let ok = 0;
let noWin = 0;
let failed = 0;
let processed = 0;

/** Convert one image to WebP and upload it as the `<key>.webp` sibling. */
async function handle({ key, file }) {
  // Written next to the source file, then handed to wrangler; always removed
  // in `finally` so an interrupted run leaves no *.webp-tmp litter behind.
  const tmp = `${file}.webp-tmp`;
  try {
    const original = fs.statSync(file).size;
    // failOn:'truncated' rejects corrupt mirror downloads instead of encoding
    // garbage; rotate() bakes the EXIF orientation in (WebP viewers vary).
    // limitInputPixels:false lifts sharp's ~268MP decode cap — some scanned
    // magazine posters exceed it, and these are our own trusted files.
    const image = sharp(file, { failOn: 'truncated', limitInputPixels: false }).rotate();
    const meta = await image.metadata();
    const resized = (meta.width ?? 0) > MAX_WIDTH;
    const buf = await image
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    // Only worth uploading if we actually saved bytes. A downscaled variant
    // always wins (fewer pixels); an unresized one must beat the original.
    if (!resized && buf.length >= original) {
      done[key] = 'no-win'; // route fallback serves the original
      noWin++;
      return;
    }
    fs.writeFileSync(tmp, buf);
    await execFileAsync(
      WRANGLER,
      ['r2', 'object', 'put', `${BUCKET}/${key}.webp`, '--file', tmp, '--content-type', 'image/webp', flag],
      { cwd: ROOT }
    );
    done[key] = true;
    ok++;
  } catch (err) {
    // Not recorded in the manifest, so the next run retries it. Local failures
    // are usually miniflare sqlite contention; remote ones transient API blips.
    failed++;
    console.warn(`\n  ✗ ${key}: ${err.message.split('\n')[0]}`);
  } finally {
    fs.rmSync(tmp, { force: true });
    processed++;
    // Checkpoint every 10 images: an interrupted run loses at most 9 uploads'
    // worth of progress, and the manifest write doubles as a progress tick.
    if (processed % 10 === 0) {
      fs.writeFileSync(MANIFEST, JSON.stringify(done));
      process.stdout.write(`  ${processed}/${todo.length} (webp ${ok}, kept-original ${noWin}, failed ${failed})\r`);
    }
  }
}

// Fixed-size worker pool: CONCURRENCY workers each pull the next job off a
// shared queue until it drains. Simpler than batching and keeps every slot
// busy even when one image is much slower than the rest.
const queue = [...todo];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) await handle(job);
  })
);

fs.writeFileSync(MANIFEST, JSON.stringify(done));
console.log(`\nDone. webp ${ok}, kept-original ${noWin}, failed ${failed}.`);
if (failed > 0) console.log('Some files failed — re-run to retry them.');
