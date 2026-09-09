import { describe, expect, it } from 'vitest';
import { listRecentUploads, parseUploadKey, type ListableBucket } from './upload-library';

const T0 = new Date('2026-01-01T00:00:00Z');

describe('parseUploadKey', () => {
  it('turns a timestamped editor upload into a picker item', () => {
    const item = parseUploadKey('uploads/editor/2026/08/1786105695991-test-upload.png', T0);
    expect(item).toEqual({
      url: '/files/uploads/editor/2026/08/1786105695991-test-upload.png',
      name: 'test-upload.png',
      uploaded: '2026-08-07T12:28:15.991Z',
      stamp: 1786105695991,
    });
  });

  it('skips the responsive .wNNN.webp siblings', () => {
    expect(parseUploadKey('uploads/editor/2026/08/1786105695991-photo.webp.w320.webp', T0)).toBeNull();
    expect(parseUploadKey('uploads/editor/2026/08/1786105695991-photo.png.w1280.webp', T0)).toBeNull();
  });

  it('skips non-image objects', () => {
    expect(parseUploadKey('uploads/editor/2026/08/1786105695991-notes.pdf', T0)).toBeNull();
    expect(parseUploadKey('uploads/editor/2026/08/1786105695991-photo', T0)).toBeNull();
  });

  it('accepts every image type the uploader allows, case-insensitively', () => {
    for (const ext of ['png', 'jpg', 'jpeg', 'webp', 'gif', 'PNG', 'JPG']) {
      expect(parseUploadKey(`uploads/editor/2026/08/1786105695991-a.${ext}`, T0)).not.toBeNull();
    }
  });

  it('falls back to the R2 upload time when the filename has no timestamp', () => {
    const item = parseUploadKey('uploads/editor/2026/08/hand-copied.jpg', T0);
    expect(item?.name).toBe('hand-copied.jpg');
    expect(item?.stamp).toBe(T0.getTime());
    expect(item?.uploaded).toBe(T0.toISOString());
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
  it('returns primary images newest first without the stamp field', async () => {
    const bucket = fakeBucket([
      [
        'uploads/editor/2026/05/1000000000000-old.webp',
        'uploads/editor/2026/05/1000000000000-old.webp.w320.webp',
        'uploads/editor/2026/08/3000000000000-newest.webp',
        'uploads/editor/2026/07/2000000000000-middle.jpg',
      ],
    ]);
    const items = await listRecentUploads(bucket);
    expect(items.map((i) => i.name)).toEqual(['newest.webp', 'middle.jpg', 'old.webp']);
    expect(Object.keys(items[0])).toEqual(['url', 'name', 'uploaded']);
  });

  it('walks every page of a truncated listing', async () => {
    const bucket = fakeBucket([
      ['uploads/editor/2026/01/1000000000001-a.png'],
      ['uploads/editor/2026/01/1000000000002-b.png'],
      ['uploads/editor/2026/01/1000000000003-c.png'],
    ]);
    const items = await listRecentUploads(bucket);
    expect(items.map((i) => i.name)).toEqual(['c.png', 'b.png', 'a.png']);
    expect(bucket.calls.map((c) => c.cursor)).toEqual([undefined, '1', '2']);
  });

  it('caps the result at max after sorting, so the newest survive', async () => {
    const keys = Array.from({ length: 10 }, (_, i) => `uploads/editor/2026/01/${1000000000000 + i}-img${i}.png`);
    const items = await listRecentUploads(fakeBucket([keys]), { max: 3 });
    expect(items.map((i) => i.name)).toEqual(['img9.png', 'img8.png', 'img7.png']);
  });

  it('lists under the editor upload prefix by default', async () => {
    const seen: string[] = [];
    const bucket: ListableBucket = {
      async list({ prefix }) {
        seen.push(prefix);
        return { objects: [], truncated: false };
      },
    };
    await listRecentUploads(bucket);
    expect(seen).toEqual(['uploads/editor/']);
  });

  it('returns an empty list for an empty bucket', async () => {
    expect(await listRecentUploads(fakeBucket([[]]))).toEqual([]);
  });
});
