-- Migration number: 0002 	 posts
--
-- The iscphm posts table, extended for a real magazine archive imported from
-- WordPress:
--   categories / tags — JSON arrays of {slug, title}, mirroring WP taxonomies
--                       (a post can be in several categories, and the site
--                       needs /category/[slug] and /tag/[slug] archives)
--   author            — display name (the WP /users endpoint is 401, names
--                       come from ?_embed on each post)
--   wp_id             — original WordPress post ID; UNIQUE so the import
--                       script is idempotent and re-runnable
--   image_alt         — alt text carried over from the WP featured image
-- NULL wp_id means the post was written in /admin after the migration.

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  image_alt TEXT NOT NULL DEFAULT '',
  categories TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  author TEXT NOT NULL DEFAULT '',
  wp_id INTEGER UNIQUE,
  published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  published_at TEXT DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, published_at DESC);
