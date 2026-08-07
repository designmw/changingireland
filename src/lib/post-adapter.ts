/**
 * Bridges D1 post rows onto the shape the existing blog components expect.
 *
 * The blog UI (List, GridItem, SinglePost, RelatedPosts) was written against
 * the `Post` type produced by the Markdown content collection. Posts now come
 * from D1 so they can be published from /admin without a rebuild, so rows are
 * mapped here rather than rewriting every component.
 */
import { parseTaxonomies, type PostRow } from '~/lib/posts';
import type { Post } from '~/types';

export function rowToPost(row: PostRow): Post {
  const date = new Date((row.published_at ?? row.created_at).replace(' ', 'T'));
  // "Uncategorized" is WP's default bucket, not a real section — don't label
  // cards with it (posts keep it in the JSON column for the archive URL).
  const categories = parseTaxonomies(row.categories).filter((c) => c.slug !== 'uncategorized');
  const tags = parseTaxonomies(row.tags);
  return {
    id: String(row.id),
    slug: row.slug,
    permalink: `/${row.slug}`,
    publishDate: isNaN(date.getTime()) ? new Date() : date,
    title: row.title,
    excerpt: row.excerpt || undefined,
    image: row.image_url || undefined,
    // Not part of the base Post type; blog components read it for alt text.
    imageAlt: row.image_alt || undefined,
    category: categories[0],
    tags,
    author: row.author || undefined,
    draft: row.published === 0,
    Content: undefined,
    content: row.content,
    readingTime: Math.max(1, Math.round(row.content.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200)),
  } as unknown as Post;
}
