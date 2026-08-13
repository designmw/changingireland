// Transforms the flat WordPress-export HTML of a ported page (src/data/
// wp-pages/*.json) into the card-based layout of the bespoke about-us page.
//
// The exports' <div> wrappers are structural noise and are not reliably
// balanced, so they are stripped first. The remaining block elements are
// tokenized, stat pairs are folded into tiles, and tokens are grouped into
// h2 sections and h3 entries. A section with two or more entries renders as
// a grid of cards (matching about-us); anything else stays prose flow.
// Styling for the ci-* classes lives in the global style block of
// src/pages/[slug].astro.

type Token =
  | { kind: 'h2'; html: string }
  | { kind: 'h3'; html: string; text: string }
  | { kind: 'h4'; html: string; text: string }
  | { kind: 'stat'; html: string }
  | { kind: 'block'; html: string };

const BLOCK_RE =
  /<(h2|h3|h4|p|ul|ol|table|blockquote)([^>]*)>([\s\S]*?)<\/\1>|<a [^>]*>\s*<img[^>]*\/?>\s*<\/a>|<img[^>]*\/?>|<iframe[\s\S]*?<\/iframe>/g;

const NUMBERISH = /^[€£$]?\d[\d,.]*\s*(?:bn|m|k)?\s*[+x×]?$/i;

const textOf = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function tokenize(html: string): Token[] {
  // Flatten: the div wrappers carry no meaning and are unbalanced.
  const flat = html.replace(/<\/?div[^>]*>/g, '\n');
  const tokens: Token[] = [];
  let last = 0;
  const pushGap = (gap: string) => {
    // Bare text between blocks (may hold inline <strong>/<a>) becomes a <p>.
    const t = gap.replace(/\s+/g, ' ').trim();
    if (t) tokens.push({ kind: 'block', html: `<p>${t}</p>` });
  };
  for (const m of flat.matchAll(BLOCK_RE)) {
    pushGap(flat.slice(last, m.index));
    last = (m.index ?? 0) + m[0].length;
    const tag = m[1];
    if (tag === 'h2') tokens.push({ kind: 'h2', html: m[0] });
    else if (tag === 'h3') tokens.push({ kind: 'h3', html: m[0], text: textOf(m[3]) });
    else if (tag === 'h4') tokens.push({ kind: 'h4', html: m[0], text: textOf(m[3]) });
    else tokens.push({ kind: 'block', html: m[0] });
  }
  pushGap(flat.slice(last));
  return tokens;
}

const statTile = (num: string, label: string): Token => ({
  kind: 'stat',
  html: `<span class="ci-stat"><span class="ci-stat-number">${num}</span><span class="ci-stat-label">${label}</span></span>`,
});

// The exports carry stats in two shapes: `<h4>32,841</h4>` + a bare label
// line (the-community-sector), and `<h3>15,000</h3>` + `<h4>PRINT
// READERSHIP</h4>` (advertise). Both become the same tile.
function pairStats(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const n = tokens[i + 1];
    if (t.kind === 'h4' && NUMBERISH.test(t.text) && n?.kind === 'block' && /^<p>/.test(n.html)) {
      const label = textOf(n.html);
      if (label.length <= 90) {
        out.push(statTile(t.text, label));
        i++;
        continue;
      }
    }
    if (t.kind === 'h3' && NUMBERISH.test(t.text) && n?.kind === 'h4') {
      out.push(statTile(t.text, n.text));
      i++;
      continue;
    }
    out.push(t);
  }
  return out;
}

interface Entry {
  eyebrow?: string;
  titleHtml: string;
  body: Token[];
}

// An h4 that appears before any h3 in its section skips a heading level
// (h2 → h4, a WCAG heading-order failure). Render it as an h3 that keeps the
// small-eyebrow look via .ci-lead.
const leadH4 = (html: string) => html.replace(/^<h4([^>]*)>/, '<h3 class="ci-lead"$1>').replace(/<\/h4>\s*$/, '</h3>');

function demoteLeadingH4s(tokens: Token[]): Token[] {
  let seenH3 = false;
  return tokens.map((t) => {
    if (t.kind === 'h3') seenH3 = true;
    if (t.kind === 'h4' && !seenH3) return { kind: 'block', html: leadH4(t.html) };
    return t;
  });
}

// Render a token run, folding adjacent stat tiles into one row.
function renderRun(tokens: Token[]): string {
  let out = '';
  let stats: string[] = [];
  const flush = () => {
    if (stats.length) {
      out += `<div class="ci-stats">${stats.join('')}</div>`;
      stats = [];
    }
  };
  for (const t of tokens) {
    if (t.kind === 'stat') stats.push(t.html);
    else {
      flush();
      out += t.html;
    }
  }
  flush();
  return out;
}

