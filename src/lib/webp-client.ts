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
const VARIANT_QUALITY = 0.78;

// Keep aligned with Image.astro, /files/[...path].ts, and
// scripts/responsive-media.mjs.
export const RESPONSIVE_IMAGE_WIDTHS = [160, 320, 480, 720, 960, 1280] as const;

/**
 * Per-form override for the width cap. The default suits article and cover
 * images, which never render wider than about 800 CSS px. A full-width
 * homepage ad renders at 1216 CSS px, so capping it at 1600 leaves only ~1.3x
 * density and looks soft on a retina screen; that form asks for 2432 instead.
 */
export interface CompressOptions {
  maxWidth?: number;
}

/**
 * Re-encode a PNG/JPEG File as WebP, downscaling to MAX_WIDTH. Returns the
 * original File untouched for other types (GIF keeps its animation, WebP is
 * already done) and whenever conversion fails or wouldn't save bytes.
 */
export async function toWebp(file: File, maxWidth: number = MAX_WIDTH): Promise<File> {
  if (!/^image\/(png|jpeg)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    // scale ≤ 1: only ever shrink, never enlarge a small image.
    const scale = Math.min(1, maxWidth / bitmap.width);
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
 * Prepare the full-size upload plus the responsive WebP siblings used by
 * /files/?w=. GIFs keep their animation and intentionally have no variants.
 */
export async function toResponsiveWebp(file: File): Promise<{
  primary: File;
  variants: Array<{ width: number; file: File }>;
}> {
  const primary = await toWebp(file);
  if (file.type === 'image/gif') return { primary, variants: [] };

  try {
    const bitmap = await createImageBitmap(primary);
    const variants: Array<{ width: number; file: File }> = [];
    for (const width of RESPONSIVE_IMAGE_WIDTHS) {
      if (width >= bitmap.width) continue;
      const height = Math.max(1, Math.round((bitmap.height * width) / bitmap.width));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      ctx.drawImage(bitmap, 0, 0, width, height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', VARIANT_QUALITY));
      if (!blob || blob.type !== 'image/webp') continue;
      variants.push({
        width,
        file: new File([blob], `${primary.name}.w${width}.webp`, { type: 'image/webp' }),
      });
    }
    bitmap.close();
    return { primary, variants };
  } catch {
    return { primary, variants: [] };
  }
}

/**
 * Measure an image file's intrinsic size. Returns null if it can't be decoded,
 * so a caller can fall back rather than record a wrong box.
 */
async function measure(file: File): Promise<{ width: number; height: number } | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return null;
  }
}

/**
 * Write the final (post-conversion) dimensions of `input`'s file into the
 * hidden `<name>_width` / `<name>_height` fields, if the form has them.
 *
 * Workers can't decode images, so the browser is the only place these can be
 * measured — and they have to be taken after the WebP re-encode, which
 * downscales anything wider than MAX_WIDTH.
 */
async function recordDimensions(form: HTMLFormElement, name: string, file: File): Promise<void> {
  const widthField = form.elements.namedItem(`${name}_width`);
  const heightField = form.elements.namedItem(`${name}_height`);
  if (!(widthField instanceof HTMLInputElement) || !(heightField instanceof HTMLInputElement)) return;
  const size = await measure(file);
  if (!size) return;
  widthField.value = String(size.width);
  heightField.value = String(size.height);
}

/**
 * Make a multipart form compress its file inputs before submitting: intercepts
 * submit, converts the named inputs' files to WebP, swaps them in via
 * DataTransfer, then resubmits. No-ops when nothing needs converting.
 *
 * Also fills in `<name>_width`/`<name>_height` hidden fields when the form has
 * them — see recordDimensions.
 */
export function compressFormImages(form: HTMLFormElement, inputNames: string[], opts: CompressOptions = {}): void {
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
        const out = await toWebp(file, opts.maxWidth ?? MAX_WIDTH);
        // Measured on `out`, the bytes actually being uploaded — toWebp caps
        // width at MAX_WIDTH, so the original file's size would be wrong.
        await recordDimensions(form, input.name, out);
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
