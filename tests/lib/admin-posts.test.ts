import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { testDatabase } from '../helpers/sqlite-d1';
import {
  createPost,
  updatePost,
  getAdminPostPage,
  getLatestCategoryPosts,
  getPublishedPage,
  getPostById,
} from '~/lib/posts';
let fixture: ReturnType<typeof testDatabase>;
const base = {
  title: 'Article',
  slug: 'article',
  content: '<p>Long body</p>',
  excerpt: 'Summary',
  publish: true,
  publishedAt: '2020-01-01T00:00:00Z',
};
beforeEach(() => {
  fixture = testDatabase();
});
afterEach(() => fixture.sqlite.close());

describe('bounded article queries and index maintenance', () => {
  it('paginates in SQL and never transfers article content for a list', async () => {
    for (let i = 0; i < 30; i++) await createPost(fixture.db, { ...base, slug: `story-${i}`, title: `Story ${i}` });
    const page = await getAdminPostPage(fixture.db, { page: 999 });
    expect(page).toMatchObject({ page: 2, total: 30, totalPages: 2 });
    expect(page.rows).toHaveLength(5);
    expect(page.rows[0]).not.toHaveProperty('content');
    expect((await getAdminPostPage(fixture.db, { page: NaN })).rows).toHaveLength(25);
    expect(fixture.queries.filter((sql) => sql.startsWith('SELECT')).every((sql) => !sql.includes('SELECT *'))).toBe(
      true
    );
  });
  it('separates draft, scheduled and published filters and supports literal search', async () => {
    await createPost(fixture.db, { ...base, title: '100% funding' });
    await createPost(fixture.db, { ...base, slug: 'draft', publish: false });
    await createPost(fixture.db, { ...base, slug: 'scheduled', publishedAt: '2999-01-01T00:00:00Z' });
    for (const status of ['published', 'draft', 'scheduled'])
      expect((await getAdminPostPage(fixture.db, { status })).total).toBe(1);
    expect((await getAdminPostPage(fixture.db, { q: '%' })).total).toBe(1);
  });
  it('keeps category visibility and order aligned after publish and taxonomy edits', async () => {
    const category = [{ slug: 'community', title: 'Community' }];
    const id = await createPost(fixture.db, { ...base, publish: false, categories: category });
    expect(await getLatestCategoryPosts(fixture.db, 'community')).toEqual([]);
    await updatePost(fixture.db, id, { ...base, categories: category });
    expect((await getLatestCategoryPosts(fixture.db, 'community'))[0].id).toBe(id);
    await updatePost(fixture.db, id, {
      ...base,
      categories: [{ slug: 'new', title: 'New' }],
      publishedAt: '2999-01-01T00:00:00Z',
    });
    expect(await getLatestCategoryPosts(fixture.db, 'community')).toEqual([]);
    expect(await getLatestCategoryPosts(fixture.db, 'new')).toEqual([]);
    const stored = await getPostById(fixture.db, id);
    expect(fixture.sqlite.prepare('SELECT published, sort_at FROM post_taxonomies').get()).toMatchObject({
      published: 1,
      sort_at: stored!.published_at,
    });
  });
  it('gets the homepage category article without a count or a temporary sort', async () => {
    await createPost(fixture.db, { ...base, categories: [{ slug: 'community', title: 'Community' }] });
    fixture.queries.length = 0;
    expect(await getLatestCategoryPosts(fixture.db, 'community')).toHaveLength(1);
    expect(fixture.queries).toHaveLength(1);
    const plan = fixture.sqlite.prepare(`EXPLAIN QUERY PLAN ${fixture.queries[0]}`).all('community', 0, 1);
    expect(JSON.stringify(plan)).toContain('idx_ptax_live');
    expect(JSON.stringify(plan)).not.toContain('TEMP B-TREE');
  });
  it('keeps category totals fresh after edits and does not transfer bodies publicly', async () => {
    const id = await createPost(fixture.db, { ...base, categories: [{ slug: 'community', title: 'Community' }] });
    const before = await getPublishedPage(fixture.db, { category: 'community' });
    expect(before.total).toBe(1);
    expect(before.rows[0]).not.toHaveProperty('content');
    await updatePost(fixture.db, id, { ...base, publish: false });
    expect((await getPublishedPage(fixture.db, { category: 'community' })).total).toBe(0);
  });
});
