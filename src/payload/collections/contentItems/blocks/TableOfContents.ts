import type { Block } from 'payload';

export const TableOfContentsBlock: Block = {
  slug: 'table-of-contents',
  labels: { singular: 'Table of Contents', plural: 'Tables of Contents' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      defaultValue: 'En este artículo',
      admin: { description: 'Heading shown above the TOC' },
    },
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (from headings)', value: 'auto' },
        { label: 'Manual', value: 'manual' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        description: 'Required only when mode is manual',
        condition: (data) => data?.mode === 'manual',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'anchor',
          type: 'text',
          required: true,
          admin: { description: 'ID of the heading element (without #)' },
        },
      ],
    },
  ],
};
