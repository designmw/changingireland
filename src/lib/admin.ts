/**
 * Admin gate for /admin.
 *
 * Same design as the iscphm site: admin is a role on a real user account, so
 * there is an audit trail of who published. There is no way to become an
 * admin through the UI. Promote (or create) by hand:
 *   npx wrangler d1 execute changingireland-db --remote \
 *     --command "UPDATE users SET role='admin' WHERE username='<name>'"
 */
import type { APIContext } from 'astro';
import { getDb } from '~/lib/auth';

async function roleOf(context: APIContext | { locals: App.Locals }): Promise<string | null> {
  const user = context.locals.user;
  if (!user) return null;
  const db = await getDb();
  if (!db) return null;
  const row = await db.prepare('SELECT role FROM users WHERE id = ?').bind(user.id).first<{ role: string }>();
  return row?.role ?? null;
}

export async function isAdmin(context: APIContext | { locals: App.Locals }): Promise<boolean> {
  // The dev auth bypass injects a user that has no row in the database, so a
  // role lookup would always fail locally. Treat it as admin — DEV only.
  if (import.meta.env.DEV) return true;
  return (await roleOf(context)) === 'admin';
}

/**
 * Contributors: admins plus 'editor' accounts (added in /admin/users). They
 * can write and publish articles; user management and site settings stay
 * admin-only.
 */
export async function isEditor(context: APIContext | { locals: App.Locals }): Promise<boolean> {
  if (import.meta.env.DEV) return true;
  const role = await roleOf(context);
  return role === 'admin' || role === 'editor';
}

/**
 * Redirect target for a non-admin hitting an admin route: unauthenticated users
 * go to login and come back; logged-in non-admins are sent home rather than
 * being told an admin area exists.
 */
export function adminRedirect(context: { locals: App.Locals; url: URL }): string {
  return context.locals.user ? '/' : `/login?redirect=${encodeURIComponent(context.url.pathname)}`;
}
