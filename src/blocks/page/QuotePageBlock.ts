import type { Block } from 'payload';

export const QuotePageBlock: Block = {
  slug: 'page-quote',
  interfaceName: 'QuotePageBlock',
  labels: { singular: 'Quote / Testimonial', plural: 'Quotes / Testimonials' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Card', value: 'card' },
        { label: 'Inline', value: 'inline' },
      ],
    },
    {
      name: 'surface',
      type: 'select',
      required: true,
      defaultValue: 'sand',
      options: [
        { label: 'Sand', value: 'sand' },
        { label: 'Dark', value: 'dark' },
        { label: 'Subtle', value: 'subtle' },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 400,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorRole',
      type: 'text',
      localized: true,
    },
    {
      name: 'authorCompany',
      type: 'text',
    },
    {
      name: 'authorAvatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'context',
      type: 'text',
      localized: true,
      admin: { description: 'ej: "Caso Sivar Brains 2026"' },
    },
  ],
};
