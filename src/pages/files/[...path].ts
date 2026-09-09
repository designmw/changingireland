export const prerender = false;
import type { APIRoute } from 'astro';
import { getUploads } from '~/lib/auth';
import { byteRange, etagMatches } from '~/lib/http-range';

function hasBody(object: R2Object): object is R2ObjectBody {
  return 'body' in object;
}

const widths = new Set([160, 320, 480, 720, 960, 1280]);

function responseHeaders(object: R2Object, originalKey: string, convertible: boolean): Headers {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('last-modified', object.uploaded.toUTCString());
  headers.set('content-length', String(object.size));
  headers.set('accept-ranges', 'bytes');
  if (!headers.has('content-type')) headers.set('content-type', 'application/octet-stream');
  headers.set(
    'cache-control',
    /^(uploads|ads)\//.test(originalKey)
      ? 'public, max-age=31536000, s-maxage=31536000, immutable'
      : 'public, max-age=86400, s-maxage=604800'
  );
  if (convertible) headers.set('vary', 'Accept');
  const filename = (object.key.split('/').pop() ?? 'file').replace(/["\\\r\n]/g, '');
  headers.set('content-disposition', `inline; filename="${filename}"`);
  return headers;
}

function allowsRange(request: Request, headers: Headers): boolean {
  const value = request.headers.get('if-range');
  if (!value) return true;
  if (value.startsWith('"') || value.startsWith('W/')) return value === headers.get('etag');
  const date = Date.parse(value);
  return Number.isFinite(date) && Date.parse(headers.get('last-modified') ?? '') <= date;
}

export const GET: APIRoute = async ({ params, request, locals }) => {
  const key = (params.path ?? '').toString();
  if (!key || key.includes('..')) return new Response(null, { status: 404 });
  const url = new URL(request.url);
  const width = Number(url.searchParams.get('w'));
  const raster = /\.(png|jpe?g|webp)$/i.test(key);
  const convertible = /\.(png|jpe?g)$/i.test(key);
  const wantsWebp = convertible && (request.headers.get('accept') ?? '').includes('image/webp');
  const candidates = [
    ...new Set([
      ...(raster && widths.has(width) ? [`${key}.w${width}.webp`] : []),
      ...(wantsWebp ? [`${key}.webp`] : []),
      key,
      ...(convertible ? [`${key}.webp`] : []),
    ]),
  ];
  const cacheUrl = new URL(url);
  cacheUrl.search = '';
  cacheUrl.searchParams.set(
    '__ci_media',
    `1:${wantsWebp ? 'webp' : 'original'}:${raster && widths.has(width) ? width : 'full'}`
  );
  const cacheKey = new Request(cacheUrl);
  // Only timestamped/immutable media. Magazine keys may be replaced in place.
  const edge =
    /^(uploads|ads)\//.test(key) && typeof caches !== 'undefined'
      ? (caches as CacheStorage & { default?: Cache }).default
      : undefined;
  try {
    const hit = await edge?.match(cacheKey);
    if (hit) {
      const headers = new Headers(hit.headers);
      headers.set('x-media-cache', 'hit');
      if (etagMatches(request.headers.get('if-none-match'), headers.get('etag') ?? ''))
        return new Response(null, { status: 304, headers });
      if (request.method === 'HEAD') return new Response(null, { headers });
      if (request.headers.has('range') && allowsRange(request, headers)) {
        const range = byteRange(request.headers.get('range'), Number(headers.get('content-length')));
        if (range === 'unsatisfiable') {
          headers.set('content-range', `bytes */${headers.get('content-length')}`);
          headers.delete('content-length');
          return new Response(null, { status: 416, headers });
        }
        if (range) {
          // The Workers Cache API slices cached bodies when Content-Length exists.
          const partial = await edge!.match(
            new Request(cacheUrl, { headers: { Range: `bytes=${range.offset}-${range.offset + range.length - 1}` } })
          );
          if (partial?.status === 206) return partial;
        } else return new Response(hit.body, { headers });
      } else return new Response(hit.body, { headers });
    }
  } catch {
    /* Cache is best-effort; storage remains authoritative. */
  }

  const bucket = await getUploads();
  if (!bucket) return new Response(null, { status: 404 });
  const metadataOnly =
    request.method === 'HEAD' || request.headers.has('range') || request.headers.has('if-none-match');
  let object: R2Object | R2ObjectBody | null = null;
  for (const candidate of candidates) {
    object = metadataOnly ? await bucket.head(candidate) : await bucket.get(candidate);
    if (object) break;
  }
  if (!object) return new Response(null, { status: 404 });
  const headers = responseHeaders(object, key, convertible);
  if (object.key !== candidates[0]) headers.set('cache-control', 'public, max-age=300, s-maxage=300');
  if (etagMatches(request.headers.get('if-none-match'), object.httpEtag))
    return new Response(null, { status: 304, headers });
  if (request.method === 'HEAD') return new Response(null, { headers });

  const range = allowsRange(request, headers) ? byteRange(request.headers.get('range'), object.size) : null;
  if (range === 'unsatisfiable') {
    headers.set('content-range', `bytes */${object.size}`);
    headers.delete('content-length');
    return new Response(null, { status: 416, headers });
  }
  if (!hasBody(object)) {
    // Pin the read to the metadata version so an in-place replacement cannot
    // produce a body with mismatching ETag, length or range headers.
    object = await bucket.get(object.key, { ...(range ? { range } : {}), onlyIf: { etagMatches: object.etag } });
    if (!object) return new Response(null, { status: 404 });
    if (!hasBody(object)) return new Response(null, { status: 503, headers: { 'Retry-After': '1' } });
  }
  if (range) {
    headers.set('content-range', `bytes ${range.offset}-${range.offset + range.length - 1}/${object.size}`);
    headers.set('content-length', String(range.length));
    return new Response(object.body, { status: 206, headers });
  }
  const response = new Response(object.body, { headers });
  // Bound any tee buffering to 10 MB. Large files remain streamed from R2.
  if (edge && object.size <= 10 * 1024 * 1024) {
    const put = edge.put(cacheKey, response.clone()).catch(() => {});
    const cf = (locals as { cfContext?: { waitUntil(promise: Promise<unknown>): void } } | undefined)?.cfContext;
    if (cf) cf.waitUntil(put);
    else await put;
    response.headers.set('x-media-cache', 'miss');
  }
  return response;
};

export const HEAD: APIRoute = GET;
