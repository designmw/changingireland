import { defineMiddleware } from 'astro:middleware';
import { getDb, getSessionId, getSessionUser } from '~/lib/auth';
import { withContentCache, getContentState, pageCacheKey, contentTtl, type ContentState } from '~/lib/content-cache';

/**
 * Security headers.
 *
 * These have to be set here, not in `public/_headers`. That file is applied by
 * Cloudflare's static-asset layer, and almost nothing on this site is a static
 * asset: every page is `prerender = false` and rendered by the Worker, so an
 * asset-layer rule never sees it. Before this, a request for `/robots.txt` came
 * back with the full set and a request for `/` came back with none of them —
 * meaning /login and /admin were framable by anyone. `_headers` is kept as the
 * asset-layer half of the same policy; keep the two in step.
 */
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  // No `includeSubDomains`: it would apply to every changingireland.ie
  // subdomain, including any legacy mail//webmail host still on plain HTTP,
  // and the commitment lasts a year in browsers that have seen it. Add it
  // (and `preload`) once every subdomain is confirmed HTTPS-only.
  'Strict-Transport-Security': 'max-age=31536000',
};

/**
 * Content-Security-Policy.
 *
 * `script-src` needs 'unsafe-inline': Astro's ClientRouter, BasicScripts, and
 * the consent/analytics snippets are all inline, and there is no nonce plumbed
 * through the components to hash against. So this is not the XSS backstop —
 * server-side sanitising in src/lib/sanitize.ts is. What it does buy is
 * frame-ancestors (clickjacking, and unlike X-Frame-Options it is the directive
 * browsers still honour), form-action (a stolen form can't post credentials
 * off-origin), base-uri (no <base> hijack of every relative URL), and
 * object-src (no legacy plugin embeds).
 *
 * Third-party origins, all of them already used by the site: googletagmanager
 * (GA, gated behind consent), challenges.cloudflare.com (Turnstile on the
 * contact form), maps.google.com (footer map), youtube-nocookie (click-to-play
 * embeds on /videos, and article embeds allowed by the sanitiser).
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com",
  'frame-src https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com https://open.spotify.com https://w.soundcloud.com https://maps.google.com https://www.google.com https://challenges.cloudflare.com',
  "media-src 'self' https:",
  'upgrade-insecure-requests',
].join('; ');

function withSecurityHeaders(response: Response): Response {
  // Some responses arrive with an immutable headers guard — notably anything
  // built by `Response.redirect()`. Calling .set() on those throws
  // "Can't modify immutable headers", and Astro swallows the exception into a
  // bare 404, so the redirect silently becomes a dead end. Rebuild the
  // response in that case; `new Response(body, init)` gives mutable headers.
  //
  // Worth keeping: this is easy to reintroduce, because it only shows up on
  // the redirect paths, and only once a header is actually set here.
  let out = response;
  try {
    out.headers.set('X-Content-Type-Options', SECURITY_HEADERS['X-Content-Type-Options']);
  } catch {
    out = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });
  }

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) out.headers.set(name, value);
  // Skipped in `astro dev`: Vite's HMR client uses inline eval and websockets
  // that a policy this tight would block, and dev is not the thing being
  // protected.
  if (!import.meta.env.DEV) out.headers.set('Content-Security-Policy', CSP);
  return out;
}

/**
 * 301s for WordPress URL shapes that changed in the rebuild. Post URLs did NOT
 * change (root-level slugs), but WP's /page/N/ pagination is now ?page=N, and
 * the WP feeds live at /rss.xml.
 */
function legacyRedirect(url: URL): string | null {
  const p = url.pathname.replace(/\/+$/, '');

  // /category/x/page/3 and /tag/x/page/3 -> /category/x?page=3
  let m = p.match(/^(\/(?:category|tag)\/[^/]+)\/page\/(\d+)$/);
  if (m) return Number(m[2]) > 1 ? `${m[1]}?page=${m[2]}` : m[1];

  // Site-wide index pagination /page/3 -> /news?page=3
  m = p.match(/^\/page\/(\d+)$/);
  if (m) return Number(m[1]) > 1 ? `/news?page=${m[1]}` : '/news';

  // Feeds: /feed, /comments/feed, /category/x/feed -> /rss.xml
  if (p === '/feed' || p.endsWith('/feed')) return '/rss.xml';

  return null;
}

/** Public HTML is keyed by an atomic D1 revision and the publication clock.
 * One small indexed query precedes cache hits so withdrawals are effective
 * across every colo. No module-level or eventually-consistent revision cache.
 */
