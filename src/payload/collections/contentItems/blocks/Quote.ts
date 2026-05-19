import type { Block } from 'payload';

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Quote', plural: 'Quotes' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'author',
      type: 'text',
      localized: true,
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
    },
    {
      name: 'source',
      type: 'text',
      localized: true,
      admin: { description: 'Publication, book, or context of the quote' },
    },
  ],
};
