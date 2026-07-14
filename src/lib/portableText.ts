import type { PTBlock, PTSpan } from './types';

/** Minimal Portable Text → HTML renderer for the block styles the studio produces.
 *  Kept dependency-free; swap for astro-portabletext if richer content is needed. */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSpan(span: PTSpan, block: PTBlock): string {
  let html = escapeHtml(span.text).replace(/\n/g, '<br />');
  for (const mark of span.marks ?? []) {
    if (mark === 'strong') html = `<strong>${html}</strong>`;
    else if (mark === 'em') html = `<em>${html}</em>`;
    else if (mark === 'code') html = `<code>${html}</code>`;
    else {
      const def = block.markDefs?.find((d) => d._key === mark);
      if (def?._type === 'link' && def.href) {
        const href = escapeHtml(def.href);
        html = `<a href="${href}" class="link-underline text-bronze-700" rel="noopener">${html}</a>`;
      }
    }
  }
  return html;
}

const styleTag: Record<string, string> = {
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  blockquote: 'blockquote',
  normal: 'p',
};

export function renderPortableText(blocks: PTBlock[] | undefined): string {
  if (!blocks?.length) return '';
  const out: string[] = [];
  let listTag: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (listTag) {
      out.push(`</${listTag}>`);
      listTag = null;
    }
  };

  for (const block of blocks) {
    if (block._type !== 'block') continue;
    const inner = block.children.map((c) => renderSpan(c, block)).join('');

    if (block.listItem) {
      const tag = block.listItem === 'number' ? 'ol' : 'ul';
      if (listTag !== tag) {
        closeList();
        out.push(`<${tag}>`);
        listTag = tag;
      }
      out.push(`<li>${inner}</li>`);
      continue;
    }

    closeList();
    const tag = styleTag[block.style ?? 'normal'] ?? 'p';
    out.push(`<${tag}>${inner}</${tag}>`);
  }
  closeList();
  return out.join('\n');
}

/** Convenience for seed data: plain paragraphs → Portable Text blocks. */
export function paragraphs(...texts: string[]): PTBlock[] {
  return texts.map((text) => ({
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', text }],
  }));
}