const EDGE_TTL = 3600;

function isEdgeCacheable(request: Request, url: URL): boolean {
  if (request.method !== 'GET') return false;
  if (import.meta.env.DEV) return false;
  const p = url.pathname;
  // Anything that is user-specific, mutating, or an auth surface stays uncached.
  if (p === '/api/search') return (url.searchParams.get('q') ?? '').trim().length >= 2;
  if (p === '/api' || p.startsWith('/api/')) return false;
  // Media has its own cache policy and varies by Accept/conditional headers.
  // A URL-only page cache would bypass that negotiation and revalidation.
  if (p === '/files' || p.startsWith('/files/') || p === '/_image') return false;
  if (p.startsWith('/admin') || p.startsWith('/login') || p.startsWith('/logout')) return false;
  return true;
}

export const onRequest = defineMiddleware((context, next) =>
  withContentCache(async () => {
    const redirectTo = legacyRedirect(context.url);
    if (redirectTo) return withSecurityHeaders(context.redirect(redirectTo, 301));

    context.locals.user = null;

    // Dev-only auth bypass: /admin opens without logging in. import.meta.env.DEV
    // is false in production builds, so this never ships. Add ?nobypass=1 to any
    // URL to see the real logged-out experience locally.
    if (import.meta.env.DEV && !context.url.searchParams.has('nobypass')) {
      context.locals.user = {
        id: 0,
        email: 'dev@changingireland.ie',
        username: 'devbypass',
        first_name: 'Dev',
        last_name: 'Preview',
      };
      return withSecurityHeaders(await next());
    }
    const sessionId = getSessionId(context.cookies);
    // DOM and Workers both declare CacheStorage; narrow the runtime extension
    // here without changing the browser's CacheStorage type across the project.
    const edgeCache =
      typeof caches === 'undefined' ? undefined : (caches as CacheStorage & { default?: Cache }).default;

    // Validate the global content revision before reusing anonymous HTML.
    const db = await getDb();
    let cacheState: ContentState | undefined;
    if (!sessionId && db && isEdgeCacheable(context.request, context.url)) {
      try {
        cacheState = await getContentState(db);
      } catch {
        // Never serve potentially withdrawn content if revision validation fails.
      }
    }
    const canCache = !!cacheState;
    const cacheKey = cacheState ? pageCacheKey(context.url, cacheState) : undefined;
    if (canCache && edgeCache) {
      try {
        const hit = await edgeCache.match(cacheKey!);
        if (hit) {
          const served = new Response(hit.body, hit);
          served.headers.set('x-edge-cache', 'hit');
          served.headers.set('Cache-Control', 'private, no-cache');
          return served;
        }
      } catch {
        // Cache API unavailable (e.g. astro dev) — fall through to a live render.
      }
    }

    if (db && sessionId) {
      try {
        context.locals.user = await getSessionUser(db, sessionId);
      } catch {
        // table missing (migrations not applied yet) — treat as logged out
      }
    }

    const response = withSecurityHeaders(await next());
    if (cacheState) response.headers.set('Cache-Control', 'private, no-cache');

    // Store a copy for the next anonymous visitor. Never cache an error, a
    // response that sets a cookie, or anything rendered for a logged-in user.
    // This is a best-effort side effect: we cache a clone and always return the
    // original response with its body untouched, so a cache failure can never
    // break the page.
    if (
      canCache &&
      contentTtl(cacheState!, EDGE_TTL) > 0 &&
      edgeCache &&
      !context.locals.user &&
      response.status === 200 &&
      !response.headers.has('set-cookie')
    ) {
      try {
        const cacheCopy = response.clone();
        cacheCopy.headers.set(
          'Cache-Control',
          `public, max-age=0, s-maxage=${contentTtl(cacheState!, context.url.pathname === '/api/search' ? 300 : EDGE_TTL)}`
        );
        // Astro v6 exposes the Cloudflare ExecutionContext as locals.cfContext;
        // waitUntil lets the cache write finish after the response is sent.
        const cf = (context.locals as { cfContext?: { waitUntil?: (p: Promise<unknown>) => void } }).cfContext;
        const put = edgeCache.put(cacheKey!, cacheCopy).catch(() => {});
        if (cf && typeof cf.waitUntil === 'function') cf.waitUntil(put);
        else await put;
      } catch {
        // Cache write failed — the original response below is still served.
      }
      try {
        response.headers.set('x-edge-cache', 'miss');
      } catch {
        /* immutable headers — skip the status header */
      }
    }

    return response;
  })
);
