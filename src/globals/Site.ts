import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '@/lib/access';

export const Site: GlobalConfig = {
  slug: 'site',
  access: { read: publicRead, update: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true, maxLength: 300 },
    {
      name: 'baseUrl',
      type: 'text',
      required: true,
      defaultValue: 'https://brandbrainfoundry.com',
    },
    {
      name: 'organizationEntity',
      type: 'relationship',
      relationTo: 'entities',
      filterOptions: { kind: { equals: 'organization' } },
      admin: { description: 'BBF Organization entity ref para JSON-LD global' },
    },
  ],
};
