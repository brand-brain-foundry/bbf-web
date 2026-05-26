import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { seoPlugin } from '@payloadcms/plugin-seo';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Users } from './payload/collections/users';
import { Media } from './payload/collections/media';
import { Pages } from './payload/collections/Pages';
import { Entities } from './payload/collections/entities';
import { Topics } from './payload/collections/topics';
import { Clusters } from './payload/collections/clusters';
import { ContentItems } from './payload/collections/contentItems';
import { Surfaces } from './payload/collections/surfaces';
import { Signals } from './payload/collections/signals';
import { Redirects } from './payload/collections/redirects';

import { Site } from './payload/globals/Site';
import { SocialLinks } from './payload/globals/SocialLinks';
import { SEO } from './payload/globals/SEO';
import { BrandSystem } from './payload/globals/BrandSystem';
import { SiteIdentity } from './payload/globals/SiteIdentity';
import { SiteNavigation } from './payload/globals/SiteNavigation';
import { SiteContact } from './payload/globals/SiteContact';
import { SiteNewsletter } from './payload/globals/SiteNewsletter';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — BBF Admin',
    },
    components: {
      graphics: {
        Logo: '@/app/(payload)/components/AdminLogo',
        Icon: '@/app/(payload)/components/AdminIcon',
      },
    },
  },

  collections: [
    Users,
    Media,
    Pages,
    Entities,
    Topics,
    Clusters,
    ContentItems,
    Surfaces,
    Signals,
    Redirects,
  ],

  globals: [
    Site,
    SocialLinks,
    SEO,
    BrandSystem,
    SiteIdentity,
    SiteNavigation,
    SiteContact,
    SiteNewsletter,
  ],

  // D-BBF-WEB-05: ES default, EN con prefijo /en
  localization: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    fallback: true,
  },

  editor: lexicalEditor({}),

  // D-BBF-WEB-32: @payloadcms/db-postgres con pool Neon (portable, no vercel-postgres)
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    // push solo en dev — NUNCA en prod (D-BBF-WEB-16)
    push: process.env.NODE_ENV === 'development',
    migrationDir: path.resolve(dirname, 'payload/migrations'),
  }),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload/payload-types.ts'),
  },

  plugins: [
    // Wave 12-A: SEO plugin for Pages collection
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const title = (doc as Record<string, unknown>).title;
        return `${typeof title === 'string' ? title : 'Untitled'} — Brand Brain Foundry`;
      },
      generateDescription: ({ doc }) => {
        const title = (doc as Record<string, unknown>).title;
        return typeof title === 'string' ? title : '';
      },
      generateURL: ({ doc, locale }) => {
        const path = (doc as Record<string, unknown>).path;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brandbrainfoundry.com';
        return `${siteUrl}/${locale}/${typeof path === 'string' ? path : ''}`;
      },
    }),
    // D-BBF-WEB-33: Vercel Blob via plugin oficial, solo collection media
    // Guard: skip when token ausente o inválido (local dev sin provisionar)
    ...(process.env.BLOB_READ_WRITE_TOKEN?.startsWith('vercel_blob_rw_')
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
});
