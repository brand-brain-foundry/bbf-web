import type { CollectionConfig } from 'payload';
import { isAdminOrEditor, publicRead } from '@/payload/lib/access';

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'type'],
  },
  access: {
    create: isAdminOrEditor,
    read: publicRead,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'from', type: 'text', required: true, unique: true, index: true },
    { name: 'to', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: '301',
      options: [
        { label: '301 Permanent', value: '301' },
        { label: '302 Temporary', value: '302' },
      ],
    },
  ],
};
