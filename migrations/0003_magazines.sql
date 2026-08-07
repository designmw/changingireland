-- Migration number: 0003 	 magazines
--
-- The PDF back-issue archive shown at /magazines. Files live in the UPLOADS
-- R2 bucket; this table holds the metadata and display order.
--   issue      — issue number (92, 91, …); UNIQUE so the back-issue import is
--                re-runnable
--   title      — display title/season, e.g. "Issue 92 – Spring 2026"
--   cover_key  — R2 object key of the cover image
--   pdf_key    — R2 object key of the PDF
--   sort_order — descending sort on /magazines (newest first); defaults to
--                the issue number

CREATE TABLE IF NOT EXISTS magazines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issue INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  cover_key TEXT NOT NULL DEFAULT '',
  pdf_key TEXT NOT NULL DEFAULT '',
  published_date TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_magazines_sort ON magazines(sort_order DESC, issue DESC);
