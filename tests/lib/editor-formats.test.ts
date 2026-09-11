// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import Quill from 'quill';
import { bindEditorContent } from '~/lib/editor-content';
import {
  captionToText,
  imageToFigure,
  installClipboardMatchers,
  registerEditorFormats,
  replaceImageSource,
  sanitizeCaption,
  textToCaption,
} from '~/lib/editor-formats';

registerEditorFormats();

/**
 * Mirror RichEditor.astro: open stored article HTML in the editor, make one
 * visual edit (by default typing a character), and return what would be saved.
 */
function openAndEdit(html: string, edit: (quill: Quill) => void = (quill) => quill.insertText(0, 'X', 'user')) {
  const mount = document.createElement('div');
  document.body.appendChild(mount);
  const quill = new Quill(mount);
  installClipboardMatchers(quill);
  const source = document.createElement('textarea');
  source.value = html;
  bindEditorContent(quill, source);
  edit(quill);
  const saved = source.value;
  mount.remove();
  return saved;
}

describe('captioned pictures', () => {
  it('keeps an imported caption, its formatting and a linked picture through an edit', () => {
    const saved = openAndEdit(
      '<p>Intro</p><figure aria-describedby="c1"><a href="/files/big.jpg"><img src="/files/photo.webp" alt="Volunteers" width="1024" height="683"></a><figcaption id="c1">Photo by <em>Someone</em></figcaption></figure><p>After</p>'
    );
    expect(saved).toMatch(
      /<p>XIntro<\/p><figure><a href="\/files\/big\.jpg"><img [^>]*><\/a><figcaption>Photo by <em>Someone<\/em><\/figcaption><\/figure><p>After<\/p>/
    );
    expect(saved).toContain('src="/files/photo.webp"');
    expect(saved).toContain('alt="Volunteers"');
    expect(saved).not.toContain('<p>Photo by');
    expect(saved).not.toContain('contenteditable');
    expect(saved).not.toContain('target=');
  });

  it("keeps a figure's alignment, size and decorative empty alt", () => {
    const saved = openAndEdit(
      '<p>Intro</p><figure class="ql-align-right"><img src="/p.webp" alt="" class="ci-img-thumb"><figcaption>Credit</figcaption></figure>'
    );
    expect(saved).toContain('<figure class="ql-align-right">');
    expect(saved).toContain('class="ci-img-thumb"');
    expect(saved).toContain('alt=""');
    expect(saved).toContain('<figcaption>Credit</figcaption>');
  });

  it('keeps a new-tab link on a picture', () => {
    const saved = openAndEdit(
      '<p>Intro</p><figure><a href="https://example.org/" target="_blank"><img src="/p.webp"></a></figure>'
    );
    expect(saved).toMatch(/<a href="https:\/\/example\.org\/" target="_blank" rel="noopener noreferrer"><img/);
  });

  it('adds a caption to a picture on its own line without leaving an empty paragraph', () => {
    let index = -2;
    const saved = openAndEdit(
      '<p>Before</p><p class="ql-align-center"><img src="/p.webp" alt="A" class="ci-img-medium"></p><p>After</p>',
      (quill) => {
        index = imageToFigure(quill, 'Before\n'.length, textToCaption('Credit & thanks'));
      }
    );
    expect(index).toBe(7);
    expect(saved).toMatch(
      /^<p>Before<\/p><figure class="ql-align-center"><img [^>]*><figcaption>Credit &amp; thanks<\/figcaption><\/figure><p>After<\/p>$/
    );
    expect(saved).toContain('alt="A"');
    expect(saved).toContain('class="ci-img-medium"');
  });

  it('adds a caption to a picture inside a link, keeping the link', () => {
    const saved = openAndEdit('<p>Before</p><p><a href="/big.jpg"><img src="/p.webp"></a></p><p>After</p>', (quill) => {
      imageToFigure(quill, 'Before\n'.length, 'Credit');
    });
    expect(saved).toMatch(
      /<figure><a href="\/big\.jpg"><img src="\/p\.webp"><\/a><figcaption>Credit<\/figcaption><\/figure>/
    );
  });

  it('adds a caption to a picture in the middle of a paragraph, keeping the words', () => {
    let index = -2;
    const saved = openAndEdit('<p>Left <img src="/p.webp"> right</p>', (quill) => {
      index = imageToFigure(quill, 'Left '.length, 'Cap');
    });
    expect(index).toBeGreaterThanOrEqual(5);
    expect(saved).toMatch(
      /<p>Left\s*<\/p><figure><img src="\/p\.webp"><figcaption>Cap<\/figcaption><\/figure><p>\s*right<\/p>/
    );
  });

  it('removes a caption when it is cleared', () => {
    const saved = openAndEdit(
      '<p>Intro</p><figure><img src="/p.webp"><figcaption>Credit</figcaption></figure>',
      (quill) => quill.formatText('Intro\n'.length, 1, 'caption', false, 'user')
    );
    expect(saved).toContain('<figure><img src="/p.webp"></figure>');
  });

  it('replaces the picture but keeps its caption, size, link and alignment', () => {
    const saved = openAndEdit(
      '<p>Intro</p><figure class="ql-align-right"><a href="/x"><img src="/old.webp" width="1024" height="683" class="ci-img-thumb"></a><figcaption>Credit</figcaption></figure>',
      (quill) => replaceImageSource(quill, 'Intro\n'.length, '/new.webp')
    );
    expect(saved).toMatch(
      /<figure class="ql-align-right"><a href="\/x"><img src="\/new\.webp" class="ci-img-thumb"><\/a><figcaption>Credit<\/figcaption><\/figure>/
    );
    expect(saved).not.toContain('width="1024"');
  });
});

