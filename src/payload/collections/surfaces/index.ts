import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '@/payload/lib/access';

export const Surfaces: CollectionConfig = {
  slug: 'surfaces',
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'kind', 'locale', 'status', 'generatedAt'],
    group: 'Primitives',
    description: 'Auto-generated. Edit restricted to admin debugging.',
  },
  access: {
    create: () => false,
    read: publicRead,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'slug', type: 'text', required: true, index: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      index: true,
      options: [
        'web-html',
        'json-ld',
        'llms-txt',
        'llms-full-txt',
        'rss',
        'open-graph',
        'twitter-card',
        'sitemap-entry',
        'social-atom',
        'newsletter-snippet',
        'podcast-rss',
      ].map((v) => ({ label: v, value: v })),
    },
    {
      name: 'contentItemRef',
      type: 'relationship',
      relationTo: 'contentItems',
      required: true,
      index: true,
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      options: [
        { label: 'ES', value: 'es' },
        { label: 'EN', value: 'en' },
      ],
    },
    {
      name: 'output',
      type: 'json',
      admin: { description: 'Computed output: HTML string, JSON-LD object, etc.' },
    },
    { name: 'generatedAt', type: 'date' },
    { name: 'generatorVersion', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Invalid', value: 'invalid' },
      ],
    },
    {
      name: 'validations',
      type: 'group',
      fields: [
        { name: 'schemaOrgValid', type: 'checkbox' },
        { name: 'coreWebVitalsOk', type: 'checkbox' },
        { name: 'lengthOk', type: 'checkbox' },
        { name: 'contentParity', type: 'checkbox' },
      ],
    },
  ],
};
