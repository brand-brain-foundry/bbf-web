import type { Block } from 'payload';

export const LogoCloudPageBlock: Block = {
  slug: 'page-logo-cloud',
  interfaceName: 'LogoCloudPageBlock',
  labels: { singular: 'Logo Cloud', plural: 'Logo Clouds' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Marquee (scroll infinito)', value: 'marquee' },
        { label: 'Bordered', value: 'bordered' },
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
      name: 'logos',
      type: 'array',
      required: true,
      minRows: 4,
      maxRows: 24,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Alt text del logo' },
        },
        {
          name: 'logo',
          type: 'upload',
          required: true,
          relationTo: 'media',
        },
        {
          name: 'link',
          type: 'text',
          admin: { description: 'URL opcional (href)' },
        },
      ],
    },
  ],
};
