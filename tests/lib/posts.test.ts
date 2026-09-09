import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { testDatabase } from '../helpers/sqlite-d1';
import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getPostBySlug,
  getPublishedPage,
  getFeaturedPosts,
  getCachedTaxonomyCounts,
  slugTaken,
  isLive,
  type PostInput,
} from '~/lib/posts';

let fixture: ReturnType<typeof testDatabase>;
const input = (overrides: Partial<PostInput> = {}): PostInput => ({
  title: 'Community news',
  slug: 'community-news',
  content: '<p>Local news.</p>',
  excerpt: 'Local news.',
  publish: false,
  ...overrides,
});
beforeEach(() => {
  fixture = testDatabase();
});
afterEach(() => {
  fixture.sqlite.close();
  vi.restoreAllMocks();
});

describe('article persistence with the real migration schema and triggers', () => {
  it('creates a draft with all article details and keeps it off public listings', async () => {
    const id = await createPost(
      fixture.db,
      input({
        imageUrl: '/files/photo.webp',
        imageAlt: 'Volunteers',
        author: 'Editor',
        categories: [{ slug: 'community', title: 'Community' }],
        tags: [{ slug: 'funding', title: 'Funding' }],
      })
    );
    expect(await getPostById(fixture.db, id)).toMatchObject({
      title: 'Community news',
      content: '<p>Local news.</p>',
      excerpt: 'Local news.',
      image_url: '/files/photo.webp',
      image_alt: 'Volunteers',
      author: 'Editor',
      published: 0,
      published_at: null,
    });
    expect(fixture.sqlite.prepare('SELECT COUNT(*) AS n FROM post_taxonomies').get()).toMatchObject({ n: 2 });
    expect((await getPublishedPage(fixture.db)).rows).toHaveLength(0);
  });

  it('publishes an article and updates archive and category counts', async () => {
    const id = await createPost(
      fixture.db,
      input({ publish: true, featured: true, categories: [{ slug: 'community', title: 'Community' }] })
    );
    expect((await getPublishedPage(fixture.db)).total).toBe(1);
    expect((await getFeaturedPosts(fixture.db))[0].id).toBe(id);
    expect(await getCachedTaxonomyCounts(fixture.db, 'categories')).toEqual([
      { slug: 'community', title: 'Community', count: 1 },
    ]);
  });

  it('updates text, image details, author, tags and categories without leaving stale taxonomy rows', async () => {
    const id = await createPost(fixture.db, input({ categories: [{ slug: 'old', title: 'Old' }] }));
    await updatePost(
      fixture.db,
      id,
      input({
        title: 'New title',
        slug: 'new-title',
        content: '<h2>Details</h2><p>Updated.</p>',
        excerpt: 'Updated summary',
        imageUrl: '/files/new.webp',
        imageAlt: 'New photo',
        author: 'New author',
        publish: true,
        categories: [{ slug: 'new', title: 'New' }],
        tags: [{ slug: 'tag', title: 'Tag' }],
      })
    );
    expect(await getPostBySlug(fixture.db, 'community-news')).toBeNull();
    expect(await getPostById(fixture.db, id)).toMatchObject({
      title: 'New title',
      slug: 'new-title',
      content: '<h2>Details</h2><p>Updated.</p>',
      excerpt: 'Updated summary',
      image_url: '/files/new.webp',
      image_alt: 'New photo',
      author: 'New author',
      published: 1,
    });
    expect(fixture.sqlite.prepare('SELECT slug FROM post_taxonomies ORDER BY slug').all()).toEqual([
      { slug: 'new' },
      { slug: 'tag' },
    ]);
  });

  it('preserves the original publication date during later edits', async () => {
    const id = await createPost(fixture.db, input({ publish: true, publishedAt: '2020-01-01T12:00:00Z' }));
    await updatePost(fixture.db, id, input({ publish: true, title: 'Edited' }));
    expect((await getPostById(fixture.db, id))?.published_at).toBe('2020-01-01T12:00:00Z');
  });

  it('unpublishes an article and removes it from public counts and featured results', async () => {
    const id = await createPost(fixture.db, input({ publish: true, featured: true }));
    await updatePost(fixture.db, id, input({ publish: false, featured: true }));
    expect((await getPublishedPage(fixture.db)).total).toBe(0);
    expect(await getFeaturedPosts(fixture.db)).toEqual([]);
  });

  it('deletes an article, its taxonomy rows, and its cached counts', async () => {
    const id = await createPost(
      fixture.db,
      input({ publish: true, categories: [{ slug: 'community', title: 'Community' }] })
    );
    await deletePost(fixture.db, id);
    expect(await getPostById(fixture.db, id)).toBeNull();
    expect(fixture.sqlite.prepare('SELECT * FROM post_taxonomies').all()).toEqual([]);
    expect((await getPublishedPage(fixture.db)).total).toBe(0);
    expect(await getCachedTaxonomyCounts(fixture.db, 'categories')).toEqual([]);
  });

  it('rejects duplicate addresses case-insensitively and excludes the current article from conflict checks', async () => {
    const id = await createPost(fixture.db, input());
    expect(await slugTaken(fixture.db, 'COMMUNITY-NEWS')).toBe(true);
    expect(await slugTaken(fixture.db, 'community-news', id)).toBe(false);
    await expect(createPost(fixture.db, input({ slug: 'COMMUNITY-NEWS' }))).rejects.toThrow(/UNIQUE/);
  });

  it('hides scheduled articles from archive and direct visibility checks', async () => {
    const id = await createPost(fixture.db, input({ publish: true, publishedAt: '2999-01-01T00:00:00Z' }));
    expect(isLive((await getPostById(fixture.db, id))!)).toBe(false);
    expect((await getPublishedPage(fixture.db)).rows).toEqual([]);
  });

  it('filters categories and tags together and clamps invalid page requests', async () => {
    await createPost(
      fixture.db,
      input({
        publish: true,
        categories: [{ slug: 'community', title: 'Community' }],
        tags: [{ slug: 'funding', title: 'Funding' }],
      })
    );
    expect((await getPublishedPage(fixture.db, { category: 'community', tag: 'funding', page: 99 })).rows).toHaveLength(
      1
    );
    expect((await getPublishedPage(fixture.db, { category: 'community', tag: 'other' })).rows).toHaveLength(0);
    expect((await getPublishedPage(fixture.db, { page: NaN })).page).toBe(1);
  });

  it('refreshes pagination totals when a scheduled article becomes due without another edit', async () => {
    await createPost(fixture.db, input({ publish: true, publishedAt: '2999-01-01T00:00:00Z' }));
    expect((await getPublishedPage(fixture.db)).total).toBe(0);
    fixture.sqlite.function('strftime', (_format: string, _value: string) => '3000-01-01T00:00:00Z');
    const page = await getPublishedPage(fixture.db);
    expect(page.rows).toHaveLength(1);
    expect(page.total).toBe(1);
  });

  it('recognises a future publication timestamp with a negative UTC offset', async () => {
    const id = await createPost(fixture.db, input({ publish: true, publishedAt: '2999-01-01T00:00:00-05:00' }));
    expect(isLive((await getPostById(fixture.db, id))!)).toBe(false);
  });

  it('rejects an article address that is reserved by a static site page', async () => {
    expect(await slugTaken(fixture.db, 'news')).toBe(true);
  });
});

describe('publication input validation', () => {
  it.each(['2026-02-30T12:00:00Z', '2026-13-01T12:00:00Z', 'not a date'])(
    'rejects invalid publication date %s without saving',
    async (publishedAt) => {
      await expect(createPost(fixture.db, input({ publishedAt }))).rejects.toThrow('valid publication date');
      expect(fixture.sqlite.prepare('SELECT COUNT(*) AS n FROM posts').get()).toMatchObject({ n: 0 });
    }
  );
  it('rejects reserved addresses in the write layer as well as form validation', async () => {
    await expect(createPost(fixture.db, input({ slug: 'contact' }))).rejects.toThrow('reserved');
  });
});
