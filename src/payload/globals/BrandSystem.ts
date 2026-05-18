import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '@/payload/lib/access';

export const BrandSystem: GlobalConfig = {
  slug: 'brandSystem',
  access: { read: publicRead, update: isAdmin },
  fields: [
    {
      name: 'colors',
      type: 'group',
      fields: [
        { name: 'primary', type: 'text', defaultValue: '#000000' },
        { name: 'background', type: 'text', defaultValue: '#FFFFFF' },
        { name: 'accent', type: 'text' },
      ],
    },
    {
      name: 'typography',
      type: 'group',
      fields: [
        { name: 'displayFamily', type: 'text', defaultValue: 'Inter' },
        { name: 'bodyFamily', type: 'text', defaultValue: 'Mulish' },
      ],
    },
  ],
};
