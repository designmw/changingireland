import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Unit tests for the plain TypeScript under src/lib and the JSON API routes.
// Kept independent of Astro's Vite config so `npm test` starts fast and
// never needs a Cloudflare binding: routes under test mock ~/lib/auth.
export default defineConfig({
  resolve: {
    alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    // Route tests live in tests/ — a *.test.ts under src/pages would be built as a route.
    include: ['src/lib/**/*.test.ts', 'tests/**/*.test.ts'],
  },
});
