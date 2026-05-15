import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '@/payload/lib/access';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: { read: publicRead, update: isAdmin },
  fields: [
    {
      name: 'main',
      type: 'array',
      localized: true,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'array',
      localized: true,
      fields: [
        { name: 'sectionTitle', type: 'text' },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
};
