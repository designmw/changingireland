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
  // the D1 content keeps its original URLs and a missing sibling falls through.
  const convertible = /\.(png|jpe?g)$/i.test(key);
  const wantsWebp = convertible && (request.headers.get('accept') ?? '').includes('image/webp');
  let object = wantsWebp ? await bucket.get(`${key}.webp`) : null;
  if (!object) object = await bucket.get(key);

  // Last resort before giving up: the WebP sibling, even for a client that
  // didn't ask for it.
  //
  // The mirror populated R2 with the CONVERTED files but not the originals, so
  // for most of the archive `<key>` misses and only `<key>.webp` hits. Browsers
  // were fine (they send `Accept: image/webp` and take the first branch) but
  // anything else — the Facebook/LinkedIn/X scrapers fetching og:image, older
  // clients, plain curl — missed both lookups and fell through to the redirect
  // below. Serving WebP bytes to a client that didn't advertise WebP is a far
  // smaller problem than serving nothing: every browser released in the last
  // decade renders it, and the alternative here is a 404.
  if (!object && convertible) object = await bucket.get(`${key}.webp`);

  if (!object) {
    // Rollout-only safety net for a key that is in neither form: hand it back
    // to the WordPress origin that still holds the media.
    //
    // GO-LIVE: this only works while changingireland.ie still resolves to
    // WordPress. The moment DNS points that name at this Worker the redirect
    // becomes self-referential — /wp-content/… is not a route here — and any
    // image relying on it 404s. It is deliberately scoped to non-production
    // hosts so it cannot loop, and should be deleted once R2 coverage is
    // confirmed complete.
    const host = new URL(request.url).hostname;
    if (key.startsWith('uploads/') && host !== 'changingireland.ie' && host !== 'www.changingireland.ie') {
      // Built by hand rather than with Response.redirect(), which returns a
      // response whose headers are immutable — the security-header middleware
      // then can't stamp it. See the note in src/middleware.ts.
      return new Response(null, {
        status: 302,
        headers: { Location: `https://changingireland.ie/wp-content/${key}` },
      });
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
  // Quotes and backslashes are stripped rather than escaped — a stray quote in
  // an object key would otherwise close the quoted-string early and let the
  // rest of the key inject header parameters.
  const filename = (object.key.split('/').pop() ?? 'file').replace(/["\\\r\n]/g, '');
  headers.set('content-disposition', `inline; filename="${filename}"`);

  if (request.headers.get('if-none-match') === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(object.body, { headers });
};
