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
  /** Intrinsic size of the uploaded image; 0 when unknown (see migration 0005). */
  image_width: number;
  image_height: number;
  /** 'full' spans the slot; 'half' pairs up with the next 'half' ad. */
  width: AdWidth;
}

export type AdWidth = 'full' | 'half';

/** Narrow an arbitrary stored string to a known width, defaulting to full. */
export const asAdWidth = (value: string | undefined | null): AdWidth => (value === 'half' ? 'half' : 'full');

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
  /** Measured in the browser at upload time; 0 leaves the stored value alone. */
  imageWidth: number;
  imageHeight: number;
  width: AdWidth;
}

export async function createAd(db: D1Database, a: AdInput): Promise<number> {
  const res = await db
    .prepare(
      'INSERT INTO ads (label, image_key, link_url, active, sort_order, image_width, image_height, width) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .bind(a.label, a.imageKey, a.linkUrl, a.active ? 1 : 0, a.sortOrder, a.imageWidth, a.imageHeight, a.width)
    .run();
  return Number(res.meta.last_row_id);
}

export async function updateAd(db: D1Database, id: number, a: AdInput): Promise<void> {
  // A save that didn't replace the image reports 0x0 — COALESCE-style guard so
  // it keeps whatever dimensions are already stored rather than zeroing them.
  await db
    .prepare(
      `UPDATE ads
          SET label = ?, image_key = ?, link_url = ?, active = ?, sort_order = ?, width = ?,
              image_width = CASE WHEN ? > 0 THEN ? ELSE image_width END,
              image_height = CASE WHEN ? > 0 THEN ? ELSE image_height END
        WHERE id = ?`
    )
    .bind(
      a.label,
      a.imageKey,
      a.linkUrl,
      a.active ? 1 : 0,
      a.sortOrder,
      a.width,
      a.imageWidth,
      a.imageWidth,
      a.imageHeight,
      a.imageHeight,
      id
    )
    .run();
}

export async function deleteAd(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM ads WHERE id = ?').bind(id).run();
}

/**
 * Group ordered ads into slots for rendering: a 'full' ad occupies a slot on
 * its own, and two consecutive 'half' ads share one. A trailing unpaired
 * 'half' still gets its own slot (rendered at half width) rather than being
 * dropped — an editor mid-way through setting up a pair should still see it.
 */
export function groupAdsIntoSlots(ads: AdRow[]): AdRow[][] {
  const slots: AdRow[][] = [];
  for (let i = 0; i < ads.length; i++) {
    if (ads[i].width === 'half' && ads[i + 1]?.width === 'half') {
      slots.push([ads[i], ads[i + 1]]);
      i++;
    } else {
      slots.push([ads[i]]);
    }
  }
  return slots;
}
