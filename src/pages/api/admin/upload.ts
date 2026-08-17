export const prerender = false;

import type { APIRoute } from 'astro';
import { isEditor } from '~/lib/admin';
import { getUploads } from '~/lib/auth';

const RESPONSIVE_IMAGE_WIDTHS = [160, 320, 480, 720, 960, 1280] as const;

/**
 * Image upload for the admin rich-text editor: multipart POST with an `image`
 * file, stored in R2 under uploads/editor/YYYY/MM/…, served back via /files/.
 * Editor-gated — the same people who can publish articles.
 */
export const POST: APIRoute = async (context) => {
  if (!(await isEditor(context))) {
    return new Response(JSON.stringify({ error: 'Not allowed' }), { status: 403 });
  }
  const uploads = await getUploads();
  if (!uploads) return new Response(JSON.stringify({ error: 'Storage unavailable' }), { status: 503 });

  let form: FormData;
  try {
    form = await context.request.formData();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid upload' }), { status: 400 });
  }

  const file = form.get('image');
  if (!(file instanceof File) || file.size === 0) {
    return new Response(JSON.stringify({ error: 'Choose an image file' }), { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: 'Images must be under 10 MB' }), { status: 400 });
  }
  const ext = file.name.match(/\.(png|jpe?g|webp|gif)$/i)?.[0].toLowerCase();
  if (!ext) {
    return new Response(JSON.stringify({ error: 'Use a PNG, JPG, WebP, or GIF image' }), { status: 400 });
  }

  const now = new Date();
  const stamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const key = `uploads/editor/${stamp}/${Date.now()}-${safeName || 'image'}${ext}`;
  const type =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.gif' ? 'image/gif' : 'image/jpeg';

  const variants: Array<{ width: number; file: File }> = [];
  for (const width of RESPONSIVE_IMAGE_WIDTHS) {
    const variant = form.get(`image_${width}`);
    if (variant === null) continue;
    if (!(variant instanceof File) || variant.size === 0 || variant.type !== 'image/webp') {
      return new Response(JSON.stringify({ error: 'Invalid responsive image variant' }), { status: 400 });
    }
    if (variant.size > 4 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Responsive image variant is too large' }), { status: 400 });
    }
    variants.push({ width, file: variant });
  }

  await Promise.all([
    uploads.put(key, file.stream(), { httpMetadata: { contentType: type } }),
    ...variants.map(({ width, file: variant }) =>
      uploads.put(`${key}.w${width}.webp`, variant.stream(), { httpMetadata: { contentType: 'image/webp' } })
    ),
  ]);

  return new Response(JSON.stringify({ url: `/files/${key}` }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
