import { beforeEach, describe, expect, it, vi } from 'vitest';

// vi.mock is hoisted above the imports, so the mocks it references must be
// created with vi.hoisted or they don't exist yet when the factory runs.
const { isEditor, getUploads } = vi.hoisted(() => ({
  isEditor: vi.fn<() => Promise<boolean>>(),
  getUploads: vi.fn<() => Promise<unknown>>(),
}));
vi.mock('~/lib/admin', () => ({ isEditor }));
vi.mock('~/lib/auth', () => ({ getUploads }));

import { GET } from '~/pages/api/admin/uploads';

// The route only reads auth from the context, so a stub is enough.
const context = { locals: {} } as unknown as Parameters<typeof GET>[0];

const bucket = {
  async list() {
    return {
      objects: [
        { key: 'uploads/editor/2026/08/1786105695991-photo.webp', uploaded: new Date() },
        { key: 'uploads/editor/2026/08/1786105695991-photo.webp.w320.webp', uploaded: new Date() },
      ],
      truncated: false,
    };
  },
};

beforeEach(() => {
  isEditor.mockReset();
  getUploads.mockReset();
});

describe('GET /api/admin/uploads', () => {
  it('refuses anyone who is not an editor', async () => {
    isEditor.mockResolvedValue(false);
    const res = await GET(context);
    expect(res.status).toBe(403);
    expect(getUploads).not.toHaveBeenCalled();
  });

  it('reports storage unavailable when the R2 binding is missing', async () => {
    isEditor.mockResolvedValue(true);
    getUploads.mockResolvedValue(undefined);
    const res = await GET(context);
    expect(res.status).toBe(503);
  });

  it('returns the image list as private, uncached JSON', async () => {
    isEditor.mockResolvedValue(true);
    getUploads.mockResolvedValue(bucket);
    const res = await GET(context);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/json');
    expect(res.headers.get('cache-control')).toBe('private, no-store');
    const json = (await res.json()) as { images: Array<{ url: string; name: string }> };
    expect(json.images).toEqual([
      {
        url: '/files/uploads/editor/2026/08/1786105695991-photo.webp',
        name: 'photo.webp',
        uploaded: '2026-08-07T12:28:15.991Z',
      },
    ]);
  });
});
