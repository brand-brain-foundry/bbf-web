import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
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

import { SocialLinks } from './payload/globals/SocialLinks';
import { SEO } from './payload/globals/SEO';
import { BrandSystem } from './payload/globals/BrandSystem';
import { SiteIdentity } from './payload/globals/SiteIdentity';
import { SiteNavigation } from './payload/globals/SiteNavigation';
import { SiteContact } from './payload/globals/SiteContact';
import { SiteNewsletter } from './payload/globals/SiteNewsletter';
import { SiteHomepage } from './payload/globals/SiteHomepage';
import { SiteCtaLibrary } from './payload/globals/SiteCtaLibrary';
import { SiteContactPage } from './payload/globals/SiteContactPage';
import { SITE_NAME_FALLBACK } from './lib/brand';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// B-BBF-WEB-FIX-R2-RUNTIME-FINAL: chequeo + log explícito de R2, evaluado siempre que
// payload.config.ts se importa (build Y runtime) — a diferencia de instrumentation.ts
// (removido), que Next.js NO garantiza ejecutar de forma confiable con output:'standalone'
// (bug conocido, ver reporte B-BBF-WEB-FIX-CASO-VIDEO-Y-R2-RUNTIME). Log en vez de throw:
// un storage mal configurado no debe crashear el sitio entero (crash-loop en prod sería
// peor que degradar a storage local) — pero SÍ debe quedar clarísimo en los logs por qué.
const r2Bucket = process.env.R2_BUCKET;
const r2Endpoint = process.env.R2_ENDPOINT;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

const r2Vars = {
  R2_BUCKET: r2Bucket,
  R2_ENDPOINT: r2Endpoint,
  R2_ACCESS_KEY_ID: r2AccessKeyId,
  R2_SECRET_ACCESS_KEY: r2SecretAccessKey,
};
const r2Missing = Object.entries(r2Vars)
  .filter(([, value]) => !value)
  .map(([key]) => key);
const r2Active = r2Missing.length === 0;

if (r2Active) {
  console.log('[storage] R2 (Cloudflare) ACTIVO — collection media usa s3Storage.');
} else {
  console.warn(
    `[storage] R2 SKIPPED — faltan env vars: ${r2Missing.join(', ')}. ` +
      'Media collection cae a storage local (efímero en contenedores). ' +
      'Si esto aparece en producción, confirmar las 4 vars en el panel del host (runtime, no solo build).',
  );
}

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
    SocialLinks,
    SEO,
    BrandSystem,
    SiteIdentity,
    SiteNavigation,
    SiteContact,
    SiteNewsletter,
    SiteHomepage,
    SiteCtaLibrary,
    SiteContactPage,
  ],

  // D-BBF-WEB-05: ES default, EN con prefijo /en
  localization: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    fallback: true,
  },

  editor: lexicalEditor({}),

  // D-BBF-WEB-32: @payloadcms/db-postgres con pool Neon (portable, no vercel-postgres)
  // sslmode=verify-full explícito: pg-connection-string v3+ eliminará aliases (require→verify-full).
  // new URL() muta solo el parámetro sslmode sin exponer credenciales en logs.
  db: postgresAdapter({
    pool: {
      connectionString: (() => {
        const raw = process.env.DATABASE_URL;
        if (!raw) return raw;
        try {
          const u = new URL(raw);
          u.searchParams.set('sslmode', 'verify-full');
          return u.toString();
        } catch {
          return raw;
        }
      })(),
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
      fields: ({ defaultFields }) =>
        defaultFields.map((field) =>
          'name' in field && ['title', 'description', 'image'].includes(field.name as string)
            ? { ...field, localized: true }
            : field,
        ),
      generateTitle: ({ doc }) => {
        const title = (doc as Record<string, unknown>).title;
        return `${typeof title === 'string' ? title : 'Untitled'} — ${SITE_NAME_FALLBACK}`;
      },
      generateDescription: ({ doc }) => {
        const title = (doc as Record<string, unknown>).title;
        return typeof title === 'string' ? title : '';
      },
      generateURL: ({ doc, locale }) => {
        const path = (doc as Record<string, unknown>).path;
        // Payload preview — env var legítima: generateURL corre sync en init, getSiteIdentity() crearía dep circular
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sivarbrains.com';
        return `${siteUrl}/${locale}/${typeof path === 'string' ? path : ''}`;
      },
    }),
    // B-BBF-WEB-RAILWAY-EJECUCION-01: Cloudflare R2 (S3-compatible) via adapter oficial @payloadcms/storage-s3.
    // R2 usa region 'auto' (no es región AWS real) + forcePathStyle:true (requisito R2 — sin esto
    // el SDK intenta virtual-hosted-style addressing, que R2 no siempre tolera). B-BBF-WEB-FIX-R2-STORAGE.
    ...(r2Bucket && r2Endpoint && r2AccessKeyId && r2SecretAccessKey
      ? [
          s3Storage({
            collections: { media: true },
            bucket: r2Bucket,
            config: {
              credentials: {
                accessKeyId: r2AccessKeyId,
                secretAccessKey: r2SecretAccessKey,
              },
              region: 'auto',
              endpoint: r2Endpoint,
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
});
