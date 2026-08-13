/**
 * Server-side HTML sanitiser for article bodies.
 *
 * The admin editor is Quill, but Quill only runs in the browser: the article
 * body arrives as a plain `content` form field, so anyone with an editor login
 * can POST arbitrary HTML straight to /admin/news/edit and skip the editor
 * entirely. That HTML is then rendered with `set:html` on the public article
 * page, which makes it same-origin script — enough for an editor-level account
 * to drive an admin's browser through /admin/users. Everything saved from the
 * admin therefore goes through here first.
 *
 * Two passes:
 *   1. ultrahtml's `sanitize` transformer applies the element/attribute
 *      allowlists below (this is what drops `<script>`, `onclick`, and friends).
 *   2. `checkUrls` re-checks every URL-bearing attribute, because pass 1 only
 *      decides whether an attribute may exist — it does not look at the value,
 *      so `href="javascript:…"` would otherwise survive.
 *
 * Note this runs on save, not on read: the ~1k articles imported from
 * WordPress keep the HTML they already have. Editing an old article does
 * re-sanitise it, so an imported article that relied on inline `style` will
 * lose it the first time someone saves an edit. That is the intended trade —
 * the imported markup is trusted, anything re-submitted through the form is
 * not.
 */
import { ELEMENT_NODE, transformSync, walkSync, type Node } from 'ultrahtml';
import sanitize from 'ultrahtml/transformers/sanitize';

/** Tags an article body may contain. Anything else is unwrapped or dropped. */
const ALLOW_ELEMENTS = [
  'p',
  'br',
  'hr',
  'div',
  'span',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'sub',
  'sup',
  'mark',
  'small',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  'blockquote',
  'pre',
  'code',
  'a',
  'img',
  'figure',
  'figcaption',
  'picture',
  'source',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
  'colgroup',
  'col',
  'iframe',
];

/**
 * Tags removed *with their children* rather than unwrapped. Without this,
 * `<script>alert(1)</script>` would drop the tag but keep `alert(1)` as
 * visible text — harmless, but it would litter the article.
 */
const DROP_ELEMENTS = [
  'script',
  'style',
  'noscript',
  'template',
  'object',
  'embed',
  'applet',
  'form',
  'input',
  'button',
  'select',
  'textarea',
  'link',
  'meta',
  'base',
];

/**
 * Attribute name → tags it survives on. Deliberately absent: `style` (inline
 * positioning is a clickjacking surface), every `on*` handler, and `srcset`
 * (a second URL list that would need its own parser).
 */
const ALLOW_ATTRIBUTES: Record<string, string[]> = {
  href: ['a'],
  src: ['img', 'iframe', 'source'],
  alt: ['img'],
  title: ['a', 'img', 'iframe', 'abbr'],
  width: ['img', 'iframe', 'table', 'td', 'th'],
  height: ['img', 'iframe'],
  loading: ['img', 'iframe'],
  decoding: ['img'],
  target: ['a'],
  rel: ['a'],
  class: ALLOW_ELEMENTS,
  id: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'section', 'a', 'p'],
  colspan: ['td', 'th'],
  rowspan: ['td', 'th'],
  scope: ['td', 'th'],
  span: ['col', 'colgroup'],
  type: ['ol'],
  start: ['ol'],
  reversed: ['ol'],
  datetime: ['time'],
  cite: ['blockquote'],
  allow: ['iframe'],
  allowfullscreen: ['iframe'],
  frameborder: ['iframe'],
  media: ['source'],
};

/** Attributes whose value is a URL and must be scheme-checked in pass 2. */
const URL_ATTRIBUTES = ['href', 'src', 'cite'];

/** URL schemes an author may link to. */
const SAFE_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

/**
 * Hosts allowed in an `<iframe src>`. An iframe pointing anywhere else is
 * dropped: article embeds in practice mean video and maps, and an unrestricted
 * iframe is a phishing surface on our own origin.
 */
