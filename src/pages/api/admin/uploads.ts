export const prerender = false;

import type { APIRoute } from 'astro';
import { isEditor } from '~/lib/admin';
import { getUploads } from '~/lib/auth';
import { listRecentUploads } from '~/lib/upload-library';

/**
 * Recent admin image uploads, for the featured-image picker on the article
 * editor: `{ images: [{ url, name, uploaded }] }`, newest first. Editor-gated,
 * like the upload route itself. See src/lib/upload-library.ts.
 */
export const GET: APIRoute = async (context) => {
  if (!(await isEditor(context))) {
    return new Response(JSON.stringify({ error: 'Not allowed' }), { status: 403 });
  }
  const uploads = await getUploads();
  if (!uploads) return new Response(JSON.stringify({ error: 'Storage unavailable' }), { status: 503 });

  const images = await listRecentUploads(uploads);
  return new Response(JSON.stringify({ images }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' },
  });
};
