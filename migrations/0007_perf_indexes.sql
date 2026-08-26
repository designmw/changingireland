-- Migration number: 0007 	 performance: index-usable ordering + normalized taxonomy
--
-- Why: on the Workers Free plan D1 was reading ~90M rows/day (18x the 5M free
-- limit) because every public page render ran several whole-table scans:
--   * ORDER BY COALESCE(published_at, created_at) could not use any index, so
--     even a LIMIT 12 listing loaded ALL ~1k published rows into a temp b-tree.
--   * LIVE_WHERE wrapped the column in datetime(), and the category/tag filters
--     matched the JSON columns with LIKE — neither is sargable, both full-scan.
--   * Header.astro runs a taxonomy scan on EVERY page.
--
-- This migration is additive and safe to run against a live DB: existing code
-- ignores the new column/table, and the triggers keep them in step going
-- forward. Re-runnable (IF NOT EXISTS / DROP TRIGGER IF EXISTS).

--------------------------------------------------------------------------------
-- 1. sort_at: a single, format-normalized instant to order and range-filter on.
--    strftime() collapses the two stored shapes (ISO-with-T from the admin,
--    space-separated from the WP import) and NULL published_at (a live post,
--    ordered by created_at) into one lexicographically-sortable UTC string.
--------------------------------------------------------------------------------
ALTER TABLE posts ADD COLUMN sort_at TEXT;

UPDATE posts
   SET sort_at = strftime('%Y-%m-%dT%H:%M:%SZ', COALESCE(published_at, created_at));

-- The hot-path index: WHERE published = 1 AND sort_at <= now ORDER BY sort_at DESC.
-- A published post with a future published_at has sort_at in the future, so the
-- same `sort_at <= now` bound both hides scheduled posts and orders the archive.
CREATE INDEX IF NOT EXISTS idx_posts_live ON posts(published, sort_at DESC);

-- Keep sort_at maintained. The triggers only touch sort_at, and the UPDATE
-- trigger fires only OF published_at/created_at, so neither can recurse.
DROP TRIGGER IF EXISTS posts_sort_at_ai;
CREATE TRIGGER posts_sort_at_ai AFTER INSERT ON posts
BEGIN
  UPDATE posts
     SET sort_at = strftime('%Y-%m-%dT%H:%M:%SZ', COALESCE(NEW.published_at, NEW.created_at))
   WHERE id = NEW.id;
END;

DROP TRIGGER IF EXISTS posts_sort_at_au;
CREATE TRIGGER posts_sort_at_au AFTER UPDATE OF published_at, created_at ON posts
BEGIN
  UPDATE posts
     SET sort_at = strftime('%Y-%m-%dT%H:%M:%SZ', COALESCE(NEW.published_at, NEW.created_at))
   WHERE id = NEW.id;
END;

--------------------------------------------------------------------------------
-- 2. post_taxonomies: the categories/tags JSON columns, exploded into indexed
--    rows so /category/[slug], /tag/[slug], related-posts and the counts can do
--    an index lookup instead of a LIKE scan of every row.
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_taxonomies (
  post_id INTEGER NOT NULL,
  kind    TEXT NOT NULL,            -- 'categories' | 'tags' (matches the column name)
  slug    TEXT NOT NULL,
  title   TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (post_id, kind, slug)
) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS idx_ptax_lookup ON post_taxonomies(kind, slug, post_id);

-- Backfill from the JSON columns.
DELETE FROM post_taxonomies;
INSERT OR IGNORE INTO post_taxonomies (post_id, kind, slug, title)
  SELECT p.id, 'categories', je.value ->> 'slug', COALESCE(je.value ->> 'title', '')
    FROM posts p, json_each(p.categories) je
   WHERE json_valid(p.categories) AND je.value ->> 'slug' IS NOT NULL;
INSERT OR IGNORE INTO post_taxonomies (post_id, kind, slug, title)
  SELECT p.id, 'tags', je.value ->> 'slug', COALESCE(je.value ->> 'title', '')
    FROM posts p, json_each(p.tags) je
   WHERE json_valid(p.tags) AND je.value ->> 'slug' IS NOT NULL;

-- Keep it maintained on every write.
DROP TRIGGER IF EXISTS ptax_ai;
CREATE TRIGGER ptax_ai AFTER INSERT ON posts
BEGIN
  INSERT OR IGNORE INTO post_taxonomies (post_id, kind, slug, title)
    SELECT NEW.id, 'categories', je.value ->> 'slug', COALESCE(je.value ->> 'title', '')
      FROM json_each(NEW.categories) je
     WHERE json_valid(NEW.categories) AND je.value ->> 'slug' IS NOT NULL;
  INSERT OR IGNORE INTO post_taxonomies (post_id, kind, slug, title)
    SELECT NEW.id, 'tags', je.value ->> 'slug', COALESCE(je.value ->> 'title', '')
      FROM json_each(NEW.tags) je
     WHERE json_valid(NEW.tags) AND je.value ->> 'slug' IS NOT NULL;
END;

DROP TRIGGER IF EXISTS ptax_au;
CREATE TRIGGER ptax_au AFTER UPDATE OF categories, tags ON posts
BEGIN
  DELETE FROM post_taxonomies WHERE post_id = NEW.id;
  INSERT OR IGNORE INTO post_taxonomies (post_id, kind, slug, title)
    SELECT NEW.id, 'categories', je.value ->> 'slug', COALESCE(je.value ->> 'title', '')
      FROM json_each(NEW.categories) je
     WHERE json_valid(NEW.categories) AND je.value ->> 'slug' IS NOT NULL;
  INSERT OR IGNORE INTO post_taxonomies (post_id, kind, slug, title)
    SELECT NEW.id, 'tags', je.value ->> 'slug', COALESCE(je.value ->> 'title', '')
      FROM json_each(NEW.tags) je
     WHERE json_valid(NEW.tags) AND je.value ->> 'slug' IS NOT NULL;
END;

DROP TRIGGER IF EXISTS ptax_ad;
CREATE TRIGGER ptax_ad AFTER DELETE ON posts
BEGIN
  DELETE FROM post_taxonomies WHERE post_id = OLD.id;
END;