// A short, mostly-uppercase text line — the exports use these both as entry
// meta ("SINCE 2003 · ALL-IRELAND") and as group labels between entry runs
// ("MEDIUM MONEY Tens of thousands of euro" on /funding).
function isCapsy(text: string): boolean {
  if (text.length === 0 || text.length > 80) return false;
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length < 4) return false;
  const upper = text.replace(/[^A-Z]/g, '');
  return upper.length / letters.length >= 0.6;
}

const isPlainP = (t: Token) => t.kind === 'block' && /^<p>/.test(t.html);
const innerP = (html: string) => html.replace(/^<p>/, '').replace(/<\/p>$/, '');

// h4-led entry cards, for sections whose entries are announced by an eyebrow
// h4 rather than an h3 (awards on /advice-for-groups, funds on /funding).
// Capsy paragraphs between entries become full-width group labels that split
// the grid; a capsy line directly after the h4 stays in the card as meta.
/**
 * Pull a card's first image out of its body so it can be rendered as a header.
 *
 * WordPress left images wherever the author dropped them, which in practice
 * means below the "Learn More" link on one card and mid-paragraph on the next.
 * Read down a grid of those and the images look accidental. Hoisting the first
 * one makes every card the same shape; the fixed-height, cropped-to-fill
 * treatment in the .ci-card-media CSS is what then gives them a common size.
 *
 * Only the first image moves. A card carrying several has them for a reason,
 * so the rest stay in the flow.
 */
function splitCardMedia(body: Token[]): { media: string | null; rest: Token[] } {
  // A lone image is its own token; more often WordPress wrapped it in a <p>.
  // A paragraph counts when the image is the first thing in it — either on its
  // own, or leading the text (WP's `<p><img>caption text</p>` shape). Anything
  // where the image sits mid-sentence is left alone; pulling it out would
  // change what the author wrote.
  const leading = /^<p[^>]*>\s*((?:<a [^>]*>\s*)?<img\b[^>]*>(?:\s*<\/a>)?)\s*/;

  for (let i = 0; i < body.length; i++) {
    const token = body[i];
    if (token.kind !== 'block') continue;
    const html = token.html.trim();

    if (isMedia(token)) {
      return { media: html, rest: body.filter((_, n) => n !== i) };
    }

    const match = html.match(leading);
    if (!match) continue;
    const remainder = html.slice(match[0].length).replace(/^\s*(?:<\/p>)?\s*$/, '');
    if (!remainder) {
      // The paragraph held nothing else — drop it with the image.
      return { media: match[1], rest: body.filter((_, n) => n !== i) };
    }
    // Keep the paragraph, minus the image it opened with.
    const trimmed: Token = { ...token, html: html.replace(match[0], html.startsWith('<p') ? '<p>' : '') };
    return { media: match[1], rest: body.map((t, n) => (n === i ? trimmed : t)) };
  }

  return { media: null, rest: body };
}

function renderH4Cards(tokens: Token[]): string | null {
  if (tokens.filter((t) => t.kind === 'h4').length < 2) return null;
  let out = '';
  let grid: string[] = [];
  let current: Token[] | null = null;
  const flushEntry = () => {
    if (!current) return;
    // Same header treatment as the h3 cards above.
    const { media, rest } = splitCardMedia(current);
    let body = media ? `<div class="ci-card-media">${media}</div>` : '';
    body += '<div class="ci-card-body">';
    rest.forEach((t, i) => {
      // The card's lead h4 renders as an h3 (an h4 straight after the section
      // h2 fails WCAG heading order) but keeps the eyebrow look via .ci-lead.
      if (i === 0 && t.kind === 'h4') body += leadH4(t.html);
      // The line right after the h4 is card meta when capsy.
      else if (i === 1 && isPlainP(t) && isCapsy(textOf(t.html)))
        body += `<p class="ci-card-meta">${innerP(t.html)}</p>`;
      else body += t.html;
    });
    body += '</div>';
    grid.push(`<article class="ci-card">${body}</article>`);
    current = null;
  };
  const flushGrid = () => {
    flushEntry();
    if (grid.length) {
      out += `<div class="ci-cards">${grid.join('')}</div>`;
      grid = [];
    }
  };
  for (const t of tokens) {
    if (t.kind === 'h4') {
      flushEntry();
      current = [t];
    } else if (isPlainP(t) && isCapsy(textOf(t.html)) && (!current || current.length > 1)) {
      flushGrid();
      out += `<p class="ci-group-label">${innerP(t.html)}</p>`;
    } else if (current) {
      current.push(t);
    } else {
      out += t.html;
    }
  }
  flushGrid();
  return out;
}

