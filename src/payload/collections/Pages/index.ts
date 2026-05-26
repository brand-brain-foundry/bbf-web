import type { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { slugField } from './fields/slug';
import { pathField } from './fields/path';
import { computePath } from './hooks/computePath';
import { revalidatePage } from './hooks/revalidate';
import { pagesAccess } from './access';

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', '_status', 'updatedAt'],
    description: 'Pages for the public BBF site',
    livePreview: {
      url: ({ data, locale }) => {
        const path = data.path || '';
        const localeCode = (locale as { code?: string } | undefined)?.code ?? 'es';
        return `/${localeCode}/${path}`;
      },
    },
  },
  access: pagesAccess,
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 10,
  },
  hooks: {
    beforeChange: [computePath],
    afterChange: [revalidatePage],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    // Wave 13 will add layout blocks field (removed until blocks exist)
    slugField,
    pathField,
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Parent page (for nested URLs)',
      },
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
  ],
};
