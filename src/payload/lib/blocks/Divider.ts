import type { Block } from 'payload';

export const DividerBlock: Block = {
  slug: 'divider',
  labels: { singular: 'Divider', plural: 'Dividers' },
  fields: [
    {
      name: 'label',
      type: 'text',
      localized: true,
      admin: { description: 'Optional section label rendered alongside the divider' },
    },
  ],
};
