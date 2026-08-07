-- Migration number: 0004 	 featured posts, site settings, ads, magazine descriptions
--
-- posts.featured    — editors tick "Featured" in /admin; featured posts front
--                     the homepage hero instead of straight latest-first
-- settings          — small key/value store (JSON values) for site options the
--                     admin dashboard can edit, e.g. homepage_categories
-- ads               — image ads with a click-through link, uploaded in /admin
--                     and shown in the homepage ad slots (like the two ad
--                     banners on the WordPress site)
-- magazines.description — per-issue contents blurb shown on /magazines

ALTER TABLE posts ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured, published, published_at DESC);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL DEFAULT '',
  image_key TEXT NOT NULL DEFAULT '',
  link_url TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

ALTER TABLE magazines ADD COLUMN description TEXT NOT NULL DEFAULT '';
