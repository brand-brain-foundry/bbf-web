import type { Block } from 'payload';

export const CustomHtmlBlock: Block = {
  slug: 'custom-html',
  labels: { singular: 'Custom HTML', plural: 'Custom HTML Blocks' },
  fields: [
    {
      name: 'html',
      type: 'code',
      required: true,
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
      admin: {
        language: 'html',
        description: 'Raw HTML — sanitized server-side before render. Admins only.',
      },
    },
    {
      name: 'label',
      type: 'text',
      admin: { description: 'Internal label for identifying this block in the admin UI' },
    },
  ],
};
