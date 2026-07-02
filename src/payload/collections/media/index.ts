import type { CollectionAfterChangeHook, CollectionConfig } from 'payload';
import { purgeCloudflareCache } from '@/lib/cloudflare/purge-cache';
import { env } from '@/lib/env';
import { isAdminOrEditor, publicRead } from '@/payload/lib/access';

// H-BBF-523: Media no tenía ningún hook afterChange — subir/reemplazar un
// archivo nunca disparaba revalidación ni purge de CDN, aunque el homepage
// (y otras páginas) referencian media docs directamente. Sin saber qué
// páginas exactas consumen cada media doc, se revalida todo (mismo patrón
// que revalidateGlobal.ts) — más simple y correcto que intentar mapear
// media → páginas consumidoras (A-01).
const revalidateMedia: CollectionAfterChangeHook = async ({ req }) => {
  try {
    const res = await fetch(`http://127.0.0.1:${process.env.PORT ?? 3000}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': env.PAYLOAD_SECRET },
      body: JSON.stringify({ paths: ['/'], type: 'layout', tags: ['media'] }),
    });
    if (!res.ok) {
      req.payload.logger.error(`[revalidate] /api/revalidate respondió ${res.status}`);
    }
  } catch (err) {
    req.payload.logger.error({ err }, '[revalidate] fetch a /api/revalidate falló (media)');
  }

  await purgeCloudflareCache();
};

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    create: isAdminOrEditor,
    read: publicRead,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateMedia],
  },
  upload: {
    mimeTypes: ['image/*', 'video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
    {
      name: 'credit',
      type: 'text',
    },
  ],
};
