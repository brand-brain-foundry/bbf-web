import type { CollectionConfig } from 'payload';
import { isAdminOrEditor, publicRead } from '@/payload/lib/access';

// D-BBF-MEDIA-PACKAGE (Opción A, firmada): un video es un paquete de
// entregas (primary/fallback/mobile/poster), no N Media docs sueltos
// referenciados por convención. Centraliza seoName/seoDescription/duration
// UNA vez por video (no por archivo/formato) — evita la desincronización
// que Fase 0 dejaba abierta al poner esos campos en Media. Un VideoObject
// se emite por paquete, no por formato (1 contentUrl canónico, no N).
export const VideoPackages: CollectionConfig = {
  slug: 'video-packages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  access: {
    create: isAdminOrEditor,
    read: publicRead,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Nombre interno del paquete (solo admin, no AEO — ver seoName).',
      },
    },
    {
      name: 'primary',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Fuente principal (mejor codec, ej. webm-vp9).',
      },
    },
    {
      name: 'fallback',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Fuente de respaldo (codec universal, ej. mp4-h264).',
      },
    },
    {
      name: 'mobile',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description:
          'Variante mobile opcional (art direction). Requiere soporte de atributo media en el componente — pendiente, ver H-BBF-543 §5.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Imagen poster/thumbnail del paquete.',
      },
    },
    {
      name: 'seoName',
      type: 'text',
      localized: true,
      required: false,
      admin: {
        description:
          'Nombre corto AEO-ready del video (name de VideoObject). Distinto de labels de UI.',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
      required: false,
      admin: {
        description: 'Descripción AEO-ready (1-2 frases citables) del video.',
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: false,
      admin: {
        description: 'Duración en segundos. Una sola vez por video (no por formato).',
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
        description: 'Idioma hablado del contenido del video.',
      },
    },
  ],
};
