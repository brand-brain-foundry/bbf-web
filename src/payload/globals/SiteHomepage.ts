import type { GlobalConfig } from 'payload';
import { publicRead, isAdmin } from '@/payload/lib/access';
import { revalidateGlobal } from '../hooks/revalidateGlobal';

export const SiteHomepage: GlobalConfig = {
  slug: 'site-homepage',
  label: {
    en: 'Site Homepage',
    es: 'Página de Inicio',
  },
  access: { read: publicRead, update: isAdmin },
  admin: {
    group: {
      en: 'Site Settings',
      es: 'Configuración del Sitio',
    },
    description: {
      en: 'Homepage content: hero, capabilities, method, process. Single source of truth (W-2).',
      es: 'Contenido de la página de inicio: hero, capacidades, método, proceso. Fuente única (W-2).',
    },
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: { en: 'Hero Section', es: 'Sección Hero' },
      fields: [
        {
          name: 'h1Line1',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Tú diriges.',
          admin: {
            description: 'Primera línea del H1 principal (color primario).',
          },
        },
        {
          name: 'h1Line2Soft',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Tu marca ejecuta.',
          admin: {
            description: 'Segunda línea del H1 (tono suave / muted).',
          },
        },
        {
          name: 'ledeBody',
          type: 'textarea',
          localized: true,
          required: true,
          maxLength: 280,
          admin: {
            description: 'Párrafo principal bajo el H1 (max 280 chars).',
          },
        },
        {
          name: 'ledeEmphasis',
          type: 'text',
          localized: true,
          required: true,
          admin: {
            description: 'Frase de énfasis al final del lede (peso 500, color primario).',
          },
        },
        {
          name: 'ctaPrimary',
          type: 'group',
          label: { en: 'Primary CTA', es: 'CTA Principal' },
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
              admin: { description: 'Texto del botón primario.' },
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              defaultValue: '#proceso',
              admin: { description: 'URL o anchor destino.' },
            },
          ],
        },
        {
          name: 'ctaSecondary',
          type: 'group',
          label: { en: 'Secondary CTA', es: 'CTA Secundario' },
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
              admin: { description: 'Texto del botón secundario (ghost).' },
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              defaultValue: '#metodo',
              admin: { description: 'URL o anchor destino.' },
            },
          ],
        },
        {
          name: 'media',
          type: 'group',
          label: { en: 'Media Frame', es: 'Marco de Media' },
          fields: [
            {
              name: 'chromeLabel',
              type: 'text',
              defaultValue: '// brand-brain.foundry · live feed',
              admin: {
                description:
                  'Etiqueta decorativa del chrome superior del frame (sintético, hardcoded canon).',
              },
            },
            {
              name: 'videoPoster',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Imagen poster del video (se muestra antes de carga).',
              },
            },
            {
              name: 'videoSources',
              type: 'array',
              minRows: 0,
              label: { en: 'Video Sources', es: 'Fuentes de Video' },
              admin: {
                description: 'Fuentes de video en orden de prioridad (mejor codec primero).',
              },
              fields: [
                {
                  name: 'src',
                  type: 'text',
                  required: true,
                  admin: { description: 'Path relativo o URL del archivo de video.' },
                },
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'AV1 WebM', value: 'webm-av1' },
                    { label: 'VP9 WebM', value: 'webm-vp9' },
                    { label: 'H.264 MP4', value: 'mp4-h264' },
                    { label: 'H.265 MP4', value: 'mp4-h265' },
                    { label: 'AV1 MP4', value: 'mp4-av1' },
                    { label: 'QuickTime MOV', value: 'mov' },
                  ],
                  admin: { description: 'Codec / contenedor del video.' },
                },
              ],
            },
            {
              name: 'demoLabel',
              type: 'text',
              localized: true,
              required: true,
              defaultValue: 'Demostración',
              admin: {
                description: 'Etiqueta del tipo de demostración (muted, bajo el video).',
              },
            },
            {
              name: 'footCaption',
              type: 'textarea',
              localized: true,
              required: true,
              admin: {
                description: 'Descripción de la demo visible en el footer del frame.',
              },
            },
          ],
        },
        {
          name: 'ticker',
          type: 'array',
          localized: true,
          minRows: 4,
          maxRows: 12,
          label: { en: 'Ticker Items', es: 'Items del Ticker' },
          admin: {
            description:
              'Items del ticker marquee decorativo (min 4, max 12). Se duplican automáticamente para el loop.',
          },
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
              admin: { description: 'Texto del item (ej: "WhatsApp Business · activo").' },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
};
