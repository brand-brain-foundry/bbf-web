import type { Block } from 'payload';

export const ComparisonTableBlock: Block = {
  slug: 'comparison-table',
  labels: { singular: 'Comparison Table', plural: 'Comparison Tables' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'columns',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 5,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Visually highlights this column as the recommended option' },
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'values',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'value',
              type: 'text',
              localized: true,
              admin: { description: 'Use "✓", "✗", or descriptive text' },
            },
          ],
        },
      ],
    },
  ],
};
