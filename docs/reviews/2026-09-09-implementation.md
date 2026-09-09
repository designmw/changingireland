# Review fixes — implementation report

Implemented, verified and deployed to **changingireland.ie and www.changingireland.ie on 9 September 2026**. The original review remains a historical snapshot; this report records the implementation outcome.

## Completed changes

1. **Article sanitisation:** decode HTML attribute entities before checking URL schemes, and normalise attribute/tag case. Tests cover numeric entities, named entities, control characters, uppercase attributes and legitimate encoded links.
2. **Reserved article addresses:** both form validation and persistence reject existing site routes and imported information-page addresses. The validation error keeps the editor's submitted details visible.
3. **Scheduling:** direct visibility handles timezone offsets correctly and fails closed for malformed dates. Saving rejects invalid calendar dates. Counts and HTML caches advance when a scheduled publication becomes due, without waiting for another edit.
4. **Immediate cache invalidation:** migration 0008 creates a content revision updated atomically by database triggers. Cache keys include that revision and the latest due publication time. A small indexed query validates each request before serving cached HTML; request-local memoisation avoids repeating it within a render. Deleting/unpublishing invalidates cached public articles across locations. Browser-facing HTML requires revalidation so it cannot bypass the revision check.
5. **Editor preservation:** opening an article or switching between raw/visual modes no longer overwrites its original HTML. Untouched figure/caption markup survives a details-only edit. Deliberate visual body edits still use Quill's supported formats; preserving arbitrary imported layouts during visual body editing is not promised. Raw HTML remains available for those edits.
6. **Article query efficiency:** admin filtering, sorting and pagination now happen in SQL, with invalid/out-of-range pages clamped. Public and admin lists select summary fields without article bodies. Homepage category blocks use one query without calculating unused counts. A new taxonomy visibility/order index removes temporary sorts for category and related-article queries; category count maps are revision-aware. The duplicate slug index is removed.
7. **Media delivery:** implement HEAD, conditional ETags, single byte ranges, suffix ranges, If-Range and 206/416 responses. R2 reads are pinned to their metadata version. Immutable media uses an explicit edge cache with separate format/width keys. Missing variants get a short fallback cache lifetime so later responsive generation can take effect. Mutable magazine keys retain their existing cache policy and bypass the new immutable-object edge cache.
8. **Page/search caching:** discard tracking parameters from page cache keys while retaining meaningful pagination/search filters. Search JSON uses the revision-aware edge cache. Authenticated/admin responses remain outside this public cache.

Also added `entities` as an explicit dependency and upgraded Astro to 7.3.2, direct Sharp to 0.35.4, and js-yaml to 4.3.2. The Astro upgrade removes the critical advisory reported during this work.

## Verification

- **86 unit/integration tests passed**, with no skipped or expected-failure tests.
- **Eight compiled-Worker workflow checks passed:** anonymous access rejection, draft creation, details editing/sanitisation/publication, cache hits, immediate unpublishing, timed publication/listing invalidation, reserved-address rejection and deletion. Fixtures used local D1 and were removed in `finally` cleanup.
- `npm run build` passed.
- `npm run check` passed: Astro, ESLint and Prettier. Astro retains 19 informational hints, zero errors and zero warnings.
- Browser verification on the compiled local Worker: desktop homepage, mobile menu and news listing in light mode; viewport override restored.
- Real local R2 PDF request: `bytes=0-3` returned **206**, `Content-Range: bytes 0-3/9876847`, and **exactly four bytes**, instead of the entire 9.88 MB magazine.
- Real local responsive-image request returned an **8,316-byte WebP**, then an edge-cache hit on repetition.

A local SQLite benchmark on the largest category returned the same 12-result count with **3,594 execution steps before vs 158 after**, eliminating the temporary sort. This is about 96% less SQLite execution work for that sampled query, **not a production traffic, billing or overall latency measurement**. The benchmark executed both SQL shapes against the migrated local data/indexes. Production row-read reduction must be measured after deployment.

## Deployment and storage

Migration [0008](/Users/dmw/Documents/websites/changingireland/migrations/0008_content_cache_and_taxonomy_order.sql) has been applied to both local and production D1. It adds cache revision tracking and taxonomy ordering columns/indexes; it does not delete articles or media. The extra ordering data trades modest storage for substantially less query work, so this is not a database-compression claim.

`npm run deploy` now builds first, applies remote D1 migrations, then deploys the Worker, ensuring the required schema exists before the new code runs. The remote migration and deployment completed successfully. Production has no pending migrations.

Repeat local checks with:

```sh
npm test
npm run check
npm run build
npm run db:migrate:local
npx wrangler dev -c dist/server/wrangler.json --local --port 4331 --persist-to .wrangler/state
# In a second terminal:
npm run test:workflows
```

Live media storage remains the previously measured **1.28 GB / 6,577 objects**; no production media was replaced or removed. Existing WebP/responsive conversion remains intact. Bulk PDF recompression and orphan-media deletion were not performed because neither a proven saving nor safe deletion inventory was established. Media improvements here reduce transfers and repeat storage requests.

The final dependency audit still reports **14 advisories (13 high, 1 low)**, including transitive build/runtime tooling packages and Quill. Some suggested fixes are incompatible major changes or downgrades. No forced audit downgrade was applied; the server-side sanitiser remains the boundary for submitted editor HTML. This implementation should not be described as an all-dependencies security clearance.

## Production release verification

- Code commit: `0534471`, pushed to `origin/d1-usage-fix`.
- Worker version: `3955591d-eb5d-4569-99ea-9ac0c672b640`, deployed at approximately 17:34 UTC (18:34 Irish time).
- Production build and all 26 migration statements succeeded.
- Both custom domains returned HTTP 200 with the new revalidation policy.
- Homepage, news, category, article and search API returned HTTP 200. Homepage and repeated search requests returned edge-cache hits. Anonymous admin access returned HTTP 302 to login.
- Live PDF range request returned HTTP 206, four bytes, and `Content-Range: bytes 0-3/9876847`.
- Browser checks passed for desktop homepage, mobile menu and mobile news listing in light mode.
- Production retains 1,021 articles; taxonomy visibility/order consistency check found zero mismatches.
- Database size after migration: **8,634,368 bytes (8.63 MB)**, up from 8.20 MB due to the added ordering data/indexes. This is a query-efficiency improvement, not storage compression.
- R2 rechecked after deployment: **1.28 GB, 6,577 objects**. No media was removed or rewritten.
- Initial requests briefly showed the previous cache policy during propagation; subsequent canonical-domain requests showed the new policy. An attempted API cache purge was denied by the credential scope; no purge occurred, and subsequent verification succeeded without one.
- Pre-release Worker version: `8f80bcb0-d8e8-45a6-9dac-68d8bec65b32`. Pre-migration D1 recovery bookmark: `00000141-00000000-000050e1-137cdb657f4840e1750f5aa3719f2192`. Recovery must account for any subsequent editorial changes.

The 86 automated tests and eight article workflow checks were performed locally before release; production checks were read-only. Production request-volume savings require a representative post-release observation window. The dependency advisories documented above remain outstanding.
