import { describe, expect, it } from 'vitest';
import { dedupeCandidates, listRecentUploads, parseUploadKey, type ListableBucket } from './upload-library';

const T0 = new Date('2026-01-01T00:00:00Z');

describe('parseUploadKey', () => {
  it('turns a timestamped admin upload into a picker item', () => {
    const item = parseUploadKey('uploads/editor/2026/08/1786105695991-test-upload.png', T0);
    expect(item).toMatchObject({
      url: '/files/uploads/editor/2026/08/1786105695991-test-upload.png',
      name: 'test-upload.png',
      uploaded: '2026-08-07T12:28:15.991Z',
      stamp: 1786105695991,
      sizeWidth: 0,
    });
  });

  it('dates an archive original by its folder month', () => {
    const item = parseUploadKey('uploads/2021/12/Protesters-outside-the-Dail.jpg', T0);
    expect(item).toMatchObject({
      url: '/files/uploads/2021/12/Protesters-outside-the-Dail.jpg',
      name: 'Protesters-outside-the-Dail.jpg',
      uploaded: '2021-12-01T00:00:00.000Z',
    });
  });

  it('addresses an archive WebP sibling by the original URL', () => {
    const item = parseUploadKey('uploads/2020/08/cover.jpg.webp', T0);
    expect(item?.url).toBe('/files/uploads/2020/08/cover.jpg');
    expect(item?.name).toBe('cover.jpg');
    expect(item?.base).toBe('/files/uploads/2020/08/cover.jpg');
  });

  it('recognises WordPress size variants and groups them under the original', () => {
    const item = parseUploadKey('uploads/2020/08/cover-300x200.jpg', T0);
    expect(item?.sizeWidth).toBe(300);
    expect(item?.base).toBe('/files/uploads/2020/08/cover.jpg');
    const sibling = parseUploadKey('uploads/2020/08/cover-1024x683.jpg.webp', T0);
    expect(sibling?.sizeWidth).toBe(1024);
    expect(sibling?.base).toBe('/files/uploads/2020/08/cover.jpg');
  });

  it('skips the responsive .wNNN.webp variants', () => {
    expect(parseUploadKey('uploads/editor/2026/08/1786105695991-photo.webp.w320.webp', T0)).toBeNull();
    expect(parseUploadKey('uploads/2020/08/cover.jpg.w1280.webp', T0)).toBeNull();
  });

  it('skips non-image objects', () => {
    expect(parseUploadKey('uploads/2019/03/issue-64.pdf', T0)).toBeNull();
    expect(parseUploadKey('uploads/2019/03/clip.mp4', T0)).toBeNull();
  });

  it('accepts every image type the site serves, case-insensitively', () => {
    for (const ext of ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'PNG', 'JPG']) {
      expect(parseUploadKey(`uploads/2024/01/a.${ext}`, T0)).not.toBeNull();
    }
  });

  it('falls back to the R2 upload time when there is no month folder', () => {
    const item = parseUploadKey('uploads/loose.jpg', T0);
    expect(item?.uploaded).toBe(T0.toISOString());
  });
});

const cand = (key: string) => parseUploadKey(key, T0)!;

describe('dedupeCandidates', () => {
  it('lists an original once even when its WebP sibling is also present', () => {
    const items = dedupeCandidates([cand('uploads/2020/08/a.jpg'), cand('uploads/2020/08/a.jpg.webp')]);
    expect(items.map((i) => i.url)).toEqual(['/files/uploads/2020/08/a.jpg']);
  });

  it('hides size variants when the original exists, whichever order they arrive in', () => {
    const items = dedupeCandidates([
      cand('uploads/2020/08/a-150x150.jpg'),
      cand('uploads/2020/08/a-1024x683.jpg.webp'),
      cand('uploads/2020/08/a.jpg.webp'),
      cand('uploads/2020/08/a-300x200.jpg'),
    ]);
    expect(items.map((i) => i.url)).toEqual(['/files/uploads/2020/08/a.jpg']);
  });

  it('keeps the widest size variant when the original was never mirrored', () => {
    const items = dedupeCandidates([
      cand('uploads/2020/08/b-300x200.jpg'),
      cand('uploads/2020/08/b-1024x683.jpg'),
      cand('uploads/2020/08/b-768x512.jpg'),
    ]);
    expect(items.map((i) => i.url)).toEqual(['/files/uploads/2020/08/b-1024x683.jpg']);
  });

  it('keeps different pictures apart', () => {
    const items = dedupeCandidates([cand('uploads/2020/08/a.jpg'), cand('uploads/2020/08/b.jpg')]);
    expect(items).toHaveLength(2);
  });
});

