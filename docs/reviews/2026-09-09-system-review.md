# System review — 9 September 2026

Follow-up: the findings below have now been addressed in the local implementation. See the [implementation and verification report](/Users/dmw/Documents/websites/changingireland/docs/reviews/2026-09-09-implementation.md) for current status and deployment requirements.

The ordinary article persistence workflows pass. The highest-priority finding is a stored-script URL sanitisation bypass. Database storage is small; reducing repeated category queries offers substantially more value than compressing database content.

This review added 25 tests: the full suite now reports **50 passing tests and 6 expected failures**, across 7 files. Expected failures reproduce unresolved bugs; they are not fixes or skipped tests. Vitest will flag an unexpected pass when the underlying behaviour changes, at which point remove `.fails` and retain the regression test.

Production access was read-only: D1 aggregate queries and analytics, and R2 bucket metadata. Article writes/deletes ran against disposable in-memory SQLite databases using all seven real migrations. No production article, database schema, media object or deployment was changed.

## Findings, in priority order

1. **High — encoded JavaScript links survive article sanitisation.** `java&#x73;cript:alert(1)` survives in an anchor's `href`. The URL validator examines the encoded string; its `#` is mistaken for a relative-URL delimiter, while the browser decodes the entity into `javascript:`. An editor can submit this through raw HTML; clicking the saved link can execute script on the site's origin. The production CSP permits inline scripts, so it is not a reliable backstop. Decode HTML entities before URL validation or use a proven parser-based sanitiser, and cover numeric/named entities and mixed-case attributes. Reproduced in `tests/lib/sanitize.test.ts`. [URL validation](/Users/dmw/Documents/websites/changingireland/src/lib/sanitize.ts:166).

2. **Medium — an article can be saved at a reserved page address.** The duplicate-address check only queries posts. A new article titled “News” can receive `/news`, but Astro's existing news route takes precedence, so visitors see the archive instead of that article. Reserve static routes and deliberately handle collisions with imported information pages. Reproduced against `slugTaken` in `tests/lib/posts.test.ts`, with routing confirmed from the source. [Address check](/Users/dmw/Documents/websites/changingireland/src/lib/posts.ts:376).

3. **Medium — scheduled publication does not refresh archive totals.** Live counts and taxonomy counts have no expiry and refresh only on content writes. When a scheduled post becomes due, listing rows include it but pagination still uses the old total. At a page boundary this can hide the last page of articles until someone saves another article. Refresh at the next scheduled publication time, or introduce a bounded expiry. Reproduced by advancing SQLite's clock after scheduling. Production currently has **zero scheduled articles**, so this is a latent workflow bug. [Cached total](/Users/dmw/Documents/websites/changingireland/src/lib/posts.ts:314).

4. **Medium — deleting or unpublishing does not invalidate cached public pages.** Anonymous HTML is cached for 3,600 seconds, and article writes do not purge it. An already-cached article can remain public for up to an hour after deletion/unpublishing; cached listings also delay new publications. This is explicitly an existing cache policy, but it undermines immediate withdrawal. Add reliable invalidation for affected article and listing pages, with an explicit maximum delay for scheduled publication. Confirmed by source inspection; not exercised against production content. [Cache policy](/Users/dmw/Documents/websites/changingireland/src/middleware.ts:130), [Delete](/Users/dmw/Documents/websites/changingireland/src/lib/posts.ts:469).

5. **Medium — opening and saving imported content can change figure/caption structure.** RichEditor converts stored HTML into Quill's model and immediately rewrites the submitted textarea, even before the editor changes the article body. A `figure`/`figcaption` becomes ordinary editor content, losing its caption semantics and potentially its presentation. The reproduction demonstrates structure loss, not disappearance of all caption text. Preserve untouched original HTML or support the imported structures explicitly. Reproduced using the real Quill conversion in `tests/lib/editor-roundtrip.test.ts`. [Editor initialisation](/Users/dmw/Documents/websites/changingireland/src/components/RichEditor.astro:452).

