export const prerender = false;

import type { APIRoute } from 'astro';
import { getUploads } from '~/lib/auth';

/**
 * Public read-through to the UPLOADS R2 bucket: magazine PDFs, cover images,
 * and post images live at /files/<key>. Objects are immutable once uploaded
 * (new issues get new keys), so long cache lifetimes are safe.
 */
export const GET: APIRoute = async ({ params, request }) => {
  const key = (params.path ?? '').toString();
  const bucket = await getUploads();
  if (!bucket || !key || key.includes('..')) return new Response(null, { status: 404 });

  // PNG/JPEG keys may have a pre-generated WebP sibling at `<key>.webp`
  // (scripts/webp-media.mjs). Serve it to browsers that accept image/webp —
  // the D1 content keeps its original URLs, non-browser clients keep the
  // original bytes, and a missing sibling just falls through.
  const convertible = /\.(png|jpe?g)$/i.test(key);
  const wantsWebp = convertible && (request.headers.get('accept') ?? '').includes('image/webp');
  let object = wantsWebp ? await bucket.get(`${key}.webp`) : null;
  if (!object) object = await bucket.get(key);
  if (!object) {
    // uploads/… keys mirror the old WordPress media library. Until (or unless)
    // scripts/mirror-media.mjs has copied a given file into R2, fall back to
    // the original host so nothing 404s — locally and during rollout.
    if (key.startsWith('uploads/')) {
      return Response.redirect(`https://changingireland.ie/wp-content/${key}`, 302);
    }
    return new Response(null, { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  if (!headers.has('content-type')) headers.set('content-type', 'application/octet-stream');
  headers.set('cache-control', 'public, max-age=86400, s-maxage=604800');
  if (convertible) headers.set('vary', 'Accept');
  // PDFs open in the browser tab; the filename is still right on download.
  headers.set('content-disposition', `inline; filename="${object.key.split('/').pop()}"`);

  if (request.headers.get('if-none-match') === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(object.body, { headers });
};
