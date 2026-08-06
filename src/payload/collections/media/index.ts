import type { CollectionAfterChangeHook, CollectionConfig } from 'payload';
import { invalidateContent, layoutScope } from '@/lib/cache/invalidate';
import { purgeCloudflareCache } from '@/lib/cloudflare/purge-cache';
import { isAdminOrEditor, publicRead } from '@/payload/lib/access';

// H-BBF-523/524: Media no tenía ningún hook afterChange — subir/reemplazar
// un archivo nunca disparaba revalidación ni purge de CDN. Sin saber qué
// páginas exactas consumen cada media doc (un asset puede aparecer en
// cualquier página — logo, imagen de contenido), se usa alcance conservador
// de layout (cascada total por locale) en vez de intentar mapear media →
// páginas consumidoras (A-01). Antes de R-CACHE (F2) el path era literal
// `/${locale}` sin tipo — invalidaba solo el home, nunca el resto (gap #1,
// R-CACHE F1.3). Inline, patrón oficial Payload embebido — no HTTP.
const revalidateMedia: CollectionAfterChangeHook = async ({ req }) => {
  invalidateContent({ paths: layoutScope(), tags: ['media'] }, req.payload.logger);
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
    // D-BBF-MEDIA-SEO (Fase 0): campos AEO/SEO a nivel asset — fuente de
    // verdad única (C-01) para VideoObject/ImageObject, en vez de
    // reutilizar alt/caption o duplicar copy por página consumidora.
    {
      name: 'seoName',
      type: 'text',
      localized: true,
      required: false,
      admin: {
        description:
          'Nombre corto AEO-ready del asset (ej. name de VideoObject/ImageObject). Distinto de alt/caption — pensado para citación por IA, no para UI.',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
      required: false,
      admin: {
        description:
          'Descripción AEO-ready (1-2 frases citables) del asset. Distinta de caption — no es copy de interfaz.',
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: false,
      admin: {
        description: 'Duración en segundos. Solo aplica a video (mimeType video/*).',
        condition: (data) =>
          typeof data?.mimeType === 'string' && data.mimeType.startsWith('video/'),
      },
    },
    {
      name: 'inLanguage',
      type: 'select',
      required: false,
      options: [
        { label: 'Español', value: 'es' },
        { label: 'English', value: 'en' },
      ],
      admin: {
        description:
          'Idioma hablado/hablado en el contenido del asset (ej. audio de un video) — independiente del locale de la página que lo consume.',
      },
    },
  ],
};
