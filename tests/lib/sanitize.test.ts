import { describe, expect, it } from 'vitest';
import { sanitizeArticleHtml } from '~/lib/sanitize';

describe('article HTML details', () => {
  it('preserves article headings, links and image alt text', () => {
    const html = sanitizeArticleHtml(
      '<h2>Details</h2><p><a href="https://example.com">Source</a><img src="/files/photo.webp" alt="Volunteers"></p>'
    );
    expect(html).toContain('<h2>Details</h2>');
    expect(html).toContain('alt="Volunteers"');
    expect(html).toContain('href="https://example.com"');
  });
  it('removes scripts, handlers and javascript links', () => {
    const html = sanitizeArticleHtml(
      '<script>alert(1)</script><img src="/files/photo.webp" onerror="alert(1)"><a href="javascript:alert(1)">Link</a>'
    );
    expect(html).not.toMatch(/script|onerror|alert/);
  });
  it('rejects unapproved iframes', () => {
    expect(sanitizeArticleHtml('<iframe src="https://example.com"></iframe>')).not.toContain('iframe');
  });
  it('keeps an approved video embed', () => {
    expect(sanitizeArticleHtml('<iframe src="https://www.youtube.com/embed/abc"></iframe>')).toContain('iframe');
  });
  it('rejects entity-encoded script URLs', () => {
    expect(sanitizeArticleHtml('<a href="java&#x73;cript:alert(1)">Link</a>')).not.toContain('href');
  });
});

describe('URL canonicalisation regressions', () => {
  it.each([
    'java&#115;cript:alert(1)',
    'javascript&colon;alert(1)',
    'java&Tab;script:alert(1)',
    '&#106avascript:alert(1)',
    'java\nscript:alert(1)',
  ])('removes encoded unsafe URLs: %s', (url) => {
    expect(sanitizeArticleHtml(`<a HREF="${url}">Link</a>`)).not.toMatch(/href=/i);
  });
  it('preserves safely encoded query parameters', () => {
    expect(sanitizeArticleHtml('<a href="https://example.com/?a=1&amp;b=2">Source</a>')).toContain('href=');
  });
});