function fakeBucket(pages: string[][]): ListableBucket & { calls: Array<{ cursor?: string }> } {
  const calls: Array<{ cursor?: string }> = [];
  return {
    calls,
    async list({ cursor }) {
      calls.push({ cursor });
      const index = cursor ? Number(cursor) : 0;
      const objects = (pages[index] ?? []).map((key) => ({ key, uploaded: T0 }));
      const truncated = index < pages.length - 1;
      return { objects, truncated, cursor: truncated ? String(index + 1) : undefined };
    },
  };
}

describe('listRecentUploads', () => {
  it('mixes admin uploads and the archive, newest first, one entry per picture', async () => {
    const bucket = fakeBucket([
      [
        'uploads/2020/08/cover.jpg.webp',
        'uploads/2020/08/cover-300x200.jpg.webp',
        'uploads/2025/12/Terry-Hyland.avif',
        'uploads/editor/2026/08/1786105695991-photo.webp',
        'uploads/editor/2026/08/1786105695991-photo.webp.w320.webp',
        'uploads/2019/03/issue-64.pdf',
      ],
    ]);
    const items = await listRecentUploads(bucket);
    expect(items.map((i) => i.url)).toEqual([
      '/files/uploads/editor/2026/08/1786105695991-photo.webp',
      '/files/uploads/2025/12/Terry-Hyland.avif',
      '/files/uploads/2020/08/cover.jpg',
    ]);
    expect(Object.keys(items[0])).toEqual(['url', 'name', 'uploaded']);
  });

  it('orders pictures from the same month by name so the list is stable', async () => {
    const items = await listRecentUploads(
      fakeBucket([['uploads/2020/08/zebra.jpg', 'uploads/2020/08/apple.jpg', 'uploads/2020/08/mango.jpg']])
    );
    expect(items.map((i) => i.name)).toEqual(['apple.jpg', 'mango.jpg', 'zebra.jpg']);
  });

  it('walks every page of a truncated listing', async () => {
    const bucket = fakeBucket([['uploads/2024/01/a.png'], ['uploads/2024/02/b.png'], ['uploads/2024/03/c.png']]);
    const items = await listRecentUploads(bucket);
    expect(items.map((i) => i.name)).toEqual(['c.png', 'b.png', 'a.png']);
    expect(bucket.calls.map((c) => c.cursor)).toEqual([undefined, '1', '2']);
  });

  it('caps the result at max after sorting, so the newest survive', async () => {
    const keys = Array.from({ length: 10 }, (_, i) => `uploads/editor/2026/01/${1000000000000 + i}-img${i}.png`);
    const items = await listRecentUploads(fakeBucket([keys]), { max: 3 });
    expect(items.map((i) => i.name)).toEqual(['img9.png', 'img8.png', 'img7.png']);
  });

  it('lists the whole uploads tree by default', async () => {
    const seen: string[] = [];
    const bucket: ListableBucket = {
      async list({ prefix }) {
        seen.push(prefix);
        return { objects: [], truncated: false };
      },
    };
    await listRecentUploads(bucket);
    expect(seen).toEqual(['uploads/']);
  });

  it('returns an empty list for an empty bucket', async () => {
    expect(await listRecentUploads(fakeBucket([[]]))).toEqual([]);
  });
});
