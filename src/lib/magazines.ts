/**
 * Magazine back-issues stored in D1, with the files (PDF + cover) in the
 * UPLOADS R2 bucket. See migrations/0003_magazines.sql.
 */

export interface MagazineRow {
  id: number;
  issue: number;
  title: string;
  cover_key: string;
  pdf_key: string;
  description: string;
  published_date: string;
  sort_order: number;
  created_at: string;
}

export async function getAllMagazines(db: D1Database): Promise<MagazineRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM magazines ORDER BY sort_order DESC, issue DESC')
    .all<MagazineRow>();
  return results ?? [];
}

export async function getMagazineById(db: D1Database, id: number): Promise<MagazineRow | null> {
  return await db.prepare('SELECT * FROM magazines WHERE id = ?').bind(id).first<MagazineRow>();
}

export interface MagazineInput {
  issue: number;
  title: string;
  coverKey: string;
  pdfKey: string;
  description?: string;
  publishedDate: string;
  sortOrder?: number;
}

export async function createMagazine(db: D1Database, m: MagazineInput): Promise<number> {
  const res = await db
    .prepare(
      `INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(issue) DO UPDATE SET
         title = excluded.title,
         cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
         pdf_key = CASE WHEN excluded.pdf_key != '' THEN excluded.pdf_key ELSE magazines.pdf_key END,
         description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
         published_date = excluded.published_date,
         sort_order = excluded.sort_order`
    )
    .bind(m.issue, m.title, m.coverKey, m.pdfKey, m.description ?? '', m.publishedDate, m.sortOrder ?? m.issue)
    .run();
  return Number(res.meta.last_row_id);
}

export async function updateMagazine(db: D1Database, id: number, m: MagazineInput): Promise<void> {
  await db
    .prepare(
      `UPDATE magazines SET issue = ?, title = ?, cover_key = ?, pdf_key = ?, description = ?, published_date = ?, sort_order = ?
        WHERE id = ?`
    )
    .bind(m.issue, m.title, m.coverKey, m.pdfKey, m.description ?? '', m.publishedDate, m.sortOrder ?? m.issue, id)
    .run();
}

export async function deleteMagazine(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM magazines WHERE id = ?').bind(id).run();
}
