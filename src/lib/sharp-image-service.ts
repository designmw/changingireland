/**
 * Sharp image service, re-exported under our own module path.
 *
 * WHY THIS FILE EXISTS
 *
 * `@astrojs/cloudflare` with `imageService: 'compile'` installs its own build
 * service, `@astrojs/cloudflare/image-service-workerd`, whose transform is a
 * no-op:
 *
 *     async transform(inputBuffer, transform) {
 *       return { data: inputBuffer, format: transform.format };
 *     }
 *
 * It returns the source bytes untouched and merely labels them with the
 * requested format. That is why builds emitted `_astro/*.webp` files that were
 * really full-resolution JPEG/PNG - no resizing and no encoding ever happened.
 *
 * The adapter will step aside for a user-supplied service, but its check
 * (`hasUserImageService`) explicitly ignores the literal entrypoint
 * `'astro/assets/services/sharp'`, so setting Sharp directly in
 * `astro.config.ts` is silently overridden. Naming the same service through
 * this module gets past that check, and Sharp actually runs.
 *
 * Build-time only. Dev still uses `passthrough`, and on-demand routes still use
 * the adapter's passthrough endpoint at runtime.
 */
export { default } from 'astro/assets/services/sharp';
