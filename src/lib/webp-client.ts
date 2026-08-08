/**
 * Client-side image compression for admin uploads. Workers can't run an image
 * encoder, so PNG/JPEG files are re-encoded to WebP in the browser (canvas)
 * before they're sent: capped at 1600px wide, quality 0.82. GIFs (animation)
 * and files already in WebP pass through untouched, and any failure falls back
 * to the original file so an upload never breaks over compression.
 */

// Mirrors the server-side pipeline (scripts/webp-media.mjs): same 1600px cap;
// canvas encoding is a touch lossier than sharp, so quality sits slightly
// higher to compensate.
const MAX_WIDTH = 1600;
const QUALITY = 0.82;

/**
 * Re-encode a PNG/JPEG File as WebP, downscaling to MAX_WIDTH. Returns the
 * original File untouched for other types (GIF keeps its animation, WebP is
 * already done) and whenever conversion fails or wouldn't save bytes.
 */
export async function toWebp(file: File): Promise<File> {
  if (!/^image\/(png|jpeg)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    // scale ≤ 1: only ever shrink, never enlarge a small image.
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', QUALITY));
    // Older Safari ignores the requested type and hands back a PNG.
    if (!blob || blob.type !== 'image/webp') return file;
    // If nothing was downscaled, the re-encode must actually be smaller to be
    // worth it (screenshots and flat PNGs sometimes aren't).
    if (scale === 1 && blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([blob], name, { type: 'image/webp' });
  } catch {
    // Never block an upload over compression — the server accepts PNG/JPEG too.
    return file;
  }
}

/**
 * Make a multipart form compress its file inputs before submitting: intercepts
 * submit, converts the named inputs' files to WebP, swaps them in via
 * DataTransfer, then resubmits. No-ops when nothing needs converting.
 */
export function compressFormImages(form: HTMLFormElement, inputNames: string[]): void {
  // Guards the resubmit below: the second pass through this listener must fall
  // through to the real submit instead of intercepting again.
  let converted = false;
  form.addEventListener('submit', (event) => {
    if (converted) return;
    const pending = inputNames
      .map((name) => form.elements.namedItem(name))
      .filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && !!el.files?.length);
    if (!pending.length) return;
    event.preventDefault();
    // Preserve which button submitted, so its name/value still posts.
    const submitter = event.submitter ?? undefined;
    void Promise.all(
      pending.map(async (input) => {
        const file = input.files![0];
        const out = await toWebp(file);
        if (out === file) return;
        // File inputs are read-only except via a DataTransfer's FileList.
        const dt = new DataTransfer();
        dt.items.add(out);
        input.files = dt.files;
      })
    ).then(() => {
      converted = true;
      // requestSubmit (not submit()) so validation and submit listeners — for
      // example Astro's ClientRouter form interception — still run.
      form.requestSubmit(submitter);
    });
  });
}
