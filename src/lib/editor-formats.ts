/**
 * Custom Quill formats for the article editor (RichEditor.astro). They live
 * in a plain module, rather than inside the component's script, so the vitest
 * suite can run real article markup through them.
 *
 * - SizedImage: Quill's image plus a size class (ci-img-thumb / ci-img-medium).
 * - TargetLink: Quill's link with a real "open in a new tab" choice.
 * - ImageFigure: a picture with an optional caption, as <figure>/<figcaption>.
 *   The WordPress import has ~660 captions in figures. Quill has no figure
 *   format of its own, so before this every caption was flattened into an
 *   ordinary paragraph the first time its article was edited.
 *
 * Call registerEditorFormats() before creating an editor, and
 * installClipboardMatchers(quill) before loading content into it.
 */
import Quill from 'quill';
import type { BlockEmbed as BlockEmbedBlot } from 'quill/blots/block';
import type ImageFormat from 'quill/formats/image';
import type LinkFormat from 'quill/formats/link';
import type DeltaType from 'quill-delta';

const BlockEmbed = Quill.import('blots/block/embed') as typeof BlockEmbedBlot;
const BaseImage = Quill.import('formats/image') as typeof ImageFormat;
const BaseLink = Quill.import('formats/link') as typeof LinkFormat;
const Delta = Quill.import('delta') as typeof DeltaType;

// ── Addresses ───────────────────────────────────────────────────────────

/**
 * Turn whatever was typed into the link box into a working address. People
 * paste "youtube.com/watch?v=…" without the https://, which Quill would
 * otherwise save as a broken link relative to our own site.
 */
export function normaliseLink(input: string): string {
  const url = input.trim();
  if (!url) return '';
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(url)) return url;
  if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(url)) return `mailto:${url}`;
  return `https://${url}`;
}

/** Relative, or an http(s)/mailto/tel address. Mirrors isSafeUrl in sanitize.ts. */
function isSafeHref(href: string): boolean {
  // Browsers ignore control characters inside a scheme ("java\nscript:").
  // eslint-disable-next-line no-control-regex
  const url = href.replace(/[\x00-\x20]/g, '').toLowerCase();
  if (!url) return false;
  const colon = url.indexOf(':');
  const firstSlash = url.search(/[/?#]/);
  if (colon === -1 || (firstSlash !== -1 && firstSlash < colon)) return true;
  return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.slice(0, colon + 1));
}

// ── Captions ────────────────────────────────────────────────────────────

/** What a caption may contain: the imported ones use italics, bold, links and line breaks. */
const CAPTION_KEEP = new Set(['EM', 'I', 'STRONG', 'B', 'A', 'BR']);
/** Removed along with their contents rather than unwrapped. */
const CAPTION_DROP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'IFRAME', 'OBJECT', 'EMBED', 'IMG', 'SVG', 'MATH']);

/**
 * Reduce caption HTML to plain text plus italics, bold, links and line
 * breaks. Captions are set with innerHTML inside the editor, and stored or
 * pasted HTML can't be trusted there; the server sanitiser still runs on save.
 */
