import type { Block } from 'payload';

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'href',
      type: 'text',
      required: true,
    },
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Ghost', value: 'ghost' },
      ],
    },
    {
      name: 'external',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
};