6. **Medium — the admin list loads the complete article database on every page.** Despite showing 25 rows, it runs `SELECT *`, then filters, sorts and slices in JavaScript. With today's data, that transfers all **1,021 articles, including 5.38 MB of body text**, from D1 to the Worker for each list request. This is server-side transfer, not 5.38 MB sent to the browser. Move filtering/pagination into SQL and select only list fields. Also clamp page numbers: `?page=999` or `?page=abc` currently produces an empty list rather than a valid page. [Admin pagination](/Users/dmw/Documents/websites/changingireland/src/pages/admin/news/index.astro:46).

7. **Medium — media delivery ignores byte-range requests.** A PDF request with `Range: bytes=0-3` returns the full response with status 200. This is a valid full-response fallback in HTTP, but prevents efficient partial PDF loading and media seeking. Forward range requests to R2 and return correct 206/416 responses, Content-Range and Accept-Ranges. Reproduced with a mocked R2 binding in `tests/api/files.test.ts`. [Media handler](/Users/dmw/Documents/websites/changingireland/src/pages/files/[...path].ts:11).

8. **Low — negative timezone offsets bypass scheduled visibility on direct article pages.** `isLive()` appends `Z` to a timestamp already ending in `-05:00`, making it invalid, then treats an invalid timestamp as live. SQL correctly keeps that future post out of listings, while the direct page considers it public. The ordinary picker emits UTC, so this concerns imported or manually submitted timestamps. Parse valid offsets correctly and reject invalid timestamps when saving. Reproduced in `tests/lib/posts.test.ts`. [Visibility rule](/Users/dmw/Documents/websites/changingireland/src/lib/posts.ts:115).

## Database size and requests

Live measurements from `wrangler d1 info`, read-only SQL and `wrangler d1 insights --sort-by reads --limit 10 --json`, captured during this review. Rolling analytics are approximate snapshots, not a load test or a guarantee about future traffic.

| Measurement                                      |                     Value |
| ------------------------------------------------ | ------------------------: |
| Database file size                               | 8,200,192 bytes — 8.20 MB |
| Articles                                         |                     1,021 |
| Published / drafts / scheduled                   |              971 / 50 / 0 |
| Article HTML                                     | 5,377,100 bytes — 5.38 MB |
| Excerpts                                         |   270,167 bytes — 0.27 MB |
| Normalised taxonomy rows                         |                     6,120 |
| Magazines / advertisements                       |                    92 / 2 |
| Sessions / expired sessions                      |                     4 / 0 |
| Read queries, preceding 24 hours                 |                    63,416 |
| Rows read, preceding 24 hours                    |                 3,397,222 |
| Write queries / rows written, preceding 24 hours |                    8 / 20 |

The database is already small. There is no present session-cleanup saving and no evidence of invalid `sort_at` values. The stored live count of 971 matches the actual live article count.

| Query family          | Rows read in the insight window | Approximate share of total |
| --------------------- | ------------------------------: | -------------------------: |
| Category/tag listing  |                       1,323,715 |                        39% |
| Category/tag counting |                         924,740 |                        27% |
| Related articles      |                         667,986 |                        20% |
| Sitemap               |                         103,897 |                         3% |

The first three query families account for roughly **86% of row reads**. Improve these first:

- **Remove unnecessary homepage counts.** Six category blocks call `getPublishedPage(... perPage: 1)`, each calculating a count that the homepage never uses. A dedicated “latest article for category” query removes six database calls per uncached homepage render. The 924,740 count reads above include archive traffic too; not all are removable this way. [Homepage loop](/Users/dmw/Documents/websites/changingireland/src/pages/index.astro:66).
- **Cache or precompute category result IDs and related-article IDs**, with edit and scheduled-publication invalidation. The existing taxonomy index helps lookup, but category listings still inspect and sort multiple joined rows. Benchmark any new query/index using EXPLAIN and actual D1 `rows_read` before rollout.
- **Fetch card fields only.** Public lists also select full body HTML although cards mainly need title, excerpt, image and taxonomy. This reduces transferred bytes and allocation; it does not automatically reduce D1's rows-read accounting.
- **Canonicalise page-cache keys.** The current key retains every query parameter. Tracking parameters and irrelevant parameters can produce independent cache entries for identical HTML. Preserve genuine filters and pagination while stripping irrelevant parameters.
- **Review search and media caching separately.** Middleware excludes both `/api/` and `/files/`; the handlers emit cache headers but implement no Cache API read/write. Browser caching is useful, but headers alone are not evidence that repeated Worker-generated responses avoid D1/R2 calls. Add explicit caching with correct image-variant keys and verify actual hits. Search's leading-wildcard LIKE query also merits full-text search and a rate limit if traffic warrants it. No production edge-hit ratio was established in this review. [Cloudflare Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/).

