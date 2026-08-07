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

  const object = await bucket.get(key);
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
  // PDFs open in the browser tab; the filename is still right on download.
  headers.set('content-disposition', `inline; filename="${key.split('/').pop()}"`);

  if (request.headers.get('if-none-match') === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(object.body, { headers });
};
