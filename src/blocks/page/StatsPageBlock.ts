import type { Block } from 'payload';

export const StatsPageBlock: Block = {
  slug: 'page-stats',
  interfaceName: 'StatsPageBlock',
  labels: { singular: 'Stats Row', plural: 'Stats Rows' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Inline', value: 'inline' },
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
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          localized: true,
          maxLength: 20,
          admin: { description: 'ej: 80%, 12+, 3 años' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          maxLength: 30,
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
          maxLength: 100,
        },
      ],
    },
    {
      name: 'sourceCitation',
      type: 'text',
      localized: true,
      maxLength: 200,
      admin: { description: 'Fuente o cita del dato estadístico' },
    },
  ],
};
