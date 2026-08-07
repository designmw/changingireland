/**
 * Image ads managed from /admin/ads: a picture in R2 plus a click-through
 * link, shown in the homepage ad slots (the WordPress site carries two such
 * banners). See migrations/0004.
 */

export interface AdRow {
  id: number;
  label: string;
  image_key: string;
  link_url: string;
  active: number;
  sort_order: number;
  created_at: string;
}

export async function getAllAds(db: D1Database): Promise<AdRow[]> {
  const { results } = await db.prepare('SELECT * FROM ads ORDER BY sort_order ASC, id ASC').all<AdRow>();
  return results ?? [];
}

export async function getActiveAds(db: D1Database, limit = 4): Promise<AdRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM ads WHERE active = 1 ORDER BY sort_order ASC, id ASC LIMIT ?')
    .bind(limit)
    .all<AdRow>();
  return results ?? [];
}

export async function getAdById(db: D1Database, id: number): Promise<AdRow | null> {
  return await db.prepare('SELECT * FROM ads WHERE id = ?').bind(id).first<AdRow>();
}

export interface AdInput {
  label: string;
  imageKey: string;
  linkUrl: string;
  active: boolean;
  sortOrder: number;
}

export async function createAd(db: D1Database, a: AdInput): Promise<number> {
  const res = await db
    .prepare('INSERT INTO ads (label, image_key, link_url, active, sort_order) VALUES (?, ?, ?, ?, ?)')
    .bind(a.label, a.imageKey, a.linkUrl, a.active ? 1 : 0, a.sortOrder)
    .run();
  return Number(res.meta.last_row_id);
}

export async function updateAd(db: D1Database, id: number, a: AdInput): Promise<void> {
  await db
    .prepare('UPDATE ads SET label = ?, image_key = ?, link_url = ?, active = ?, sort_order = ? WHERE id = ?')
    .bind(a.label, a.imageKey, a.linkUrl, a.active ? 1 : 0, a.sortOrder, id)
    .run();
}

export async function deleteAd(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM ads WHERE id = ?').bind(id).run();
}
