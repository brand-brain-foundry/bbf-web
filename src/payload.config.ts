import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Users } from './payload/collections/users';
import { Media } from './payload/collections/media';
import { Entities } from './payload/collections/entities';
import { Topics } from './payload/collections/topics';
import { Clusters } from './payload/collections/clusters';
import { ContentItems } from './payload/collections/contentItems';
import { Surfaces } from './payload/collections/surfaces';
import { Signals } from './payload/collections/signals';
import { Redirects } from './payload/collections/redirects';

import { Site } from './payload/globals/Site';
import { Navigation } from './payload/globals/Navigation';
import { SocialLinks } from './payload/globals/SocialLinks';
import { SEO } from './payload/globals/SEO';
import { BrandSystem } from './payload/globals/BrandSystem';

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
    migrationDir: path.resolve(dirname, 'payload/migrations'),
  }),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload/payload-types.ts'),
  },

  plugins: [
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
