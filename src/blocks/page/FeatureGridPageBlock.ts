import type { Block } from 'payload';

export const FeatureGridPageBlock: Block = {
  slug: 'page-feature-grid',
  interfaceName: 'FeatureGridPageBlock',
  labels: { singular: 'Feature Grid', plural: 'Feature Grids' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'cards',
      options: [
        { label: 'Cards (con border)', value: 'cards' },
        { label: 'Clean (sin border)', value: 'clean' },
        { label: 'Bordered (divisores)', value: 'bordered' },
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
      name: 'subtitle',
      type: 'text',
      localized: true,
      maxLength: 200,
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 8,
      fields: [
        {
          name: 'iconType',
          type: 'select',
          dbName: 'pg_feat_grid_icon_type',
          options: [
            { label: 'Lucide icon', value: 'lucide' },
            { label: 'Upload', value: 'upload' },
          ],
        },
        {
          name: 'iconLucide',
          type: 'text',
          admin: { condition: (data) => data?.iconType === 'lucide' },
        },
        {
          name: 'iconUpload',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (data) => data?.iconType === 'upload' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          maxLength: 80,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          maxLength: 200,
        },
        {
          name: 'linkLabel',
          type: 'text',
          localized: true,
        },
        {
          name: 'linkHref',
          type: 'text',
        },
      ],
    },
  ],
};
