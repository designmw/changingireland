export const prerender = false;

import { getRssString } from '@astrojs/rss';

import { SITE, METADATA } from 'astrowind:config';
import { getPermalink } from '~/utils/permalinks';
import { getDb } from '~/lib/auth';
import { getPublishedPosts } from '~/lib/posts';

// The feed reads from D1 (not the content collection) so articles published
// from /admin appear without a rebuild. 50 newest items, like WP's default.
export const GET = async () => {
  const db = await getDb();
  if (!db) return new Response(null, { status: 404, statusText: 'Not found' });

  const posts = await getPublishedPosts(db, 50);

  const rss = await getRssString({
    title: SITE.name,
    description: METADATA?.description || '',
    site: import.meta.env.SITE,

    items: posts.map((post) => ({
      link: getPermalink(`/${post.slug}`, 'post'),
      title: post.title,
      description: post.excerpt,
      pubDate: new Date((post.published_at ?? post.created_at).replace(' ', 'T')),
      ...(post.author ? { author: post.author } : {}),
    })),

    trailingSlash: SITE.trailingSlash,
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
