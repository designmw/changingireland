-- Ad image dimensions, so the homepage can reserve the right box before the
-- image loads.
--
-- AdSlot rendered <img class="w-full h-auto" loading="lazy"> with no width or
-- height, and the ads table had nowhere to store them — so the two banners sat
-- mid-page at zero height until they downloaded, then shoved everything below
-- them down. That is a Cumulative Layout Shift hit on the most-visited page.
--
-- 0 means "not known yet" (every row that predates this migration): AdSlot
-- falls back to its old behaviour for those, and the value fills in the next
-- time someone saves that ad in /admin/ads.
ALTER TABLE ads ADD COLUMN image_width INTEGER NOT NULL DEFAULT 0;
ALTER TABLE ads ADD COLUMN image_height INTEGER NOT NULL DEFAULT 0;
