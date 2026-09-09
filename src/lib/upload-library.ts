/**
 * Listing of admin image uploads in R2, for the featured-image picker on the
 * article editor. Pure over the R2 `list()` API so it can be unit-tested with
 * a fake bucket.
 */

/** Where /api/admin/upload writes editor images. */
export const EDITOR_UPLOAD_PREFIX = 'uploads/editor/';
export const DEFAULT_MAX_RESULTS = 120;

export interface UploadItem {
  /** Public path, served by /files/[...path]. */
  url: string;
  /** Original-ish filename with the timestamp prefix stripped. */
  name: string;
  /** ISO instant the file was uploaded. */
  uploaded: string;
}

const VARIANT_RE = /\.w\d+\.webp$/i;
const IMAGE_RE = /\.(png|jpe?g|webp|gif)$/i;
const STAMP_RE = /^(\d{10,})-/;

/**
 * Turn one R2 key into a picker item, or null when the key is not a primary
 * image (responsive `.wNNN.webp` siblings, non-image files). `fallback` is
 * the R2 upload time, used when the filename carries no timestamp.
 */
export function parseUploadKey(key: string, fallback: Date): (UploadItem & { stamp: number }) | null {
  if (VARIANT_RE.test(key) || !IMAGE_RE.test(key)) return null;
  const file = key.slice(key.lastIndexOf('/') + 1);
  const stamp = Number(file.match(STAMP_RE)?.[1] ?? 0) || fallback.getTime();
  return {
    url: `/files/${key}`,
    name: file.replace(STAMP_RE, ''),
    uploaded: new Date(stamp).toISOString(),
    stamp,
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
 * Newest-first list of primary image uploads under `prefix`, walking every
 * page of the listing and capping the result at `max`.
 */
export async function listRecentUploads(
  bucket: ListableBucket,
  { prefix = EDITOR_UPLOAD_PREFIX, max = DEFAULT_MAX_RESULTS }: { prefix?: string; max?: number } = {}
): Promise<UploadItem[]> {
  const items: Array<UploadItem & { stamp: number }> = [];
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix, limit: 1000, cursor });
    for (const obj of page.objects) {
      const item = parseUploadKey(obj.key, obj.uploaded);
      if (item) items.push(item);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  items.sort((a, b) => b.stamp - a.stamp);
  return items.slice(0, max).map(({ url, name, uploaded }) => ({ url, name, uploaded }));
}