export function sanitizeCaption(html: string): string {
  const template = document.createElement('template');
  template.innerHTML = html;
  const clean = (parent: Node) => {
    for (const node of [...parent.childNodes]) {
      if (node.nodeType === Node.TEXT_NODE) continue;
      if (node.nodeType !== Node.ELEMENT_NODE) {
        node.remove();
        continue;
      }
      const el = node as Element;
      const tag = el.tagName.toUpperCase();
      if (CAPTION_DROP.has(tag)) {
        el.remove();
        continue;
      }
      clean(el);
      if (!CAPTION_KEEP.has(tag)) {
        el.replaceWith(...el.childNodes);
        continue;
      }
      const href = el.getAttribute('href');
      const newTab = el.getAttribute('target') === '_blank';
      for (const { name } of [...el.attributes]) el.removeAttribute(name);
      if (tag !== 'A') continue;
      if (!href || !isSafeHref(href)) {
        el.replaceWith(...el.childNodes);
        continue;
      }
      el.setAttribute('href', href);
      if (newTab) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
  };
  clean(template.content);
  return template.innerHTML.trim();
}

/** A caption's words, for editing in a plain text box. */
export function captionToText(html: string): string {
  const template = document.createElement('template');
  template.innerHTML = html.replace(/<br\s*\/?>/gi, ' ');
  return (template.content.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/** Typed caption text as safe HTML. */
export function textToCaption(text: string): string {
  const holder = document.createElement('div');
  holder.textContent = text.trim();
  return holder.innerHTML;
}

// ── Image sizes ─────────────────────────────────────────────────────────

// A chosen size is stored as a class rather than a width attribute: imported
// WordPress images already carry width attributes that the article page
// deliberately ignores, and `class` survives the server sanitiser.
export const IMAGE_SIZES = ['thumb', 'medium'];

function applySize(img: Element, value: unknown) {
  IMAGE_SIZES.forEach((s) => img.classList.remove(`ci-img-${s}`));
  if (typeof value === 'string' && IMAGE_SIZES.includes(value)) img.classList.add(`ci-img-${value}`);
  if (!img.classList.length) img.removeAttribute('class');
}

class SizedImage extends BaseImage {
  static formats(node: Element) {
    const formats: Record<string, string | null> = super.formats(node);
    const size = IMAGE_SIZES.find((s) => node.classList.contains(`ci-img-${s}`));
    if (size) formats.imagesize = size;
    return formats;
  }
  format(name: string, value: string) {
    if (name !== 'imagesize') return super.format(name, value);
    applySize(this.domNode, value);
  }
}

// ── Link targets ────────────────────────────────────────────────────────

// Quill's link blot puts target="_blank" on every link. Exposing the target as
// a format lets the link box offer "Open in a new tab"; a same-tab link simply
// has no target. It's handled by the link blot itself rather than a
// free-standing attributor, so it can never end up on plain text.
class TargetLink extends BaseLink {
  formats() {
    const formats = super.formats();
    formats.target = this.domNode.getAttribute('target') === '_blank' ? '_blank' : '_self';
    return formats;
  }
  format(name: string, value: unknown) {
    if (name !== 'target') return super.format(name, value as string);
    if (value === '_self') this.domNode.removeAttribute('target');
    else this.domNode.setAttribute('target', '_blank');
  }
}

// ── Captioned pictures ──────────────────────────────────────────────────

/**
 * <figure><img><figcaption>…</figcaption></figure> as a single block in the
 * editor. The value is the image address; everything else is a format:
 * alt, width, height, imagesize, imagelink (+ imagelinktarget) for a picture
 * that is itself a link, caption (sanitised HTML), and align (Quill's own
 * block alignment, a class on the figure).
 *
 * The figure is contenteditable=false: the caption is edited from the image
 * toolbar, not typed in place, which would fight Quill's keyboard handling.
 */
class ImageFigure extends BlockEmbed {
  static blotName = 'figure';
  static tagName = 'FIGURE';

  /** A target that arrived before the link it belongs to. */
  declare pendingLinkTarget?: string;

  static create(value: unknown) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute('contenteditable', 'false');
    const img = document.createElement('img');
    img.setAttribute('src', BaseImage.sanitize(String(value)));
    node.appendChild(img);
    return node;
  }

  /** A figure with no image (a table, a pull quote) isn't ours: null tells
   *  Quill's clipboard to keep its contents as ordinary text instead. */
  static value(node: HTMLElement) {
    return node.querySelector('img')?.getAttribute('src') ?? null;
  }

  static formats(node: HTMLElement) {
    const formats: Record<string, string> = {};
    const img = node.querySelector('img');
    if (img) {
      for (const name of ['alt', 'width', 'height']) {
        const value = img.getAttribute(name);
        if (value !== null) formats[name] = value;
      }
      const size = IMAGE_SIZES.find((s) => img.classList.contains(`ci-img-${s}`));
      if (size) formats.imagesize = size;
      const link = img.closest('a');
      const href = link && node.contains(link) ? link.getAttribute('href') : null;
      if (href) {
        formats.imagelink = href;
        if (link!.getAttribute('target') === '_blank') formats.imagelinktarget = '_blank';
      }
    }
    const caption = node.querySelector('figcaption');
    const html = caption ? sanitizeCaption(caption.innerHTML) : '';
    if (html) formats.caption = html;
    return formats;
  }

  /** Includes alignment, so getFormat() reports it like it does for a line. */
  formats() {
    return { ...ImageFigure.formats(this.domNode), ...this.attributes.values() };
  }

  format(name: string, value: unknown) {
    const img = this.domNode.querySelector('img');
    if (!img) return super.format(name, value);
    const link = img.parentElement?.tagName === 'A' ? img.parentElement : null;
    switch (name) {
      case 'alt':
        // An empty alt is meaningful (a decorative picture), so keep it.
        if (typeof value === 'string') img.setAttribute('alt', value);
        else img.removeAttribute('alt');
        return;
      case 'width':
      case 'height':
        if (typeof value === 'string' && value) img.setAttribute(name, value);
        else img.removeAttribute(name);
        return;
      case 'imagesize':
        applySize(img, value);
        return;
      case 'caption': {
        const html = typeof value === 'string' ? sanitizeCaption(value) : '';
        let caption = this.domNode.querySelector('figcaption');
        if (!html) {
          caption?.remove();
          return;
        }
        if (!caption) {
          caption = document.createElement('figcaption');
          this.domNode.appendChild(caption);
        }
        caption.innerHTML = html;
        return;
      }
      case 'imagelink': {
        const href = typeof value === 'string' && isSafeHref(value) ? value : '';
        if (!href) {
          link?.replaceWith(img);
          return;
        }
        const anchor = link ?? document.createElement('a');
        anchor.setAttribute('href', href);
        if (!link) {
          img.replaceWith(anchor);
          anchor.appendChild(img);
        }
        if (this.pendingLinkTarget) {
          this.format('imagelinktarget', this.pendingLinkTarget);
          delete this.pendingLinkTarget;
        }
        return;
      }
      case 'imagelinktarget':
        if (!link) {
          if (value === '_blank') this.pendingLinkTarget = '_blank';
          return;
        }
        if (value === '_blank') {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        } else {
          link.removeAttribute('target');
          link.removeAttribute('rel');
        }
        return;
      default:
        super.format(name, value);
    }
  }

  /** What gets saved: the figure without its editor-only attribute and outline. */
  html() {
    const clone = this.domNode.cloneNode(true) as HTMLElement;
    clone.removeAttribute('contenteditable');
    clone.querySelectorAll('.rich-image-selected').forEach((el) => {
      el.classList.remove('rich-image-selected');
      if (!el.classList.length) el.removeAttribute('class');
    });
    return clone.outerHTML;
  }
}

// ── Setup ───────────────────────────────────────────────────────────────

let registered = false;

/** Register the formats above with Quill. Safe to call more than once. */
export function registerEditorFormats() {
  if (registered) return;
  registered = true;
  Quill.register({ 'formats/image': SizedImage, 'formats/link': TargetLink, 'formats/figure': ImageFigure }, true);
}

/**
 * Carry each link's target into the editor when an article is opened. Quill's
 * clipboard drops it, and the link blot would then make every link a new-tab
 * link. `link` must come first in the attributes so the link exists before its
 * target is applied to it.
 */
export function installClipboardMatchers(quill: Quill) {
  quill.clipboard.addMatcher('A', (node, delta) => {
    const target = (node as Element).getAttribute('target') === '_blank' ? '_blank' : '_self';
    delta.ops.forEach((op) => {
      if (op.insert === undefined) return;
      const { link, ...rest } = op.attributes ?? {};
      op.attributes = link ? { link, target, ...rest } : { ...rest, target };
    });
    return delta;
  });
}

// ── Editing helpers ─────────────────────────────────────────────────────

type Embed = { image?: unknown; figure?: unknown };

/** The picture embedded at `index`, if there is one. */
function embedAt(quill: Quill, index: number) {
  const [op] = quill.getContents(index, 1).ops;
  if (!op || typeof op.insert !== 'object') return null;
  const insert = op.insert as Embed;
  if (typeof insert.figure === 'string') return { kind: 'figure', src: insert.figure, attributes: op.attributes ?? {} };
  if (typeof insert.image === 'string') return { kind: 'image', src: insert.image, attributes: op.attributes ?? {} };
  return null;
}

/**
 * Give the ordinary (inline) picture at `index` a caption by turning it into a
 * figure, keeping its description, size, link and alignment. Returns the
 * figure's new index, or -1 if there was no picture there.
 */
export function imageToFigure(quill: Quill, index: number, caption: string): number {
  const embed = embedAt(quill, index);
  if (!embed || embed.kind !== 'image') return -1;
  const { link, target, ...kept } = embed.attributes as Record<string, unknown>;
  const attributes: Record<string, unknown> = { ...kept };
  if (typeof link === 'string') {
    attributes.imagelink = link;
    if (target === '_blank') attributes.imagelinktarget = '_blank';
  }
  attributes.caption = caption;

  const [line, offset] = quill.getLine(index);
  // Alone on its line (the usual case): the figure replaces the whole line, so
  // no empty paragraph is left behind, and it takes over the line's alignment.
  // The document's last line is left in place: Quill always needs one.
  const aloneOnLine = !!line && offset === 0 && line.length() === 2 && index + 2 < quill.getLength();
  if (aloneOnLine) {
    const { align } = quill.getFormat(index, 1) as { align?: string };
    if (align) attributes.align = align;
  }
  return swapEmbed(quill, index, aloneOnLine ? 2 : 1, 'figure', embed.src, attributes);
}

/**
 * Swap the picture at `index` for another, keeping its description, size,
 * link, caption and alignment. The old width/height go: the new picture has
 * its own proportions.
 */
export function replaceImageSource(quill: Quill, index: number, url: string) {
  const embed = embedAt(quill, index);
  if (!embed) return;
  const kept = { ...(embed.attributes as Record<string, unknown>) };
  delete kept.width;
  delete kept.height;
  swapEmbed(quill, index, 1, embed.kind, url, kept);
}

/**
 * Replace `length` characters at `index` with a picture, then format it.
 * Formatting is a second step on purpose: when a figure lands in the middle
 * of a paragraph, Quill splits the paragraph, and formats sent in the same
 * change land on the new line break instead of the figure. Quill's history
 * merges the two steps into one undo. Returns the picture's index, or -1.
 */
function swapEmbed(
  quill: Quill,
  index: number,
  length: number,
  kind: string,
  src: string,
  attributes: Record<string, unknown>
): number {
  quill.updateContents(
    new Delta()
      .retain(index)
      .insert({ [kind]: src })
      .delete(length),
    'user'
  );
  const at = [index, index + 1].find((i) => {
    const found = embedAt(quill, i);
    return found?.kind === kind && found.src === src;
  });
  if (at === undefined) return -1;
  if (Object.keys(attributes).length) quill.updateContents(new Delta().retain(at).retain(1, attributes), 'user');
  return at;
}
