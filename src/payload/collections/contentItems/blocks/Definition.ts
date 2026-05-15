import type { Block } from 'payload';

export const DefinitionBlock: Block = {
  slug: 'definition',
  labels: { singular: 'Definition', plural: 'Definitions' },
  fields: [
    {
      name: 'term',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'definition',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 500,
    },
    {
      name: 'relatedEntityRef',
      type: 'relationship',
      relationTo: 'entities',
      admin: { description: 'Schema.org DefinedTerm linked to entity' },
    },
  ],
};
