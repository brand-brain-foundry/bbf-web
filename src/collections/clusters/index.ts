import type { CollectionConfig } from 'payload';
import { isAdminOrEditor, publicRead } from '@/lib/access';

export const Clusters: CollectionConfig = {
  slug: 'clusters',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'tier', 'name', 'status'],
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
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'CS-01 | P3 | P3-C2' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: [
        { label: 'Cornerstone (4 totales)', value: 'cornerstone' },
        { label: 'Pillar (6 totales)', value: 'pillar' },
        { label: 'Cluster article (8-15 por pillar)', value: 'cluster' },
      ],
      admin: { position: 'sidebar' },
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
      maxLength: 300,
    },
    {
      name: 'parentCluster',
      type: 'relationship',
      relationTo: 'clusters',
      admin: { description: 'pillar → cornerstone; cluster → pillar' },
    },
    {
      name: 'topicRefs',
      type: 'array',
      fields: [
        { name: 'topic', type: 'relationship', relationTo: 'topics', required: true },
        { name: 'weight', type: 'number', min: 0, max: 1, defaultValue: 1 },
      ],
    },
    {
      name: 'canonicalSlug',
      type: 'text',
      localized: true,
      admin: {
        description:
          'URL slug localizado (ES: cerebro-marca / EN: brand-brain). null para clusters genéricos.',
      },
    },
    {
      name: 'authorityThreshold',
      type: 'number',
      defaultValue: 20,
      admin: { description: 'Mínimo de ContentItems para "authority"' },
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
