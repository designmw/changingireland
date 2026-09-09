// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import Quill from 'quill';
import { bindEditorContent } from '~/lib/editor-content';

/** Reproduce RichEditor.astro's load + immediate sync, without submitting a form. */
function roundTrip(html: string) {
  const mount = document.createElement('div');
  document.body.appendChild(mount);
  const editor = new Quill(mount);
  const source = document.createElement('textarea');
  source.value = html;
  bindEditorContent(editor, source);
  const result = source.value;
  mount.remove();
  return result;
}

describe('stored article content through the visual editor', () => {
  it('keeps ordinary headings and image descriptions', () => {
    const html = roundTrip('<h2>Heading</h2><p>Text<img src="/files/photo.webp" alt="Volunteers"></p>');
    expect(html).toContain('<h2>Heading</h2>');
    expect(html).toContain('alt="Volunteers"');
  });
  it('preserves a figure caption when opening an existing article', () => {
    const html = roundTrip(
      '<figure><img src="/files/photo.webp" alt="Photo"><figcaption>Photo credit</figcaption></figure>'
    );
    expect(html).toContain('<figcaption>');
  });
});

it('saves deliberate visual edits and preserves raw edits across toggles', () => {
  const mount = document.createElement('div');
  document.body.appendChild(mount);
  const editor = new Quill(mount);
  const source = document.createElement('textarea');
  source.value = '<p>Original</p>';
  const binding = bindEditorContent(editor, source);
  editor.insertText(0, 'Updated ', 'user');
  expect(source.value).toContain('Updated Original');
  binding.setRaw(true);
  source.value = '<figure><img src="/photo.webp"><figcaption>Credit</figcaption></figure>';
  binding.setRaw(false);
  expect(source.value).toContain('<figcaption>Credit</figcaption>');
  mount.remove();
});
