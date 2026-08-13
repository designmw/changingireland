import { defineMiddleware } from 'astro:middleware';
import { getDb, getSessionId, getSessionUser } from '~/lib/auth';

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
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value);
  // Skipped in `astro dev`: Vite's HMR client uses inline eval and websockets
  // that a policy this tight would block, and dev is not the thing being
  // protected.
  if (!import.meta.env.DEV) response.headers.set('Content-Security-Policy', CSP);
  return response;
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

export const onRequest = defineMiddleware(async (context, next) => {
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
  const db = await getDb();
  if (db) {
    const sessionId = getSessionId(context.cookies);
    if (sessionId) {
      try {
        context.locals.user = await getSessionUser(db, sessionId);
      } catch {
        // table missing (migrations not applied yet) — treat as logged out
      }
    }
  }
  return withSecurityHeaders(await next());
});
