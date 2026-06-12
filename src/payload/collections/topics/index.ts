import type { CollectionConfig } from 'payload';
import { isAdminOrEditor, publicRead } from '@/payload/lib/access';
import { slugRegex } from '@/payload/lib/utils/ulid';

export const Topics: CollectionConfig = {
  slug: 'topics',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['slug', 'kind', 'parentTopic', 'status'],
    group: 'Primitives',
  },
  access: {
    create: isAdminOrEditor,
    read: publicRead,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (v: unknown) =>
        (typeof v === 'string' && slugRegex.test(v)) || 'Slug debe ser kebab-case',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
      maxLength: 200,
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'concept',
      options: [
        { label: 'Concept', value: 'concept' },
        { label: 'Tool', value: 'tool' },
        { label: 'Sector', value: 'sector' },
        { label: 'Method', value: 'method' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'parentTopic',
      type: 'relationship',
      relationTo: 'topics',
      admin: { description: 'null = top-level' },
    },
    {
      name: 'representedBy',
      type: 'relationship',
      relationTo: 'entities',
      admin: { description: 'Si el topic ES una entity (ej. concept entity)' },
    },
    {
      name: 'searchKeywords',
      type: 'array',
      localized: true,
      fields: [{ name: 'keyword', type: 'text', required: true }],
    },
    {
      name: 'wikidataQID',
      type: 'text',
      admin: { description: 'Q12345 si tiene Wikidata' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Deprecated', value: 'deprecated' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
};
