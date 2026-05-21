import type { Block } from 'payload';

export const HeroPageBlock: Block = {
  slug: 'page-hero',
  interfaceName: 'HeroPageBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Left Aligned', value: 'left-aligned' },
        { label: 'Split (text + media)', value: 'split' },
      ],
    },
    {
      name: 'surface',
      type: 'select',
      required: true,
      defaultValue: 'sand',
      options: [
        { label: 'Sand (claro)', value: 'sand' },
        { label: 'Dark', value: 'dark' },
        { label: 'Gradient', value: 'gradient' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      maxLength: 40,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 120,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      maxLength: 240,
    },
    {
      name: 'ctaPrimary',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
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
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data) => data?.variant === 'split' },
    },
    {
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Right', value: 'right' },
        { label: 'Left', value: 'left' },
      ],
      admin: { condition: (data) => data?.variant === 'split' },
    },
  ],
};
