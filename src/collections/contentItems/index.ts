import type { CollectionConfig } from 'payload';
import {
  aiAgentCanUpdateIfAIGenerated,
  isAdmin,
  isContentWriter,
  publicReadPublished,
} from '@/lib/access';
import {
  computeCanonicalUrl,
  triggerSurfaceRegeneration,
  verifyAuditsBeforePublish,
} from '@/lib/hooks/contentItemHooks';
import { contentItemBlocks } from './blocks';

export const ContentItems: CollectionConfig = {
  slug: 'contentItems',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'editorialState', '_status', 'publishedAt'],
    group: 'Content',
  },
  access: {
    create: isContentWriter,
    read: publicReadPublished,
    update: aiAgentCanUpdateIfAIGenerated,
    delete: isAdmin,
  },
  versions: {
    drafts: {
      autosave: { interval: 2000 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  hooks: {
    beforeChange: [computeCanonicalUrl],
    beforeValidate: [verifyAuditsBeforePublish],
    afterChange: [triggerSurfaceRegeneration],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      index: true,
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Cornerstone Page (CS-01..CS-04)', value: 'cornerstone-page' },
        { label: 'Pillar Page (P1..P6)', value: 'pillar-page' },
        { label: 'Cluster Article', value: 'cluster-article' },
        { label: 'Case Study', value: 'case' },
        { label: 'Podcast Episode', value: 'episode' },
        { label: 'Generic Page', value: 'page' },
        { label: 'Blog Post (standalone)', value: 'post' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'format',
      type: 'select',
      options: [
        { label: 'F-1 Cornerstone Article', value: 'F-1' },
        { label: 'F-2 Field Essay (Zavala-cross)', value: 'F-2' },
        { label: 'F-3 Case Study', value: 'F-3' },
        { label: 'F-4 Technical Note', value: 'F-4' },
        { label: 'F-5 Curated Synthesis', value: 'F-5' },
        { label: 'F-6 Short Dispatch', value: 'F-6' },
      ],
      admin: {
        position: 'sidebar',
        description: 'null para pages no editoriales',
      },
    },
    {
      name: 'layer',
      type: 'select',
      defaultValue: 'B',
      options: [
        { label: 'B (BBF empresa)', value: 'B' },
        { label: 'Z-cross (Zavala referenced)', value: 'Z-cross' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'clusterRefs',
      type: 'array',
      fields: [
        { name: 'cluster', type: 'relationship', relationTo: 'clusters', required: true },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 110,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'excerpt',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 300,
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: contentItemBlocks,
      localized: true,
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'entities',
      hasMany: true,
      required: true,
      minRows: 1,
      filterOptions: { kind: { equals: 'person' } },
    },
    {
      name: 'contributors',
      type: 'relationship',
      relationTo: 'entities',
      hasMany: true,
      filterOptions: { kind: { equals: 'person' } },
    },
    {
      name: 'entityMentions',
      type: 'array',
      fields: [
        { name: 'entity', type: 'relationship', relationTo: 'entities', required: true },
        { name: 'sameAs', type: 'text' },
        { name: 'weight', type: 'number', min: 0, max: 1, defaultValue: 1 },
      ],
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
      name: 'citations',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'year', type: 'number' },
        { name: 'url', type: 'text' },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Academic', value: 'academic' },
            { label: 'Industry', value: 'industry' },
            { label: 'Primary Source', value: 'primary-source' },
          ],
        },
      ],
    },
    {
      name: 'editorialState',
      type: 'select',
      defaultValue: 'A',
      options: [
        { label: 'A — Brief', value: 'A' },
        { label: 'B — Build', value: 'B' },
        { label: 'C — Audit', value: 'C' },
        { label: 'D — Ship', value: 'D' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'audits',
      type: 'group',
      fields: [
        ...[
          'aud01_informationGain',
          'aud02_eeat',
          'aud03_geoChecklist',
          'aud04_voiceBbf',
          'aud05_schema',
          'aud06_antipatterns',
          'aud07_copyEdit',
        ].map((auditName) => ({
          name: auditName,
          type: 'group' as const,
          fields: [
            { name: 'passed', type: 'checkbox' as const, defaultValue: false },
            {
              name: 'score',
              type: 'number' as const,
              min: 0,
              max: 9,
              admin: { description: 'Solo para aud01 (information gain)' },
            },
            { name: 'note', type: 'textarea' as const },
          ],
        })),
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'scheduledAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'aiGenerated',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'aiModel',
      type: 'text',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.aiGenerated === true,
      },
    },
    {
      name: 'aiPrompt',
      type: 'textarea',
      admin: {
        condition: (data) => data?.aiGenerated === true,
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      localized: true,
      admin: {
        description: 'Computed via beforeChange hook',
        readOnly: true,
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};
