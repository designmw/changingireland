/**
 * Tiny key/value settings store (D1 `settings` table, JSON values) for the
 * site options the admin dashboard edits — e.g. which category blocks the
 * homepage shows. See migrations/0004.
 */

export async function getSetting<T>(db: D1Database, key: string, fallback: T): Promise<T> {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<{ value: string }>();
  if (!row) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export async function setSetting(db: D1Database, key: string, value: unknown): Promise<void> {
  await db
    .prepare(
      `INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
    )
    .bind(key, JSON.stringify(value))
    .run();
}

/** Category slugs whose blocks appear on the homepage, in display order. */
export const HOMEPAGE_CATEGORIES_KEY = 'homepage_categories';
