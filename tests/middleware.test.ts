import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { testDatabase } from './helpers/sqlite-d1';
import { createPost, deletePost } from '~/lib/posts';
const { getDb, getSessionId } = vi.hoisted(() => ({ getDb: vi.fn(), getSessionId: vi.fn() }));
vi.mock('~/lib/auth', () => ({ getDb, getSessionId, getSessionUser: vi.fn() }));
vi.mock('astro:middleware', () => ({ defineMiddleware: (fn: unknown) => fn }));
import { onRequest } from '~/middleware';

let fixture: ReturnType<typeof testDatabase>;
let entries: Map<string, Response>;
let next: ReturnType<typeof vi.fn<() => Promise<Response>>>;
async function request(path = '/news') {
  const url = new URL(path, 'https://changingireland.ie');
  return (await onRequest(
    {
      url,
      request: new Request(url),
      cookies: {},
      locals: {},
      redirect: (to: string, status: number) => Response.redirect(new URL(to, url), status),
    } as unknown as Parameters<typeof onRequest>[0],
    next
  )) as Response;
}
beforeEach(() => {
  fixture = testDatabase();
  entries = new Map();
  vi.stubEnv('DEV', false);
  getDb.mockResolvedValue(fixture.db);
  getSessionId.mockReturnValue(undefined);
  vi.stubGlobal('caches', {
    default: {
      async match(key: Request) {
        return entries.get(key.url)?.clone();
      },
      async put(key: Request, response: Response) {
        entries.set(key.url, new Response(await response.text(), response));
      },
    },
  });
  next = vi.fn(async () => new Response('current content'));
});
afterEach(() => {
  fixture.sqlite.close();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('public page middleware', () => {
  it('serves a cache hit without re-rendering and prevents downstream stale HTML caching', async () => {
    expect((await request()).headers.get('x-edge-cache')).toBe('miss');
    const response = await request('/news?utm_source=email');
    expect(response.headers.get('x-edge-cache')).toBe('hit');
    expect(response.headers.get('cache-control')).toBe('private, no-cache');
    expect(next).toHaveBeenCalledTimes(1);
  });
  it('never serves an old page after an article is deleted', async () => {
    const id = await createPost(fixture.db, {
      title: 'Story',
      slug: 'story',
      content: '<p>Body</p>',
      excerpt: 'Body',
      publish: true,
    });
    await request('/story');
    await deletePost(fixture.db, id);
    next.mockImplementation(async () => new Response(null, { status: 404 }));
    expect((await request('/story')).status).toBe(404);
    expect(next).toHaveBeenCalledTimes(2);
  });
  it('bypasses cached HTML when the revision cannot be validated', async () => {
    await request();
    getDb.mockResolvedValue(undefined);
    next.mockImplementation(async () => new Response('fresh fallback'));
    expect(await (await request()).text()).toBe('fresh fallback');
  });
  it('caches search results with revision invalidation but never admin responses', async () => {
    await request('/api/search?q=test');
    await request('/api/search?q=test');
    expect(next).toHaveBeenCalledTimes(1);
    await request('/admin/news');
    await request('/admin/news');
    expect(next).toHaveBeenCalledTimes(3);
  });
});
