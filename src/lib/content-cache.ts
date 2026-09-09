import { AsyncLocalStorage } from 'node:async_hooks';
import { getSetting, setSetting } from '~/lib/settings';

export interface ContentState {
  revision: number;
  liveThrough: string | null;
  nextAt: string | null;
}

// Request-local promises only. No response, binding or user data survives a request.
const scope = new AsyncLocalStorage<Map<D1Database, Promise<ContentState>>>();
export const withContentCache = <T>(run: () => T): T => scope.run(new Map(), run);
export const resetContentState = (db: D1Database) => scope.getStore()?.delete(db);

export function getContentState(db: D1Database): Promise<ContentState> {
  const memo = scope.getStore();
  const existing = memo?.get(db);
  if (existing) return existing;
  const pending = db
    .prepare(
      `SELECT revision,
    (SELECT sort_at FROM posts WHERE published = 1
      AND sort_at <= strftime('%Y-%m-%dT%H:%M:%SZ','now') ORDER BY sort_at DESC LIMIT 1) AS liveThrough,
    (SELECT sort_at FROM posts WHERE published = 1
      AND sort_at > strftime('%Y-%m-%dT%H:%M:%SZ','now') ORDER BY sort_at ASC LIMIT 1) AS nextAt
    FROM content_revision WHERE id = 1`
    )
    .first<ContentState>()
    .then((row) => {
      if (!row) throw new Error('Content cache migration has not been applied');
      return row;
    });
  memo?.set(db, pending);
  return pending;
}

// Advancing the publication clock changes the epoch without a scheduled write.
export const contentEpoch = (state: ContentState) => `${state.revision}:${state.liveThrough ?? 'none'}`;
export function contentTtl(state: ContentState, maximum = 3600): number {
  return state.nextAt
    ? Math.max(0, Math.min(maximum, Math.floor((Date.parse(state.nextAt) - Date.now()) / 1000)))
    : maximum;
}

export async function cachedContentValue<T>(db: D1Database, key: string, compute: () => Promise<T>): Promise<T> {
  const epoch = contentEpoch(await getContentState(db));
  const cached = await getSetting<{ epoch: string; value: T } | null>(db, `cache:${key}`, null);
  if (cached?.epoch === epoch) return cached.value;
  const value = await compute();
  await setSetting(db, `cache:${key}`, { epoch, value });
  return value;
}

/** Preserve functional parameters only; equivalent tracking URLs share HTML. */
export function pageCacheKey(url: URL, state: ContentState): Request {
  const key = new URL(url);
  key.search = '';
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/news' || /^\/(category|tag)\/[^/]+$/.test(pathname) || pathname === '/search') {
    const page = Number(url.searchParams.get('page'));
    if (Number.isSafeInteger(page) && page > 1) key.searchParams.set('page', String(page));
  }
  if (pathname === '/search' || pathname === '/api/search') {
    const q = (url.searchParams.get('q') ?? '').trim().slice(0, pathname === '/api/search' ? 80 : 100);
    if (q) key.searchParams.set('q', q);
    if (pathname === '/search') {
      const category = (url.searchParams.get('category') ?? '').trim().toLowerCase();
      if (category) key.searchParams.set('category', category);
      if (url.searchParams.get('sort') === 'oldest') key.searchParams.set('sort', 'oldest');
    }
  }
  key.searchParams.set('__ci_page_cache', `3:${contentEpoch(state)}`);
  return new Request(key, { method: 'GET' });
}
