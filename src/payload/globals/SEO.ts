import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '@/payload/lib/access';

export const SEO: GlobalConfig = {
  slug: 'seoDefaults',
  access: { read: publicRead, update: isAdmin },
  fields: [
    { name: 'defaultTitle', type: 'text', localized: true },
    // D-FASE-B-08 + D-CROSS-01: interpunkt (U+00B7) + rebrand Sivar Brains
    { name: 'titleTemplate', type: 'text', defaultValue: '%s · Sivar Brains' },
    { name: 'defaultDescription', type: 'textarea', localized: true, maxLength: 300 },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    { name: 'twitterHandle', type: 'text' },
  ],
};
