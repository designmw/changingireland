import { beforeEach, describe, expect, it, vi } from 'vitest';
const { getUploads } = vi.hoisted(() => ({ getUploads: vi.fn() }));
vi.mock('~/lib/auth', () => ({ getUploads }));
import { GET } from '~/pages/files/[...path]';

const object = (key: string) => ({
  key,
  body: 'file bytes',
  size: 10,
  etag: 'test',
  uploaded: new Date('2026-01-01T00:00:00Z'),
  httpEtag: '"test"',
  writeHttpMetadata(headers: Headers) {
    headers.set('content-type', key.endsWith('.pdf') ? 'application/pdf' : 'image/webp');
  },
});
const get = vi.fn();
const head = vi.fn();
const request = (key: string, headers: Record<string, string> = {}, query = '') =>
  GET({
    params: { path: key },
    request: new Request(`https://changingireland.ie/files/${key}${query}`, { headers }),
  } as unknown as Parameters<typeof GET>[0]);
beforeEach(() => {
  get.mockReset();
  head.mockReset();
  head.mockImplementation(async (key: string) => {
    const meta = object(key);
    return {
      key: meta.key,
      size: meta.size,
      etag: meta.etag,
      httpEtag: meta.httpEtag,
      uploaded: meta.uploaded,
      writeHttpMetadata: meta.writeHttpMetadata,
    };
  });
  getUploads.mockResolvedValue({ get, head });
});
describe('public media delivery', () => {
  it('serves the WebP sibling for supported clients', async () => {
    get.mockResolvedValue(object('uploads/photo.jpg.webp'));
    const response = await request('uploads/photo.jpg', { Accept: 'image/webp' });
    expect(get).toHaveBeenCalledExactlyOnceWith('uploads/photo.jpg.webp');
    expect(response.headers.get('vary')).toBe('Accept');
  });
  it('uses the responsive sibling when available', async () => {
    get.mockResolvedValue(object('uploads/photo.jpg.w320.webp'));
    expect((await request('uploads/photo.jpg', {}, '?w=320')).status).toBe(200);
    expect(get).toHaveBeenCalledExactlyOnceWith('uploads/photo.jpg.w320.webp');
  });
  it('falls back when responsive and WebP siblings are missing', async () => {
    get.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce(object('uploads/photo.jpg'));
    expect((await request('uploads/photo.jpg', { Accept: 'image/webp' }, '?w=320')).status).toBe(200);
    expect(get).toHaveBeenCalledTimes(3);
  });
  it('returns 304 for a matching ETag', async () => {
    get.mockResolvedValue(object('magazines/issue.pdf'));
    const response = await request('magazines/issue.pdf', { 'If-None-Match': '"test"' });
    expect(response.status).toBe(304);
    expect(await response.text()).toBe('');
  });
  it('returns 404 for missing production media', async () => {
    get.mockResolvedValue(null);
    expect((await request('uploads/missing.jpg')).status).toBe(404);
  });
  it('honours PDF range requests instead of sending the entire file', async () => {
    get.mockResolvedValue(object('magazines/issue.pdf'));
    const response = await request('magazines/issue.pdf', { Range: 'bytes=0-3' });
    expect(response.status).toBe(206);
    expect(response.headers.get('content-range')).toBe('bytes 0-3/10');
    expect(get).toHaveBeenCalledWith('magazines/issue.pdf', {
      range: { offset: 0, length: 4 },
      onlyIf: { etagMatches: 'test' },
    });
  });
});

describe('range and revalidation edge cases', () => {
  it('reads metadata only for HEAD and 304 responses', async () => {
    const response = await GET({
      params: { path: 'magazines/issue.pdf' },
      request: new Request('https://changingireland.ie/files/magazines/issue.pdf', { method: 'HEAD' }),
    } as unknown as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-length')).toBe('10');
    expect(await response.text()).toBe('');
    expect(get).not.toHaveBeenCalled();
    expect((await request('magazines/issue.pdf', { 'If-None-Match': 'W/"test", "other"' })).status).toBe(304);
    expect(get).not.toHaveBeenCalled();
  });
  it('returns 416 without reading a body for unsatisfiable ranges', async () => {
    const response = await request('magazines/issue.pdf', { Range: 'bytes=99-' });
    expect(response.status).toBe(416);
    expect(response.headers.get('content-range')).toBe('bytes */10');
    expect(get).not.toHaveBeenCalled();
  });
  it('supports suffix ranges and ignores stale If-Range validators', async () => {
    get.mockImplementation(async (key, options) => ({ ...object(key), body: options.range ? 'tes' : 'file bytes' }));
    const partial = await request('magazines/issue.pdf', { Range: 'bytes=-3' });
    expect(partial.status).toBe(206);
    expect(partial.headers.get('content-range')).toBe('bytes 7-9/10');
    expect(await partial.text()).toBe('tes');
    const full = await request('magazines/issue.pdf', { Range: 'bytes=0-3', 'If-Range': '"old"' });
    expect(full.status).toBe(200);
    expect(await full.text()).toBe('file bytes');
  });
  it('does not mix responsive widths or formats in the edge cache', async () => {
    const entries = new Map<string, Response>();
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
    try {
      get.mockImplementation(async (key) => object(key));
      const first = await request('uploads/photo.jpg', { Accept: 'image/webp' }, '?w=320');
      expect(first.headers.get('x-media-cache')).toBe('miss');
      const second = await request('uploads/photo.jpg', { Accept: 'image/webp' }, '?w=320&utm_source=test');
      expect(second.headers.get('x-media-cache')).toBe('hit');
      expect(get).toHaveBeenCalledTimes(1);
      await request('uploads/photo.jpg', { Accept: 'image/webp' }, '?w=720');
      await request('uploads/photo.jpg');
      expect(get).toHaveBeenCalledTimes(3);
      expect(entries.size).toBe(3);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