For storage reduction, `idx_posts_slug` duplicates the unique slug constraint's index and is a candidate for removal after checking plans. Review the older publication indexes for remaining consumers before removing them. Keep the live-order and taxonomy indexes: useful indexes trade a little storage for fewer row scans. Run `PRAGMA optimize` after approved schema changes, as recommended in [Cloudflare's index guidance](https://developers.cloudflare.com/d1/best-practices/use-indexes/).

**Do not gzip article bodies inside D1 just to shrink this 8.20 MB database:** the current body search uses SQL LIKE, which would stop working on compressed content, and reads would require decompression. Backup/export compression is separate. Exact reclaimable free space could not be measured: the attempted SQLite space pragmas were rejected and D1 did not expose `dbstat`; no VACUUM or schema changes were attempted.

## Media size and opportunities

**Live R2 bucket: 1.28 GB across 6,577 objects**, reported by `wrangler r2 bucket info changingireland-uploads`. This is the authoritative bucket-wide figure available here, rounded by Wrangler. It is stored media, not the download size of a page.

The following are independently measured **local source/import files**, not a breakdown of live R2. Original source files and converted live objects differ; do not add these figures to the live bucket total.

| Local material                   | Files | Size, decimal MB |
| -------------------------------- | ----: | ---------------: |
| Mirrored JPG/JPEG/PNG originals  | 5,409 |         1,391.74 |
| Mirrored WebP/GIF                |     8 |             0.71 |
| PDFs within the article mirror   |    30 |           139.64 |
| Videos within the article mirror |     3 |            86.57 |
| Magazine PDF archive             |    92 |           446.51 |
| Magazine cover source images     |   158 |           132.91 |
| Public logo                      |     1 |            0.063 |
| Source asset images              |     9 |             0.94 |

The remote upload manifests record **5,566 WebP conversions** and **600 responsive variants for 100 images**. These are historical upload records, not a fresh verification of every R2 object. The existing conversion pipeline already does useful compression.

Recommended media work:

- Keep WebP/responsive delivery and extend responsive coverage to additional frequently viewed archive images using traffic evidence.
- Support PDF ranges before undertaking broad PDF recompression. The local 92-issue archive averages 4.85 MB per PDF; the largest is issue 81 at 9.88 MB. Trial any recompression on copies and check small text, images and links before replacing a publication-quality original.
- Audit live references before pruning duplicate WordPress sizes or orphaned uploads. A removed article's images may still be shared by another article; automatic deletion without reference tracking would be unsafe. No reclaimable total is claimed without a live object/reference inventory.
- Some local originals are oversized: two July 2026 exhibition JPEGs are 31.74 MB and 30.08 MB. Their existence on disk does not prove those original bytes are delivered publicly, because the route prefers WebP siblings.

## Validation and limits

- `npm test`: **50 passed, 6 expected failures**, 56 total. Added article creation, detail updates, publishing/unpublishing, deletion, taxonomy cleanup, duplicate addresses, scheduling, filtering/pagination, sanitisation, Quill conversion and media response tests. Existing upload/image tests remain passing.
- `npm run build`: passed.
- `npm run check`: passed; Astro reported 19 informational hints, zero errors and zero warnings, followed by successful ESLint and Prettier checks.
- Browser checks on the existing local server at localhost:4330: homepage, news archive, article page and mobile navigation at 390px, light mode. Navigation and sampled layouts worked; viewport override was restored.
- SQLite tests exercise actual SQL and migration triggers through a small D1-shaped adapter. They are not a full Cloudflare runtime or authenticated admin form end-to-end test. Media route tests mock R2; no real upload or delete was performed.
- Direct production HTTP probes returned 403 from this environment. That prevents confirmation of production HTTP caching/range behaviour, but does not establish an outage for ordinary visitors. Production D1/R2 authenticated metadata and analytics reads succeeded.
- This was focused on articles, data access and media. It is not an exhaustive security audit, every-link/media integrity crawl, or test of transactional email and account-management workflows.