const IFRAME_HOSTS = [
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
  'open.spotify.com',
  'w.soundcloud.com',
  'maps.google.com',
  'www.google.com',
];

/**
 * True for a URL that is safe to emit. Relative URLs (`/x`, `#x`, `?x`) are
 * fine by construction; absolute ones must carry an allowed scheme.
 *
 * The leading-control-character strip matters: browsers ignore NUL/newline/tab
 * inside a scheme, so `java\nscript:alert(1)` runs as `javascript:`.
 */
function isSafeUrl(value: string): boolean {
  // eslint-disable-next-line no-control-regex
  const url = value.replace(/[\u0000-\u0020]/g, '').toLowerCase();
  if (url === '') return false;
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) return true;
  // A colon before any slash/question/hash means an explicit scheme.
  const colon = url.indexOf(':');
  if (colon === -1) return true; // bare relative path, e.g. "images/x.jpg"
  const firstSlash = url.search(/[/?#]/);
  if (firstSlash !== -1 && firstSlash < colon) return true; // colon is inside the path
  return SAFE_SCHEMES.includes(url.slice(0, colon + 1));
}

/** True if an `<iframe src>` points at one of the embed hosts above. */
function isAllowedIframe(value: string): boolean {
  try {
    // Protocol-relative embeds ("//www.youtube.com/…") are still common in
    // imported WordPress markup, so give the parser a base to resolve against.
    const url = new URL(value, 'https://changingireland.ie');
    return url.protocol === 'https:' && IFRAME_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

/**
 * Pass 2. Runs after the element allowlist, over the tree ultrahtml pruned.
 *
 * This pass — not ultrahtml — is what enforces the attribute allowlist.
 * ultrahtml's `allowAttributes` is default-*allow*: it only exempts an
 * attribute from `dropAttributes`, so anything you simply don't mention (every
 * `on*` handler, `style`) survives. Verified against its source, so the
 * allowlist is applied here explicitly instead.
 *
 * Unsafe URLs lose the attribute rather than the element, so a bad link
 * degrades to plain text instead of the paragraph vanishing.
 */
function enforceAttributes(doc: Node): Node {
  walkSync(doc, (node) => {
    if (node.type !== ELEMENT_NODE) return;
    const attrs = node.attributes as Record<string, string>;

    // Deny by default: an attribute survives only if this tag is listed for it.
    for (const name of Object.keys(attrs)) {
      if (!ALLOW_ATTRIBUTES[name.toLowerCase()]?.includes(node.name)) delete attrs[name];
    }

    for (const name of URL_ATTRIBUTES) {
      if (name in attrs && !isSafeUrl(attrs[name])) delete attrs[name];
    }

    if (node.name === 'iframe') {
      // An iframe with no usable src is an empty box — drop the whole element
      // by turning it into an empty fragment of children.
      if (!attrs.src || !isAllowedIframe(attrs.src)) {
        node.name = 'span';
        node.children = [];
        for (const key of Object.keys(attrs)) delete attrs[key];
      }
    }

    // Anything opening a new tab must not hand the opener a window reference.
    if (node.name === 'a' && attrs.target === '_blank') {
      attrs.rel = attrs.rel?.includes('noopener') ? attrs.rel : `${attrs.rel ?? ''} noopener noreferrer`.trim();
    }
  });
  return doc;
}

/**
 * Sanitise an article body. Returns HTML safe to render with `set:html`.
 * Empty input short-circuits so a blank article doesn't cost a parse.
 */
export function sanitizeArticleHtml(html: string): string {
  if (!html.trim()) return '';
  return transformSync(html, [
    // Element filtering only — see enforceAttributes for why attributes are
    // not delegated to this transformer.
    sanitize({
      allowElements: ALLOW_ELEMENTS,
      dropElements: DROP_ELEMENTS,
      allowComments: false,
      allowComponents: false,
      allowCustomElements: false,
    }),
    enforceAttributes,
  ]);
}
