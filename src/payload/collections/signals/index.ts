import type { CollectionConfig } from 'payload';
import { isAdmin, isContentWriter, nobody } from '@/payload/lib/access';

export const Signals: CollectionConfig = {
  slug: 'signals',
  admin: {
    useAsTitle: 'kind',
    defaultColumns: ['kind', 'occurredAt', 'contentItemRef', 'capturedFrom'],
    group: 'Primitives',
  },
  access: {
    create: isContentWriter,
    read: isAdmin,
    update: nobody,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      index: true,
      options: [
        'page-view',
        'scroll-depth',
        'cta-click',
        'newsletter-signup',
        'contact-submission',
        'ai-citation',
        'backlink',
        'social-share',
        'newsletter-open',
        'podcast-listen',
      ].map((v) => ({ label: v, value: v })),
    },
    {
      name: 'contentItemRef',
      type: 'relationship',
      relationTo: 'contentItems',
      index: true,
    },
    {
      name: 'entityRef',
      type: 'relationship',
      relationTo: 'entities',
      index: true,
    },
    {
      name: 'data',
      type: 'json',
      admin: { description: 'Conditional fields per kind (Canon v1 §8.2)' },
    },
    {
      name: 'occurredAt',
      type: 'date',
      required: true,
      index: true,
    },
    {
      name: 'capturedFrom',
      type: 'select',
      required: true,
      options: ['ga4', 'gsc', 'posthog', 'promptmonitor', 'manual', 'ahrefs'].map((v) => ({
        label: v,
        value: v,
      })),
    },
  ],
};
