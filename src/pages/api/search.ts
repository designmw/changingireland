export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '~/lib/auth';
import { LIVE_WHERE, parseTaxonomies, type PostRow } from '~/lib/posts';

/**
 * Typeahead behind the header search box: top 8 published posts matching the
 * query, title matches ranked before author/body matches. Kept lean (one
 * LIKE query, small JSON) so the dropdown feels instant.
 */
export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') ?? '').trim().slice(0, 80);
  const db = await getDb();
  if (!db || q.length < 2) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const like = `%${q}%`;
  const { results } = await db
    .prepare(
      `SELECT title, slug, author, categories, image_url, COALESCE(published_at, created_at) AS date,
              (title LIKE ?) AS title_hit
         FROM posts
        WHERE ${LIVE_WHERE} AND (title LIKE ? OR author LIKE ? OR content LIKE ?)
        ORDER BY title_hit DESC, COALESCE(published_at, created_at) DESC
        LIMIT 8`
    )
    .bind(like, like, like, like)
    .all<Pick<PostRow, 'title' | 'slug' | 'author' | 'categories' | 'image_url'> & { date: string }>();

  const payload = (results ?? []).map((r) => ({
    title: r.title,
    url: `/${r.slug}`,
    author: r.author,
    category: parseTaxonomies(r.categories).filter((c) => c.slug !== 'uncategorized')[0]?.title ?? '',
    image: r.image_url ?? '',
    date: (r.date ?? '').slice(0, 10),
  }));

  return new Response(JSON.stringify({ results: payload }), {
    headers: {
      'Content-Type': 'application/json',
      // Same query repeats often while typing; let the edge absorb it.
      'Cache-Control': 'public, max-age=30, s-maxage=300',
    },
  });
};
