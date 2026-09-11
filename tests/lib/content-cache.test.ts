import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { testDatabase } from '../helpers/sqlite-d1';
import {
  BUILD_ID,
  getContentState,
  contentEpoch,
  contentTtl,
  pageCacheKey,
  withContentCache,
} from '~/lib/content-cache';
import { createPost, updatePost, deletePost, getCachedLiveCount, getCachedTaxonomyCounts } from '~/lib/posts';

let fixture: ReturnType<typeof testDatabase>;
const post = { title: 'Story', slug: 'story', content: '<p>Text</p>', excerpt: 'Text', publish: true };
beforeEach(() => {
  fixture = testDatabase();
});
afterEach(() => {
  fixture.sqlite.close();
  vi.useRealTimers();
});

describe('content cache invalidation', () => {
  it('changes public cache keys after create, edit, unpublish and delete', async () => {
    const epochs: string[] = [];
    const capture = async () => epochs.push(contentEpoch(await getContentState(fixture.db)));
    await capture();
    const id = await createPost(fixture.db, post);
    await capture();
    await updatePost(fixture.db, id, { ...post, title: 'Changed' });
    await capture();
    await updatePost(fixture.db, id, { ...post, publish: false });
    await capture();
    await deletePost(fixture.db, id);
    await capture();
    expect(new Set(epochs).size).toBe(5);
  });

  it('memoises the small revision query within one request only', async () => {
    await withContentCache(async () => {
      await getContentState(fixture.db);
      await getContentState(fixture.db);
    });
    expect(fixture.queries).toHaveLength(1);
    await withContentCache(() => getContentState(fixture.db));
    expect(fixture.queries).toHaveLength(2);
  });

  it('invalidates cached derivatives after direct SQL writes and ignores derivative cache writes', async () => {
    await getCachedLiveCount(fixture.db);
    const before = await getContentState(fixture.db);
    await getCachedTaxonomyCounts(fixture.db, 'categories');
    expect(await getContentState(fixture.db)).toEqual(before);
    await createPost(fixture.db, post);
    expect(await getCachedLiveCount(fixture.db)).toBe(1);
    fixture.sqlite.exec('UPDATE posts SET published = 0');
    expect(await getCachedLiveCount(fixture.db)).toBe(0);
  });

  it('advances cache epoch and category counts exactly when a scheduled article is due', async () => {
    const due = '2999-01-01T00:00:00Z';
    await createPost(fixture.db, {
      ...post,
      publishedAt: due,
      categories: [{ slug: 'community', title: 'Community' }],
    });
    const before = await getContentState(fixture.db);
    expect(before.nextAt).toBe(due);
    expect(await getCachedTaxonomyCounts(fixture.db, 'categories')).toEqual([]);
    fixture.sqlite.function('strftime', (_format: string, _value: string) => due);
    const after = await getContentState(fixture.db);
    expect(after.revision).toBe(before.revision);
    expect(contentEpoch(after)).not.toBe(contentEpoch(before));
    expect(after.nextAt).toBeNull();
    expect(await getCachedTaxonomyCounts(fixture.db, 'categories')).toEqual([
      { slug: 'community', title: 'Community', count: 1 },
    ]);
  });

  it('caps HTML expiry at the next scheduled publication', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-09T12:00:00Z'));
    expect(contentTtl({ revision: 1, liveThrough: null, nextAt: '2026-09-09T12:00:10Z' })).toBe(10);
    expect(contentTtl({ revision: 1, liveThrough: null, nextAt: '2026-09-09T11:59:00Z' })).toBe(0);
  });

  it('coalesces tracking parameters but retains meaningful search and pagination', () => {
    const state = { revision: 1, liveThrough: null, nextAt: null };
    const key = (path: string) => pageCacheKey(new URL(path, 'https://changingireland.ie'), state).url;
    expect(key('/news?utm_source=email&page=2')).toBe(key('/news?page=2'));
    expect(key('/news?page=2')).not.toBe(key('/news?page=3'));
    expect(key('/search?q=Hello&category=Community&sort=oldest')).toBe(
      key('/search?category=community&sort=oldest&q=Hello&utm_source=test')
    );
    expect(key('/search?q=Hello')).not.toBe(key('/search?q=Other'));
    expect(key('/news?page=abc')).toBe(key('/news'));
  });

  it('never shares cached pages between deployments', () => {
    const state = { revision: 1, liveThrough: null, nextAt: null };
    const url = new URL('/some-article', 'https://changingireland.ie');
    expect(pageCacheKey(url, state, 'build-a').url).not.toBe(pageCacheKey(url, state, 'build-b').url);
    expect(pageCacheKey(url, state, 'build-a').url).toBe(pageCacheKey(url, state, 'build-a').url);
    expect(pageCacheKey(url, state).url).toBe(pageCacheKey(url, state, BUILD_ID).url);
  });
});
