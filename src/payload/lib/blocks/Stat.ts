import type { Block } from 'payload';

export const StatBlock: Block = {
  slug: 'stat',
  labels: { singular: 'Stat', plural: 'Stats' },
  fields: [
    {
      name: 'number',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'e.g. "87%", "3x", "$2M"' },
    },
    {
      name: 'unit',
      type: 'text',
      localized: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'context',
      type: 'text',
      localized: true,
      admin: { description: 'Source or qualifying context for the claim' },
    },
  ],
};
