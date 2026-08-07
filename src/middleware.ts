import { defineMiddleware } from 'astro:middleware';
import { getDb, getSessionId, getSessionUser } from '~/lib/auth';

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
  if (redirectTo) return context.redirect(redirectTo, 301);

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
    return next();
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
  return next();
});
