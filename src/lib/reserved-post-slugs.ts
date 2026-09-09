// Root routes plus the imported information pages served by [slug].astro.
// Keep this list in step with new static root pages.
const reserved = new Set([
  'news',
  'search',
  'magazines',
  'about-us',
  'contact',
  'videos',
  'login',
  'logout',
  'admin',
  'api',
  'files',
  'category',
  'tag',
  '404',
  '_image',
  '_astro',
  'rss.xml',
  'sitemap.xml',
  'robots.txt',
  'ci-logo.webp',
  ...Object.keys(import.meta.glob('../data/wp-pages/*.json')).map((path) =>
    path
      .split('/')
      .pop()!
      .replace(/\.json$/, '')
  ),
]);
export const isReservedPostSlug = (slug: string) => reserved.has(slug.trim().toLowerCase());
