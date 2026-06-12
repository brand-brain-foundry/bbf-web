import type { CollectionConfig } from 'payload';
import { isAdminOrEditor, publicRead } from '@/payload/lib/access';
import { slugRegex } from '@/payload/lib/utils/ulid';

export const Entities: CollectionConfig = {
  slug: 'entities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'slug', 'status'],
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
      validate: (v: unknown) => {
        if (typeof v !== 'string') return 'Slug debe ser string';
        if (!slugRegex.test(v)) return 'Slug debe ser kebab-case';
        return true;
      },
      admin: {
        description: 'kebab-case, único globalmente (ej. zavala, bbf)',
      },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Organization', value: 'organization' },
        { label: 'Person', value: 'person' },
        { label: 'Concept', value: 'concept' },
        { label: 'Tool', value: 'tool' },
        { label: 'Place', value: 'place' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'alternateNames',
      type: 'array',
      localized: true,
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
      maxLength: 300,
    },
    {
      name: 'longDescription',
      type: 'richText',
      localized: true,
    },
    {
      name: 'externalIds',
      type: 'group',
      fields: [
        { name: 'wikidata', type: 'text', admin: { description: 'QID (ej. Q12345)' } },
        { name: 'schemaOrg', type: 'text', admin: { description: 'schema.org type URL' } },
        { name: 'linkedin', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'github', type: 'text' },
        { name: 'crunchbase', type: 'text' },
      ],
    },
    {
      name: 'sameAs',
      type: 'array',
      fields: [{ name: 'url', type: 'text', required: true }],
      admin: { description: 'URLs externas que apuntan a esta entity (Schema.org sameAs)' },
    },
    {
      name: 'person',
      type: 'group',
      admin: {
        condition: (data) => data?.kind === 'person',
      },
      fields: [
        { name: 'jobTitle', type: 'text', localized: true },
        {
          name: 'worksFor',
          type: 'relationship',
          relationTo: 'entities',
          filterOptions: { kind: { equals: 'organization' } },
        },
        {
          name: 'alumniOf',
          type: 'relationship',
          relationTo: 'entities',
          hasMany: true,
          filterOptions: { kind: { equals: 'organization' } },
        },
        {
          name: 'knowsAbout',
          type: 'relationship',
          relationTo: 'topics',
          hasMany: true,
        },
        {
          name: 'knowsLanguage',
          type: 'array',
          fields: [{ name: 'iso', type: 'text', required: true }],
        },
        { name: 'homeLocation', type: 'text' },
        { name: 'nationality', type: 'text' },
      ],
    },
    {
      name: 'organization',
      type: 'group',
      admin: {
        condition: (data) => data?.kind === 'organization',
      },
      fields: [
        { name: 'foundingDate', type: 'date' },
        { name: 'foundingLocation', type: 'text' },
        {
          name: 'founders',
          type: 'relationship',
          relationTo: 'entities',
          hasMany: true,
          filterOptions: { kind: { equals: 'person' } },
        },
        {
          name: 'knowsAbout',
          type: 'relationship',
          relationTo: 'topics',
          hasMany: true,
        },
        {
          name: 'areaServed',
          type: 'array',
          fields: [{ name: 'region', type: 'text', required: true }],
        },
        {
          name: 'contactPoint',
          type: 'array',
          fields: [
            { name: 'email', type: 'email' },
            { name: 'telephone', type: 'text' },
            { name: 'type', type: 'text', admin: { description: 'support, sales, etc.' } },
          ],
        },
      ],
    },
    {
      name: 'concept',
      type: 'group',
      admin: {
        condition: (data) => data?.kind === 'concept',
      },
      fields: [
        { name: 'definition', type: 'text', localized: true, maxLength: 500 },
        { name: 'field', type: 'text', admin: { description: 'ej. brand-strategy, ai-systems' } },
        {
          name: 'relatedConcepts',
          type: 'relationship',
          relationTo: 'entities',
          hasMany: true,
          filterOptions: { kind: { equals: 'concept' } },
        },
      ],
    },
    {
      name: 'tool',
      type: 'group',
      admin: {
        condition: (data) => data?.kind === 'tool',
      },
      fields: [
        { name: 'category', type: 'text' },
        {
          name: 'vendor',
          type: 'relationship',
          relationTo: 'entities',
          filterOptions: { kind: { equals: 'organization' } },
        },
        { name: 'homepage', type: 'text' },
      ],
    },
    {
      name: 'primaryImage',
      type: 'upload',
      relationTo: 'media',
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