describe('caption text', () => {
  it('keeps italics, bold, links and line breaks, and drops everything else', () => {
    expect(
      sanitizeCaption(
        'Photo <em>by</em> <strong>X</strong><br><a href="https://x.ie" target="_blank" onclick="evil()">site</a>' +
          '<script>alert(1)</script><span style="color:red">kept</span><img src=x onerror="alert(1)">' +
          '<a href="javascript:alert(1)">bad</a>'
      )
    ).toBe(
      'Photo <em>by</em> <strong>X</strong><br><a href="https://x.ie" target="_blank" rel="noopener noreferrer">site</a>keptbad'
    );
  });

  it('converts between caption HTML and editable text', () => {
    expect(captionToText('Photo by <em>Someone</em><br>Dublin')).toBe('Photo by Someone Dublin');
    expect(textToCaption(' <b>x</b> & y ')).toBe('&lt;b&gt;x&lt;/b&gt; &amp; y');
  });

  it('never runs markup from a stored caption inside the editor', () => {
    const saved = openAndEdit(
      '<p>Intro</p><figure><img src="/p.webp"><figcaption>Hi<img src=x onerror="window.__pwned=1"></figcaption></figure>'
    );
    expect(saved).toContain('<figcaption>Hi</figcaption>');
    expect((window as unknown as { __pwned?: number }).__pwned).toBeUndefined();
  });
});

describe('links and picture sizes', () => {
  it('keeps same-tab and new-tab links as they were', () => {
    const saved = openAndEdit('<p><a href="/a">same</a> and <a href="https://b.ie" target="_blank">new</a></p>');
    const same = saved.match(/<a href="\/a"[^>]*>/)?.[0] ?? '';
    const newTab = saved.match(/<a href="https:\/\/b\.ie"[^>]*>/)?.[0] ?? '';
    expect(same).not.toBe('');
    expect(same).not.toContain('target=');
    expect(newTab).toContain('target="_blank"');
  });

  it('keeps an ordinary picture size', () => {
    expect(openAndEdit('<p>Intro <img src="/p.webp" class="ci-img-thumb"></p>')).toContain('class="ci-img-thumb"');
  });
});
