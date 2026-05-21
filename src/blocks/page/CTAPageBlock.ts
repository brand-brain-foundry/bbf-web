import type { Block } from 'payload';

export const CTAPageBlock: Block = {
  slug: 'page-cta',
  interfaceName: 'CTAPageBlock',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split (text | buttons)', value: 'split' },
        { label: 'Dark', value: 'dark' },
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
        { label: 'Gradient', value: 'gradient' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 100,
    },
    {
      name: 'subtext',
      type: 'textarea',
      localized: true,
      maxLength: 200,
    },
    {
      name: 'ctaPrimary',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'ctaSecondary',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
  ],
};
