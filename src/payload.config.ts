import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Users } from './collections/users';
import { Media } from './collections/media';
import { Entities } from './collections/entities';
import { Topics } from './collections/topics';
import { Clusters } from './collections/clusters';
import { ContentItems } from './collections/contentItems';
import { Surfaces } from './collections/surfaces';
import { Signals } from './collections/signals';
import { Redirects } from './collections/redirects';

import { Site } from './globals/Site';
import { Navigation } from './globals/Navigation';
import { SocialLinks } from './globals/SocialLinks';
import { SEO } from './globals/SEO';
import { BrandSystem } from './globals/BrandSystem';

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
  },

  collections: [
    Users,
    Media,
    Entities,
    Topics,
    Clusters,
    ContentItems,
    Surfaces,
    Signals,
    Redirects,
  ],

  globals: [Site, Navigation, SocialLinks, SEO, BrandSystem],

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
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  plugins: [
    // D-BBF-WEB-33: Vercel Blob via plugin oficial, solo collection media
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
});
