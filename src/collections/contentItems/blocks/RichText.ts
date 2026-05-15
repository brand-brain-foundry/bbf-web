import type { Block } from 'payload';

export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
  fields: [
    {
      name: 'body',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
};