function renderSection(headingHtml: string | null, tokens: Token[]): string {
  const intro: Token[] = [];
  const entries: Entry[] = [];
  let pendingEyebrow: string | undefined;
  let current: Entry | null = null;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.kind === 'h3') {
      current = { eyebrow: pendingEyebrow, titleHtml: t.html, body: [] };
      pendingEyebrow = undefined;
      entries.push(current);
    } else if (t.kind === 'h4' && tokens[i + 1]?.kind === 'h3') {
      pendingEyebrow = t.text;
    } else {
      (current ? current.body : intro).push(t);
    }
  }
  let out = headingHtml ?? '';
  if (entries.length >= 2) {
    out += renderRun(demoteLeadingH4s(intro));
    out += '<div class="ci-cards">';
    for (const e of entries) {
      // The image is pulled out of the body and rendered as a header above the
      // eyebrow, so every card in the grid has the same shape.
      const { media, rest } = splitCardMedia(e.body);
      out += '<article class="ci-card">';
      if (media) out += `<div class="ci-card-media">${media}</div>`;
      // Everything but the image goes in one wrapper, so a card can put the
      // two side by side with a two-column grid instead of trying to place
      // each paragraph individually.
      out += '<div class="ci-card-body">';
      if (e.eyebrow) out += `<p class="ci-card-eyebrow">${e.eyebrow}</p>`;
      out += e.titleHtml;
      out += renderRun(rest);
      out += '</div>';
      out += '</article>';
    }
    out += '</div>';
    return out;
  }
  const h4Cards = renderH4Cards(tokens);
  if (h4Cards !== null) return out + h4Cards;
  return out + renderProse(demoteLeadingH4s(tokens));
}

const isMedia = (t: Token) => t.kind === 'block' && /^(<a [^>]*>\s*)?<img/.test(t.html);

// Prose sections with images render text-left / media-right, the about page's
// intro pattern, instead of scattering images through the text column.
function renderProse(tokens: Token[]): string {
  const media = tokens.filter(isMedia);
  const text = tokens.filter((t) => !isMedia(t));
  const textBlocks = text.filter((t) => t.kind === 'block' || t.kind === 'h3' || t.kind === 'h4').length;
  if (media.length === 0 || textBlocks < 2) return renderRun(tokens);
  return (
    '<div class="ci-split">' +
    `<div class="ci-split-text">${renderRun(text)}</div>` +
    `<div class="ci-split-media">${media.map((t) => t.html).join('')}</div>` +
    '</div>'
  );
}

/**
 * Cap each image at its own intrinsic width, so that when a layout stretches
 * images to fill their container a 300px logo is not blown up to 400px of
 * blur. The ported pages mix 2000px+ photographs with 225-300px logos, and
 * WordPress kept the real dimensions in the width attribute.
 *
 * Sets `height: auto` and deliberately does NOT set a width. An inline width
 * would beat every stylesheet rule, including the `width: auto` that card
 * layouts rely on to stay in proportion — that is exactly how an earlier
 * version of this stretched 2048x1536 photographs into 388x144 letterboxes.
 * Which layouts fill their width is decided in CSS, where the cascade can
 * still be reasoned about.
 */
function sizeImages(html: string): string {
  // Card header images are governed entirely by CSS — they fill a fixed box and
  // crop. An inline max-width/height here would outrank that (inline beats the
  // stylesheet), so those blocks are passed over.
  return html
    .split(/(<div class="ci-card-media">[\s\S]*?<\/div>)/)
    .map((chunk) => (chunk.startsWith('<div class="ci-card-media">') ? chunk : sizeFlowImages(chunk)))
    .join('');
}

function sizeFlowImages(html: string): string {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    const width = Number(tag.match(/\bwidth="(\d+)"/)?.[1] ?? 0);
    if (!width || /style="/.test(tag)) return tag;
    return tag.replace(/<img\b/, `<img style="height:auto;max-width:min(100%, ${width}px)"`);
  });
}

export function renderWpBody(html: string): string {
  const tokens = pairStats(tokenize(html));
  const sections: { heading: string | null; tokens: Token[] }[] = [{ heading: null, tokens: [] }];
  for (const t of tokens) {
    if (t.kind === 'h2') sections.push({ heading: t.html, tokens: [] });
    else sections[sections.length - 1].tokens.push(t);
  }
  return sizeImages(
    sections
      .filter((s) => s.heading !== null || s.tokens.length > 0)
      .map((s) => renderSection(s.heading, s.tokens))
      .join('')
  );
}
