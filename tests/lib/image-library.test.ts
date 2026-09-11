// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest';
import { invalidateImageLibrary, openImageLibrary } from '~/lib/image-library';

function page() {
  document.body.innerHTML = `<dialog data-image-library>
    <h2 data-image-library-title></h2><button data-image-library-close></button>
    <section data-image-library-article-section><ul data-image-library-article-grid></ul></section>
    <p data-image-library-status></p><ul data-image-library-grid></ul>
    <input data-image-library-search><button data-image-library-more></button>
  </dialog>`;
}

afterEach(() => {
  document.body.innerHTML = '';
  invalidateImageLibrary();
  vi.unstubAllGlobals();
});

it('binds search and close on the replacement dialog after client navigation', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        images: [
          { url: '/first.jpg', name: 'first' },
          { url: '/second.jpg', name: 'second' },
        ],
      }),
    })
  );
  page();
  const first = openImageLibrary();
  await vi.waitFor(() => expect(document.querySelectorAll('[data-image-library-grid] li')).toHaveLength(2));
  document.querySelector<HTMLButtonElement>('[data-image-library-close]')!.click();
  await first;
  page(); // Astro ClientRouter swaps the document but retains the module.
  const second = openImageLibrary();
  const search = document.querySelector<HTMLInputElement>('[data-image-library-search]')!;
  search.value = 'second';
  search.dispatchEvent(new Event('input'));
  expect(document.querySelectorAll('[data-image-library-grid] li')).toHaveLength(1);
  document.querySelector<HTMLButtonElement>('[data-image-library-close]')!.click();
  expect(document.querySelector('dialog')!.open).toBe(false);
  await expect(second).resolves.toBeNull();
});
