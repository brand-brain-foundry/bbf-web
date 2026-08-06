import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '@/payload/lib/access';
import { revalidateGlobal } from '@/payload/hooks/revalidateGlobal';

export const SocialLinks: GlobalConfig = {
  slug: 'socialLinks',
  access: { read: publicRead, update: isAdmin },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    { name: 'linkedin', type: 'text' },
    { name: 'twitter', type: 'text' },
    { name: 'github', type: 'text' },
    { name: 'youtube', type: 'text' },
    { name: 'instagram', type: 'text' },
  ],
};
