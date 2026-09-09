/**
 * The site's image library as seen by the featured-image picker: every image
 * in the UPLOADS R2 bucket under uploads/, newest first. Pure over the R2
 * `list()` API so it can be unit-tested with a fake bucket.
 *
 * The bucket mixes three generations of keys:
 *   - admin uploads          uploads/editor/YYYY/MM/<stamp>-name.webp
 *   - WordPress archive      uploads/YYYY/MM/name.jpg (originals, where mirrored)
 *   - archive WebP siblings  uploads/YYYY/MM/name.jpg.webp (scripts/webp-media.mjs)
 * plus responsive `.wNNN.webp` variants of any of them and WordPress's own
 * `name-300x200.jpg` size variants. The picker wants one entry per picture,
 * pointing at the URL the /files route resolves: `/files/uploads/…/name.jpg`.
 */

export const UPLOAD_PREFIX = 'uploads/';
export const DEFAULT_MAX_RESULTS = 5000;

export interface UploadItem {
  /** Public path, served by /files/[...path]. */
  url: string;
  /** Filename without the admin upload's timestamp prefix. */
  name: string;
  /** ISO instant: the admin upload time, or the archive folder's month. */
  uploaded: string;
}

interface Candidate extends UploadItem {
  stamp: number;
  /** URL with any WordPress -WxH size suffix removed; groups variants of one picture. */
  base: string;
  /** Pixel width of a WordPress size variant, 0 for an original. */
  sizeWidth: number;
}

const RESPONSIVE_VARIANT_RE = /\.w\d+\.webp$/i;
const WEBP_SIBLING_RE = /\.(png|jpe?g)\.webp$/i;
const IMAGE_RE = /\.(png|jpe?g|webp|gif|avif)$/i;
const STAMP_RE = /^(\d{10,})-/;
const WP_SIZE_RE = /-(\d+)x\d+(\.[a-z]+)$/i;
const MONTH_RE = /^uploads\/(?:editor\/)?(\d{4})\/(\d{2})\//;

/**
 * Turn one R2 key into a picker candidate, or null when the key is not an
 * image the picker should offer on its own (responsive variants, non-images).
 * `fallback` is R2's upload time, used when neither filename nor folder gives
 * a better date.
 */
export function parseUploadKey(key: string, fallback: Date): Candidate | null {
  if (RESPONSIVE_VARIANT_RE.test(key)) return null;
  // The archive's WebP sibling stands in for an original that may not have
  // been mirrored; it is addressed by the original's URL.
  const primaryKey = WEBP_SIBLING_RE.test(key) ? key.replace(/\.webp$/i, '') : key;
  if (!IMAGE_RE.test(primaryKey)) return null;

  const file = primaryKey.slice(primaryKey.lastIndexOf('/') + 1);
  const month = key.match(MONTH_RE);
  const stampFromName = Number(file.match(STAMP_RE)?.[1] ?? 0);
  const stamp = stampFromName || (month ? Date.UTC(Number(month[1]), Number(month[2]) - 1, 1) : fallback.getTime());
  const url = `/files/${primaryKey}`;
  const size = file.match(WP_SIZE_RE);

  return {
    url,
    name: file.replace(STAMP_RE, ''),
    uploaded: new Date(stamp).toISOString(),
    stamp,
    base: size ? url.replace(WP_SIZE_RE, '$2') : url,
    sizeWidth: size ? Number(size[1]) : 0,
  };
}

/** The slice of R2Bucket.list() this module uses. */
export interface ListableBucket {
  list(options: { prefix: string; limit: number; cursor?: string }): Promise<{
    objects: Array<{ key: string; uploaded: Date }>;
    truncated: boolean;
    cursor?: string;
  }>;
}

/**
 * One entry per picture: an original beats its WebP sibling (same URL) and
 * beats any WordPress size variant; where only size variants were mirrored,
 * the widest one stands in for the picture.
 */
export function dedupeCandidates(candidates: Candidate[]): UploadItem[] {
  const byBase = new Map<string, Candidate>();
  for (const c of candidates) {
    const current = byBase.get(c.base);
    if (!current) {
      byBase.set(c.base, c);
      continue;
    }
    const currentIsOriginal = current.sizeWidth === 0;
    const incomingIsOriginal = c.sizeWidth === 0;
    if (currentIsOriginal) continue;
    if (incomingIsOriginal || c.sizeWidth > current.sizeWidth) byBase.set(c.base, c);
  }
  return [...byBase.values()].map(({ url, name, uploaded }) => ({ url, name, uploaded }));
}

/**
 * Newest-first list of pictures under `prefix`, walking every page of the
 * listing and capping the result at `max`. Ties within a month sort by name
 * so the order is stable between opens.
 */
export async function listRecentUploads(
  bucket: ListableBucket,
  { prefix = UPLOAD_PREFIX, max = DEFAULT_MAX_RESULTS }: { prefix?: string; max?: number } = {}
): Promise<UploadItem[]> {
  const candidates: Candidate[] = [];
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix, limit: 1000, cursor });
    for (const obj of page.objects) {
      const item = parseUploadKey(obj.key, obj.uploaded);
      if (item) candidates.push(item);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  const items = dedupeCandidates(candidates);
  items.sort((a, b) => (a.uploaded < b.uploaded ? 1 : a.uploaded > b.uploaded ? -1 : a.name.localeCompare(b.name)));
  return items.slice(0, max);
}
