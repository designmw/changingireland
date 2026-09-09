import type Quill from 'quill';

/** Keep the submitted original intact until a visual edit actually occurs. */
export function bindEditorContent(quill: Quill, source: HTMLTextAreaElement) {
  let raw = false;
  const loadVisual = () => {
    quill.setContents(quill.clipboard.convert({ html: source.value }), 'silent');
  };
  loadVisual();
  quill.on('text-change', () => {
    if (raw) return;
    const html = quill.getSemanticHTML().replace(/&nbsp;|\u00a0/g, ' ');
    source.value = html === '<p></p>' ? '' : html;
  });
  return {
    setRaw(value: boolean) {
      // Silent import must never replace the authoritative original/raw HTML.
      if (!value) loadVisual();
      raw = value;
    },
  };
}
