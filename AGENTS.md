# dmw-astro-base Agent Instructions

## Project Overview

dmw-astro-base is a lean Astro v6 + Tailwind CSS v4 base starter for local Irish SME websites (tradespeople, solicitors, salons, accountants). It is cloned per client and customised. Built on AstroWind with all SaaS/marketing-demo content removed.

**Stack:** Astro v6 | Tailwind CSS v4 | TypeScript 5.9 | MDX | Sharp

## Quick Reference

| Command           | Purpose                             |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start dev server at localhost:4321  |
| `npm run build`   | Production build to `./dist/`       |
| `npm run preview` | Preview production build locally    |
| `npm run check`   | Run astro check + ESLint + Prettier |
| `npm run fix`     | Auto-fix ESLint + Prettier issues   |

**Node.js requirement:** >= 22.12.0

## Architecture

### Directory Structure

```
src/
  assets/styles/tailwind.css   # Tailwind v4 config (themes, utilities, plugins)
  components/
    common/        # Shared: Image, Metadata, Analytics, ToggleTheme
    ui/            # Primitives: Button, Headline, WidgetWrapper, ItemGrid
    widgets/       # Page sections: Hero, Features, Pricing, Header, Footer
    blog/          # Blog: SinglePost, List, Pagination, Tags
    CustomStyles.astro  # CSS variables for colors and fonts
  content.config.ts    # Content Collections schema (Astro v6 location)
  data/post/           # Blog posts (.md, .mdx)
  layouts/             # Layout.astro, PageLayout.astro, MarkdownLayout.astro
  pages/               # File-based routing
  utils/               # blog.ts, images.ts, permalinks.ts, frontmatter.ts
  config.yaml          # Site configuration (loaded as virtual module)
  navigation.ts        # Navigation structure
  types.d.ts           # TypeScript type definitions
vendor/integration/    # Custom Astro integration for config loading
```

### Path Aliases

Use `~/` to import from `src/`:

```typescript
import Image from '~/components/common/Image.astro';
import { SITE } from 'astrowind:config';
```

### Configuration System

Site config lives in `src/config.yaml` and is loaded as a Vite virtual module `astrowind:config` by the custom integration in `vendor/integration/`. Exports: `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`.

## Tailwind CSS v4

Configuration is CSS-first in `src/assets/styles/tailwind.css`:

- **Theme tokens:** `@theme { --color-primary: var(--aw-color-primary); ... }`
- **Custom utilities:** `@utility bg-page { ... }`
- **Dark mode:** Class-based via `@variant dark (&:where(.dark, .dark *))` — dormant by default, since `ui.theme` is `light:only` and the `.dark` class is never applied
- **Plugins:** `@plugin "@tailwindcss/typography"`
- **Custom variant:** `@custom-variant intersect (&:not([no-intersect]))`

CSS variables for colors/fonts are defined in `src/components/CustomStyles.astro` with light/dark theme variants.

The Vite plugin `@tailwindcss/vite` is configured in `astro.config.ts` (not as an Astro integration).

### Class Merging

Components use `twMerge` from `tailwind-merge` v3 for conditional class composition.

## Content Collections

Defined in `src/content.config.ts` using the Astro v6 Content Layer API with `glob()` loader. Posts are in `src/data/post/` as `.md` or `.mdx` files.

Post frontmatter: `title` (required), `publishDate`, `updateDate`, `draft`, `excerpt`, `image`, `category`, `tags`, `author`, `metadata`.

## Component Patterns

- Props extend interfaces from `~/types`
- Use `class:list` for conditional classes
- Use `twMerge()` when accepting className overrides
- Use named slots for layout composition
- Widget components accept standardized props (see `~/types`)

## Image Handling

`src/components/common/Image.astro` supports:

- Local images via `astro:assets` (optimized by Sharp)
- Remote images via Unpic CDN
- Allowed domains (for providers Unpic can't detect, processed by Sharp): `cdn.pixabay.com`

Hero images use `loading="eager"` and `fetchpriority="high"`.

### WebP pipeline for R2-served media (`/files/…`)

`Image.astro` can't transform R2-served files, so those get WebP another way — keep all three parts intact:

- **Existing media**: `node scripts/webp-media.mjs [--remote]` generates a `<key>.webp` sibling in R2 (max 1600px wide, quality 80, sharp) for every mirrored post image, magazine cover, and ad image. Manifest-tracked (`scripts/data/media-mirror/webp-manifest.*.json`), safe to re-run; re-run it after any bulk media import.
- **Responsive media**: `npm run media:responsive -- --remote` generates 160–1280px WebP siblings for the 100 most recent and all featured post images. `/files/<key>?w=<width>` serves these with a full-size fallback. The shared breakpoint list in `Image.astro`, `webp-client.ts`, `/files/[...path].ts`, and `scripts/responsive-media.mjs` must stay aligned.
- **Serving**: `src/pages/files/[...path].ts` serves the `.webp` sibling to clients whose `Accept` includes `image/webp` (with `Vary: Accept`), falling back to the original. URLs stored in D1 never change.
- **Future uploads**: the admin converts PNG/JPEG to WebP in the browser before upload (`src/lib/webp-client.ts`, wired into `RichEditor.astro`, the magazine cover form, and the ads form) — Workers can't run an image encoder. Rich-editor uploads also include responsive siblings. GIFs and existing WebP pass through; conversion failure falls back to the original file, so the server endpoints still accept PNG/JPEG. `scripts/import-magazines.mjs` uploads a `.webp` cover sibling itself.

## Verification Checklist

After changes, always verify:

1. `npm run build` succeeds
2. `npm run check` passes (astro check + ESLint + Prettier)
3. Visual check in browser: homepage, blog, mobile menu (light mode only — `ui.theme` is `light:only`)
