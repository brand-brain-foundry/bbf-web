import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '@/lib/access';

export const SEO: GlobalConfig = {
  slug: 'seoDefaults',
  access: { read: publicRead, update: isAdmin },
  fields: [
    { name: 'defaultTitle', type: 'text', localized: true },
    { name: 'titleTemplate', type: 'text', defaultValue: '%s — BBF' },
    { name: 'defaultDescription', type: 'textarea', localized: true, maxLength: 300 },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    { name: 'twitterHandle', type: 'text' },
  ],
};
