/**
 * Browser-side helpers for the featured-image picker on the article editor
 * (src/pages/admin/news/edit.astro). Kept out of the page script so they can
 * be unit-tested.
 */

export interface PickerImage {
  url: string;
  name: string;
}

/**
 * Image URLs used in an article's HTML, in document order, without
 * duplicates. Inline data: images are skipped — they can't be a featured
 * image path. Uses DOMParser, so browser (or happy-dom) only.
 */
export function articleImages(html: string): PickerImage[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const seen = new Set<string>();
  const out: PickerImage[] = [];
  doc.querySelectorAll('img[src]').forEach((el) => {
    const url = el.getAttribute('src')?.trim() ?? '';
    if (!url || url.startsWith('data:') || seen.has(url)) return;
    seen.add(url);
    out.push({ url, name: url.slice(url.lastIndexOf('/') + 1) || url });
  });
  return out;
}

/**
 * Thumbnail URL for a picker tile. R2-served images get the 320px responsive
 * variant (see /files/[...path].ts; a missing variant falls through to the
 * full image). Anything else is used as-is.
 */
export function thumbUrl(url: string): string {
  return url.startsWith('/files/') ? `${url}?w=320` : url;
}
