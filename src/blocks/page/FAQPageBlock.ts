import type { Block } from 'payload';

export const FAQPageBlock: Block = {
  slug: 'page-faq',
  interfaceName: 'FAQPageBlock',
  labels: { singular: 'FAQ Accordion', plural: 'FAQ Accordions' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'bordered',
      options: [
        { label: 'Bordered (default)', value: 'bordered' },
        { label: 'Cards', value: 'cards' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'surface',
      type: 'select',
      required: true,
      defaultValue: 'sand',
      options: [
        { label: 'Sand', value: 'sand' },
        { label: 'Subtle', value: 'subtle' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      maxLength: 100,
    },
    {
      name: 'faqs',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 12,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          localized: true,
        },
      ],
    },
  ],
};
