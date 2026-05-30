import type { GlobalConfig } from 'payload';
import { publicRead, isAdmin } from '@/payload/lib/access';
import { revalidateGlobal } from '../hooks/revalidateGlobal';
import { lissajousVariantOptions2D } from '@/payload/lib/lissajousOptions';

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
    {
      name: 'capabilities',
      type: 'group',
      label: { es: 'Sección Capacidades', en: 'Capabilities Section' },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          localized: true,
          admin: {
            description: 'Eyebrow label sobre el H2 (ej: §2 · Capacidades).',
          },
        },
        {
          name: 'h2Line1',
          type: 'text',
          localized: true,
          required: true,
          admin: { description: 'Primera línea del H2 de sección (color primario).' },
        },
        {
          name: 'h2Line2Soft',
          type: 'text',
          localized: true,
          required: true,
          admin: { description: 'Segunda línea del H2 (tono muted).' },
        },
        {
          name: 'lead',
          type: 'textarea',
          localized: true,
          required: true,
          admin: { description: 'Párrafo introductorio de la sección (max ~200 chars).' },
        },
        {
          name: 'hubSpokes',
          type: 'array',
          dbName: 'cap_hub_spokes',
          minRows: 5,
          maxRows: 5,
          label: { en: 'Hub Spokes', es: 'Spokes del Hub MEMORIA' },
          admin: {
            description:
              '5 spokes del Hub MEMORIA (orden = ángulo 0°→72°→144°→216°→288°). Defaults: Conversa/Genera/Automatiza/Integra/Aprende.',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              localized: true,
              required: true,
              admin: {
                description: 'Nombre del spoke (ej: Conversa). Uppercase automático en UI.',
              },
            },
            {
              name: 'meta',
              type: 'text',
              localized: true,
              admin: { description: 'Sub-labels del spoke (ej: WhatsApp · Web · Voz).' },
            },
          ],
        },
        {
          name: 'items',
          type: 'array',
          minRows: 5,
          maxRows: 5,
          label: { en: 'Capability Items', es: 'Items de Capacidades' },
          admin: {
            description: 'Las 5 capacidades BBF (orden = orden visual). Exactamente 5.',
          },
          fields: [
            {
              name: 'slug',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Identificador único: conversa | genera | automatiza | integra | aprende',
              },
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
              admin: { description: 'Nombre de la capacidad (ej: Conversa).' },
            },
            {
              name: 'lede',
              type: 'textarea',
              localized: true,
              required: true,
              admin: { description: 'Frase de impacto (1-2 líneas, peso medio).' },
            },
            {
              name: 'body',
              type: 'textarea',
              localized: true,
              required: true,
              admin: { description: 'Descripción desarrollada (2-3 párrafos breves).' },
            },
            {
              name: 'bullets',
              type: 'array',
              localized: true,
              minRows: 1,
              label: { en: 'Bullets', es: 'Bullets' },
              admin: { description: 'Lista de características clave (3-5 items).' },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  admin: { description: 'Texto del bullet.' },
                },
              ],
            },
            {
              name: 'example',
              type: 'textarea',
              localized: true,
              required: true,
              admin: { description: 'Ejemplo concreto de uso (1-2 líneas, blockquote).' },
            },
            {
              name: 'scene',
              type: 'group',
              label: { en: 'Scene Visualization', es: 'Visualización de Escena' },
              fields: [
                {
                  name: 'kind',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Chat', value: 'chat' },
                    { label: 'Pipeline', value: 'pipeline' },
                    { label: 'Workflow', value: 'workflow' },
                    { label: 'Stack', value: 'stack' },
                    { label: 'Media', value: 'media' },
                  ],
                  admin: { description: 'Tipo de visualización para esta capacidad.' },
                },
                {
                  name: 'meta',
                  type: 'text',
                  localized: true,
                  required: true,
                  admin: {
                    description: 'Metadato contextual del scene (ej: "WhatsApp · Web · Voz").',
                  },
                },
                // Q4: scene sub-groups condicionales (admin.condition)
                {
                  name: 'chat',
                  type: 'group',
                  label: { en: 'Chat Scene Data', es: 'Datos Escena Chat' },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.kind === 'chat',
                  },
                  fields: [
                    {
                      name: 'messages',
                      type: 'array',
                      localized: true,
                      label: { en: 'Messages', es: 'Mensajes' },
                      fields: [
                        {
                          name: 'who',
                          type: 'select',
                          required: true,
                          options: [
                            { label: 'User', value: 'user' },
                            { label: 'Brain', value: 'brain' },
                          ],
                        },
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'footer',
                      type: 'text',
                      localized: true,
                      admin: { description: 'Texto decorativo del footer del scene.' },
                    },
                  ],
                },
                {
                  name: 'pipeline',
                  type: 'group',
                  label: { en: 'Pipeline Scene Data', es: 'Datos Escena Pipeline' },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.kind === 'pipeline',
                  },
                  fields: [
                    {
                      name: 'steps',
                      type: 'array',
                      dbName: 'cap_items_pipe_steps',
                      localized: true,
                      label: { en: 'Steps', es: 'Pasos' },
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          admin: { description: 'Nombre del paso.' },
                        },
                        {
                          name: 'detail',
                          type: 'text',
                          required: true,
                          admin: { description: 'Detalle secundario del paso.' },
                        },
                        {
                          name: 'state',
                          type: 'select',
                          required: true,
                          options: [
                            { label: 'Done', value: 'done' },
                            { label: 'Live', value: 'live' },
                            { label: 'Queue', value: 'queue' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'footer',
                      type: 'text',
                      localized: true,
                      admin: { description: 'Texto decorativo del footer del scene.' },
                    },
                  ],
                },
                {
                  name: 'workflow',
                  type: 'group',
                  label: { en: 'Workflow Scene Data', es: 'Datos Escena Workflow' },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.kind === 'workflow',
                  },
                  fields: [
                    {
                      name: 'nodes',
                      type: 'array',
                      label: { en: 'Nodes', es: 'Nodos' },
                      fields: [
                        { name: 'x', type: 'number', required: true },
                        { name: 'y', type: 'number', required: true },
                        {
                          name: 'label',
                          type: 'text',
                          localized: true,
                          required: true,
                        },
                        {
                          name: 'kind',
                          type: 'select',
                          required: true,
                          options: [
                            { label: 'Input', value: 'in' },
                            { label: 'Step', value: 'step' },
                            { label: 'Branch', value: 'branch' },
                            { label: 'Auto', value: 'auto' },
                            { label: 'Human', value: 'human' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'edges',
                      type: 'array',
                      label: { en: 'Edges', es: 'Conexiones' },
                      fields: [
                        { name: 'from', type: 'number', required: true },
                        { name: 'to', type: 'number', required: true },
                      ],
                    },
                    {
                      name: 'footer',
                      type: 'text',
                      localized: true,
                      admin: { description: 'Texto decorativo del footer del scene.' },
                    },
                  ],
                },
                {
                  name: 'stack',
                  type: 'group',
                  label: { en: 'Stack Scene Data', es: 'Datos Escena Stack' },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.kind === 'stack',
                  },
                  fields: [
                    {
                      name: 'groups',
                      type: 'array',
                      localized: true,
                      label: { en: 'Groups', es: 'Grupos' },
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          admin: { description: 'Nombre del grupo de tecnologías.' },
                        },
                        {
                          name: 'items',
                          type: 'array',
                          fields: [
                            {
                              name: 'name',
                              type: 'text',
                              required: true,
                              admin: { description: 'Nombre del item/tecnología.' },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'footer',
                      type: 'text',
                      localized: true,
                      admin: { description: 'Texto decorativo del footer del scene.' },
                    },
                  ],
                },
                {
                  name: 'media',
                  type: 'group',
                  label: { en: 'Media Scene Data', es: 'Datos Escena Media' },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.kind === 'media',
                  },
                  fields: [
                    {
                      name: 'mediaType',
                      type: 'select',
                      dbName: 'm_type',
                      required: true,
                      defaultValue: 'image',
                      options: [
                        { label: { en: 'Image', es: 'Imagen' }, value: 'image' },
                        { label: { en: 'Video', es: 'Video' }, value: 'video' },
                      ],
                    },
                    {
                      name: 'asset',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      admin: {
                        description: 'Imagen portrait 9:16 o video portrait 9:16.',
                      },
                    },
                    {
                      name: 'posterFallback',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        condition: (_, sib) => sib?.mediaType === 'video',
                        description: 'Frame poster del video (opcional).',
                      },
                    },
                    {
                      name: 'caption',
                      type: 'text',
                      localized: true,
                      admin: { description: 'Pie de imagen/video opcional.' },
                    },
                    {
                      name: 'lissajousVariant',
                      type: 'select',
                      dbName: 'lis_var',
                      defaultValue: 'trefoil-2d',
                      options: lissajousVariantOptions2D,
                      admin: {
                        description: 'Lissajous deco opcional. 6 variantes 2D.',
                      },
                    },
                    {
                      name: 'footer',
                      type: 'text',
                      localized: true,
                      admin: { description: 'Texto decorativo del footer del scene.' },
                    },
                  ],
                },
              ],
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
