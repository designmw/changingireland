#!/usr/bin/env node
/**
 * Turn the cached WordPress pages (scripts/data/wp-pages.json, fetched by
 * import-wordpress.mjs) into clean JSON content files in src/data/wp-pages/.
 * The [slug].astro route falls back to these when no post matches, so the old
 * WordPress page URLs (/about-us, /volunteering, …) keep working.
 *
 * Pages rebuilt natively (home, magazines, news, contact) and WP artifacts
 * (login-customizer) are skipped. Elementor's markup is reduced to plain
 * semantic HTML: styles/scripts and all class/style/data attributes are
 * stripped so the site's own typography takes over.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'data', 'wp-pages');
const SKIP = new Set(['home', 'magazines', 'news', 'contact-us', 'login-customizer', 'videos']);

const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'data', 'wp-pages.json'), 'utf8'));
fs.mkdirSync(OUT, { recursive: true });

const decode = (s) =>
  String(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

function clean(html) {
  let s = String(html);
  s = s.replace(/<(style|script|noscript)[\s\S]*?<\/\1>/gi, '');
  // Elementor's decorative inline SVGs (icons, dividers, back-to-top arrows)
  // are sized by classes we strip, so they'd render enormous — drop them.
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<\/?(?:section|span)[^>]*>/gi, ''); // Elementor wrapper soup
  // Strip presentational attributes; keep href/src/alt/title/width/height etc.
  s = s.replace(/\s(?:class|style|id|data-[\w-]+|aria-hidden|decoding|loading|sizes|srcset|role)="[^"]*"/gi, '');
  // Internal links become root-relative
  s = s.replace(/https?:\/\/(?:www\.)?changingireland\.ie\//g, '/');
  // Media serves from R2 via /files/uploads/… (with an origin fallback in
  // the route until the mirror has run)
  s = s.replace(/\/wp-content\/uploads\//g, '/files/uploads/');
  // Give un-titled YouTube iframes an accessible name
  s = s.replace(/<iframe(?![^>]*\btitle=)/gi, '<iframe title="Embedded video"');
  // One h1 per page: the layout renders the title, so demote any h1s inside
  s = s.replace(/<(\/?)h1\b/gi, '<$1h2');
  // Collapse now-empty divs (a few passes to unwind nesting)
  for (let i = 0; i < 6; i++) s = s.replace(/<div[^>]*>\s*<\/div>/gi, '');
  s = s.replace(/(<div[^>]*>\s*)+/gi, '<div>').replace(/(\s*<\/div>)+/gi, '</div>\n');
  // Empty paragraphs/headings and <br> runs leave big dead gaps once the
  // Elementor spacing CSS is gone — drop them.
  for (let i = 0; i < 3; i++) s = s.replace(/<(p|h[1-6]|li)[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, '');
  s = s.replace(/(?:<br\s*\/?>\s*){2,}/gi, '<br />');
  return s.trim();
}

const excerptOf = (html, limit = 158) => {
  const text = decode(String(html).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
  return text.length <= limit ? text : text.slice(0, limit).replace(/\s+\S*$/, '');
};

const slugifyId = (s) =>
  decode(s.replace(/<[^>]+>/g, ''))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

/**
 * Give every h2 an id and collect them as the page's section list (drives the
 * "On this page" sidebar). An opening h2 that just repeats the page title is
 * dropped — the layout renders the title itself.
 */
function sectionise(html, pageTitle) {
  const sections = [];
  const seen = new Set();
  let first = true;
  const out = html.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (whole, inner) => {
    const text = decode(inner.replace(/<[^>]+>/g, ''))
      .replace(/\s+/g, ' ')
      .trim();
    if (first) {
      first = false;
      if (text.toLowerCase() === pageTitle.toLowerCase()) return '';
    }
    let id = slugifyId(text) || 'section';
    while (seen.has(id)) id = `${id}-x`;
    seen.add(id);
    sections.push({ id, title: text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, sections };
}

let n = 0;
for (const p of pages) {
  if (SKIP.has(p.slug) || !p.content?.rendered) continue;
  const title = decode(p.title?.rendered ?? p.slug);
  const { html, sections } = sectionise(clean(p.content.rendered), title);
  const data = {
    slug: p.slug,
    title,
    description: excerptOf(p.content.rendered),
    sections,
    html,
  };
  fs.writeFileSync(path.join(OUT, `${p.slug}.json`), JSON.stringify(data, null, 1));
  n++;
}
console.log(`${n} pages written to src/data/wp-pages/`);
