export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb, getSessionId, destroySession, clearSessionCookies } from '~/lib/auth';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const sessionId = getSessionId(cookies);
  if (sessionId) {
    try {
      const db = await getDb();
      if (db) await destroySession(db, sessionId);
    } catch {
      // session table missing — nothing to destroy
    }
  }
  clearSessionCookies(cookies);
  return redirect('/', 302);
};
