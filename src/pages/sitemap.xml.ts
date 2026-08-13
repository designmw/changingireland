export const prerender = false;

import type { APIRoute } from 'astro';
import { SITE } from 'astrowind:config';
import { getDb } from '~/lib/auth';
import { LIVE_WHERE, parseTaxonomies } from '~/lib/posts';

/**
 * The sitemap, rendered on demand from D1.
 *
 * This replaces @astrojs/sitemap, which could only ever see prerendered
 * routes. Every article, archive, and ported page on this site is
 * `prerender = false`, so the generated sitemap listed 18 URLs — the static
 * shell — and not one of the ~1k articles, while happily advertising every
 * /admin/* route and /login. Building it from the database instead means it is
 * correct by construction: articles appear the moment they publish, and the
 * admin surface can't leak into it because nothing here enumerates routes.
 *
 * Same reasoning as rss.xml.ts, which already reads from D1 for the same
 * reason. Cached briefly at the edge: worth it on a file this size, short
 * enough that a newly published article shows up quickly.
 */

/** Pages that exist as real .astro routes, with a rough priority each. */
const STATIC_PAGES: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/news', priority: '0.9', changefreq: 'daily' },
  { path: '/magazines', priority: '0.8', changefreq: 'monthly' },
  { path: '/about-us', priority: '0.6', changefreq: 'yearly' },
  { path: '/contact', priority: '0.6', changefreq: 'yearly' },
  { path: '/videos', priority: '0.5', changefreq: 'monthly' },
];

/**
 * The pages ported out of WordPress. They're served by [slug].astro from
 * src/data/wp-pages/*.json, so they have no route of their own to discover —
 * read the same directory the page does.
 */
const wpPageSlugs = Object.values(
  import.meta.glob<{ default: { slug: string } }>('../data/wp-pages/*.json', { eager: true })
).map((m) => m.default.slug);

/** XML-escape a URL or text node. */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** D1 stores `YYYY-MM-DD HH:MM:SS`; W3C datetime wants the date part. */
const lastmod = (value?: string | null) => (value ? value.slice(0, 10) : undefined);

function urlEntry(loc: string, opts: { lastmod?: string; changefreq?: string; priority?: string } = {}): string {
  return [
    '  <url>',
    `    <loc>${esc(loc)}</loc>`,
    opts.lastmod ? `    <lastmod>${opts.lastmod}</lastmod>` : '',
    opts.changefreq ? `    <changefreq>${opts.changefreq}</changefreq>` : '',
    opts.priority ? `    <priority>${opts.priority}</priority>` : '',
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export const GET: APIRoute = async () => {
  const base = String(SITE.site).replace(/\/$/, '');
  const db = await getDb();

  const entries: string[] = STATIC_PAGES.map((p) =>
    urlEntry(`${base}${p.path === '/' ? '' : p.path}`, { changefreq: p.changefreq, priority: p.priority })
  );

  for (const slug of wpPageSlugs) {
    entries.push(urlEntry(`${base}/${slug}`, { changefreq: 'yearly', priority: '0.5' }));
  }

  if (db) {
    // Only the columns the sitemap needs — `SELECT *` over ~1k rows would drag
    // every article body through the Worker for four fields.
    //
    // A database error degrades to the static half of the sitemap rather than
    // 500ing: a sitemap listing fewer URLs is a bad day, a sitemap returning an
    // error to Googlebot is a worse one.
    let results: { slug: string; categories: string; updated_at: string; date: string }[] = [];
    try {
      const query = await db
        .prepare(
          `SELECT slug, categories, updated_at, COALESCE(published_at, created_at) AS date
             FROM posts
            WHERE ${LIVE_WHERE}
            ORDER BY COALESCE(published_at, created_at) DESC`
        )
        .all<{ slug: string; categories: string; updated_at: string; date: string }>();
      results = query.results ?? [];
    } catch (err) {
      console.error('sitemap: could not read posts from D1', err);
    }

    const categories = new Map<string, string>();
    for (const row of results) {
      entries.push(
        urlEntry(`${base}/${row.slug}`, {
          lastmod: lastmod(row.updated_at ?? row.date),
          changefreq: 'monthly',
          priority: '0.7',
        })
      );
      // Category archives are worth indexing (unlike the 1,761 tag archives,
      // which config.yaml deliberately keeps noindex — so they stay out here
      // too). Track the newest post date per category as its lastmod.
      for (const cat of parseTaxonomies(row.categories)) {
        if (cat.slug === 'uncategorized') continue;
        if (!categories.has(cat.slug)) categories.set(cat.slug, lastmod(row.date) ?? '');
      }
    }

    for (const [slug, date] of categories) {
      entries.push(
        urlEntry(`${base}/category/${slug}`, { lastmod: date || undefined, changefreq: 'weekly', priority: '0.6' })
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  });
};
