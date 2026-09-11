/**
 * Client-side driver for the shared image-library dialog
 * (src/components/ImageLibraryDialog.astro). Any admin script can call
 * `openImageLibrary()` and get back the URL the editor picked, or null if they
 * closed the dialog. The featured-image field and the rich editor's toolbar
 * both use it, so the article body can reuse photos already on the site
 * instead of uploading a fresh copy every time.
 *
 * The recent-uploads list comes from /api/admin/uploads, fetched once per page
 * and kept in module state; call `invalidateImageLibrary()` after an upload so
 * the new file shows up next time the dialog opens.
 */
import { articleImages, matchesQuery, thumbUrl, type PickerImage } from '~/lib/featured-image';

export interface OpenImageLibraryOptions {
  /** Dialog heading, e.g. "Choose a featured image" or "Insert an image". */
  title?: string;
  /** URL currently in use, shown as the selected tile. */
  current?: string;
  /** Article HTML whose images are listed first under "Images in this article". */
  articleHtml?: string;
}

let library: PickerImage[] | null = null;
const boundDialogs = new WeakSet<HTMLDialogElement>();
let resolveOpen: ((url: string | null) => void) | null = null;
// The search box and "Show more" button are bound once; each open swaps in
// its own render/page functions so they see that open's `current` and
// `articleHtml` without stacking listeners.
let activeRender: (() => void) | null = null;
let activeMore: (() => void) | null = null;

/** Forget the cached list so the next open re-fetches (after an upload). */
export function invalidateImageLibrary(): void {
  library = null;
}

function getDialog(): HTMLDialogElement | null {
  return document.querySelector<HTMLDialogElement>('dialog[data-image-library]');
}

/** True when the page renders <ImageLibraryDialog />, so a picker can be offered. */
export function hasImageLibrary(): boolean {
  return getDialog() !== null;
}

// The library can run to a few thousand pictures. Tiles are appended in pages
// of PAGE so the dialog opens instantly; "Show more" adds the next page and the
// search box filters the whole list client-side.
const PAGE = 60;

export function openImageLibrary(options: OpenImageLibraryOptions = {}): Promise<string | null> {
  const dialog = getDialog();
  if (!dialog) return Promise.resolve(null);

  const heading = dialog.querySelector<HTMLElement>('[data-image-library-title]')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-image-library-close]')!;
  const articleSection = dialog.querySelector<HTMLElement>('[data-image-library-article-section]')!;
  const articleGrid = dialog.querySelector<HTMLUListElement>('[data-image-library-article-grid]')!;
  const status = dialog.querySelector<HTMLElement>('[data-image-library-status]')!;
  const grid = dialog.querySelector<HTMLUListElement>('[data-image-library-grid]')!;
  const searchInput = dialog.querySelector<HTMLInputElement>('[data-image-library-search]')!;
  const moreBtn = dialog.querySelector<HTMLButtonElement>('[data-image-library-more]')!;

  const current = (options.current ?? '').trim();
  let shown = 0;
  let filtered: PickerImage[] = [];

  const finish = (url: string | null) => {
    const resolve = resolveOpen;
    resolveOpen = null;
    if (dialog.open) dialog.close();
    resolve?.(url);
  };

  function tile(img: PickerImage): HTMLLIElement {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    const on = img.url === current;
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', `Use ${img.name}`);
    b.title = img.name;
    b.className = on
      ? 'block w-full aspect-[4/3] overflow-hidden rounded-lg ring-3 ring-primary ring-offset-2 bg-gray-100'
      : 'block w-full aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100 hover:ring-2 hover:ring-primary hover:ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:outline-none';
    const pic = document.createElement('img');
    pic.src = thumbUrl(img.url);
    pic.alt = '';
    pic.loading = 'lazy';
    pic.className = 'h-full w-full object-cover';
    b.appendChild(pic);
    b.addEventListener('click', () => finish(img.url));
    li.appendChild(b);
    return li;
  }

  function appendPage() {
    const next = filtered.slice(shown, shown + PAGE);
    next.forEach((img) => grid.appendChild(tile(img)));
    shown += next.length;
    moreBtn.classList.toggle('hidden', shown >= filtered.length);
    moreBtn.textContent = `Show more (${filtered.length - shown} left)`;
  }

  function render() {
    articleGrid.textContent = '';
    const inArticle = options.articleHtml ? articleImages(options.articleHtml) : [];
    inArticle.forEach((img) => articleGrid.appendChild(tile(img)));
    articleSection.classList.toggle('hidden', inArticle.length === 0);

    grid.textContent = '';
    shown = 0;
    if (!library) return;
    const query = searchInput.value.trim();
    filtered = query ? library.filter((img) => matchesQuery(img, query)) : library;
    status.textContent =
      library.length === 0
        ? 'No images yet. Use the Upload button to add one.'
        : filtered.length === 0
          ? 'No images match that search.'
          : `${filtered.length.toLocaleString('en-IE')} image${filtered.length === 1 ? '' : 's'}${query ? ' found' : ''}`;
    appendPage();
  }

  async function load() {
    if (library) return;
    status.textContent = 'Loading…';
    try {
      const res = await fetch('/api/admin/uploads');
      const json = (await res.json()) as { images?: PickerImage[]; error?: string };
      if (!res.ok || !json.images) throw new Error(json.error ?? 'failed');
      library = json.images;
    } catch {
      status.textContent = 'Could not load the image library. Close and try again.';
      return;
    }
    render();
  }

  activeRender = render;
  activeMore = appendPage;

  if (!boundDialogs.has(dialog)) {
    boundDialogs.add(dialog);
    searchInput.addEventListener('input', () => activeRender?.());
    moreBtn.addEventListener('click', () => activeMore?.());
    closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      // Backdrop click: the dialog box itself is the only child that can be
      // the target when the click lands outside the panel.
      if (e.target === dialog) dialog.close();
    });
    // Escape, backdrop and the close button all end here; a tile pick has
    // already resolved by the time this fires.
    dialog.addEventListener('close', () => {
      const resolve = resolveOpen;
      resolveOpen = null;
      resolve?.(null);
    });
  }

  // A second open while one is pending (shouldn't happen) settles the first.
  resolveOpen?.(null);

  return new Promise<string | null>((resolve) => {
    resolveOpen = resolve;
    heading.textContent = options.title ?? 'Choose an image';
    render();
    dialog.showModal();
    void load();
  });
}
