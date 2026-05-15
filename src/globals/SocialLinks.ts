import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '@/lib/access';

export const SocialLinks: GlobalConfig = {
  slug: 'socialLinks',
  access: { read: publicRead, update: isAdmin },
  fields: [
    { name: 'linkedin', type: 'text' },
    { name: 'twitter', type: 'text' },
    { name: 'github', type: 'text' },
    { name: 'youtube', type: 'text' },
    { name: 'instagram', type: 'text' },
  ],
};
