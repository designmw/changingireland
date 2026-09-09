-- Global cache revision: committed atomically with content changes. Every
-- request reads this small row before reusing HTML; no per-colo purge race.
CREATE TABLE content_revision (id INTEGER PRIMARY KEY CHECK (id = 1), revision INTEGER NOT NULL);
INSERT INTO content_revision VALUES (1, 1);
CREATE TRIGGER posts_revision_ai AFTER INSERT ON posts BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER posts_revision_au AFTER UPDATE ON posts BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER posts_revision_ad AFTER DELETE ON posts BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;

-- Ordering within a taxonomy now comes from the same index as the filter.
-- This trades a little index space for bounded LIMIT queries on hot pages.
ALTER TABLE post_taxonomies ADD COLUMN published INTEGER NOT NULL DEFAULT 0;
ALTER TABLE post_taxonomies ADD COLUMN sort_at TEXT;
UPDATE post_taxonomies SET
  published = (SELECT published FROM posts WHERE id = post_id),
  sort_at = (SELECT sort_at FROM posts WHERE id = post_id);
CREATE INDEX idx_ptax_live ON post_taxonomies(kind, slug, published, sort_at DESC, post_id);
CREATE INDEX idx_posts_featured_live ON posts(featured, published, sort_at DESC);
CREATE INDEX idx_posts_sort ON posts(sort_at DESC);

-- Independent of trigger execution order: new taxonomy rows copy the current
-- post state; a later sort_at update refreshes them again if necessary.
CREATE TRIGGER ptax_visibility_ai AFTER INSERT ON post_taxonomies BEGIN
  UPDATE post_taxonomies SET
    published = (SELECT published FROM posts WHERE id = NEW.post_id),
    sort_at = (SELECT sort_at FROM posts WHERE id = NEW.post_id)
  WHERE post_id = NEW.post_id AND kind = NEW.kind AND slug = NEW.slug;
END;
CREATE TRIGGER posts_visibility_au AFTER UPDATE OF published, sort_at ON posts BEGIN
  UPDATE post_taxonomies SET published = NEW.published, sort_at = NEW.sort_at
  WHERE post_id = NEW.id;
END;

-- The UNIQUE COLLATE NOCASE constraint already supplies the slug index.
DROP INDEX IF EXISTS idx_posts_slug;
-- Cached derivatives from the previous format can be rebuilt lazily.
DELETE FROM settings WHERE key IN ('live_post_count', 'tax_counts_categories', 'tax_counts_tags');
CREATE TRIGGER magazines_revision_ai AFTER INSERT ON magazines BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER magazines_revision_au AFTER UPDATE ON magazines BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER magazines_revision_ad AFTER DELETE ON magazines BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER ads_revision_ai AFTER INSERT ON ads BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER ads_revision_au AFTER UPDATE ON ads BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER ads_revision_ad AFTER DELETE ON ads BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER settings_revision_ai AFTER INSERT ON settings WHEN NEW.key NOT LIKE 'cache:%' BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER settings_revision_au AFTER UPDATE ON settings WHEN NEW.key NOT LIKE 'cache:%' BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
CREATE TRIGGER settings_revision_ad AFTER DELETE ON settings WHEN OLD.key NOT LIKE 'cache:%' BEGIN
  UPDATE content_revision SET revision = revision + 1 WHERE id = 1;
END;
PRAGMA optimize;
