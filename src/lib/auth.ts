import type { AstroCookies } from 'astro';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export const displayName = (u: User) => `${u.first_name} ${u.last_name}`.trim();

/**
 * The D1 binding, resolved lazily so this module can also be loaded during
 * prerendering in Node (where the `cloudflare:workers` scheme doesn't exist).
 * Returns undefined outside the Workers runtime.
 */
export async function getDb(): Promise<D1Database | undefined> {
  // Import via a variable specifier (same pattern as api/contact.ts) so Vite
  // never tries to resolve the Workers-only module in Node.
  const spec = 'cloudflare:workers';
  const cfMod = await import(/* @vite-ignore */ spec).catch(() => ({}) as Record<string, unknown>);
  const env = (cfMod as { env?: unknown }).env as { DB?: D1Database } | undefined;
  return env?.DB;
}

/** The R2 bucket for magazine PDFs, covers, and post images. */
export async function getUploads(): Promise<R2Bucket | undefined> {
  const spec = 'cloudflare:workers';
  const cfMod = await import(/* @vite-ignore */ spec).catch(() => ({}) as Record<string, unknown>);
  const env = (cfMod as { env?: unknown }).env as { UPLOADS?: R2Bucket } | undefined;
  return env?.UPLOADS;
}

const SESSION_COOKIE = 'ci_session';
const NAME_COOKIE = 'ci_name';
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 100_000;

// ---------- password hashing (PBKDF2-SHA256, WebCrypto — Workers-compatible) ----------

const toHex = (buf: ArrayBuffer | Uint8Array) =>
  [...new Uint8Array(buf as ArrayBuffer)].map((b) => b.toString(16).padStart(2, '0')).join('');

const fromHex = (hex: string) => new Uint8Array(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations },
    key,
    256
  );
  return toHex(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterStr, saltHex, expected] = stored.split('$');
  if (scheme !== 'pbkdf2') return false;
  const actual = await pbkdf2(password, fromHex(saltHex), Number(iterStr));
  // constant-time compare
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

// ---------- sessions ----------

export async function createSession(db: D1Database, userId: number): Promise<string> {
  const id = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const expiresAt = Date.now() + SESSION_DAYS * 86_400_000;
  await db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(id, userId, expiresAt).run();
  return id;
}

export async function getSessionUser(db: D1Database, sessionId: string): Promise<User | null> {
  const row = await db
    .prepare(
      'SELECT u.id, u.email, u.username, u.first_name, u.last_name, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ?'
    )
    .bind(sessionId)
    .first<User & { expires_at: number }>();
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    return null;
  }
  return { id: row.id, email: row.email, username: row.username, first_name: row.first_name, last_name: row.last_name };
}

export async function destroySession(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
}

// ---------- cookies ----------

export function setSessionCookies(cookies: AstroCookies, sessionId: string, displayName: string) {
  const maxAge = SESSION_DAYS * 86_400;
  cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
  // Non-HttpOnly display cookie: lets static pages personalise the UI client-side.
  cookies.set(NAME_COOKIE, encodeURIComponent(displayName), {
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export function clearSessionCookies(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE, { path: '/' });
  cookies.delete(NAME_COOKIE, { path: '/' });
}

export function getSessionId(cookies: AstroCookies): string | undefined {
  return cookies.get(SESSION_COOKIE)?.value;
}
