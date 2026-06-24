import type { GlobalConfig } from 'payload';
import { publicRead, isAdmin } from '@/payload/lib/access';
import { revalidateGlobal } from '../hooks/revalidateGlobal';
import { lissajousVariantOptions2D } from '@/payload/lib/lissajousOptions';
import { Icons } from '@/components/atoms/Icon';

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
    // ─── §1 HERO ─────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { en: 'Hero Section', es: 'Sección Hero' },
      admin: { initCollapsed: true },
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
              maxLength: 280,
              admin: {
                description: 'Párrafo principal bajo el H1 (max 280 chars).',
              },
            },
            {
              name: 'ledeEmphasis',
              type: 'text',
              localized: true,
              admin: {
                description: 'Frase de énfasis al final del lede (peso 500, color primario).',
              },
            },
            {
              name: 'ctas',
              type: 'array',
              maxRows: 2,
              label: { en: 'Hero CTAs', es: 'CTAs del Hero' },
              labels: {
                singular: { en: 'CTA', es: 'CTA' },
                plural: { en: 'CTAs', es: 'CTAs' },
              },
              admin: {
                initCollapsed: true,
                description:
                  'Selecciona 0–2 CTAs de la Library. Primer ítem = CTA principal. Label/type/intent/href vienen de SiteCtaLibrary.',
              },
              fields: [
                {
                  name: 'ctaKey',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'Key de SiteCtaLibrary (ej: hero-cta-primary). Ver Catálogo de CTAs para keys disponibles.',
                  },
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
                    initCollapsed: true,
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
                initCollapsed: true,
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
    },
    // ─── §2 CAPABILITIES ─────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { es: 'Sección Capacidades', en: 'Capabilities Section' },
      admin: { initCollapsed: true },
      fields: [
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
              admin: { description: 'Primera línea del H2 de sección (color primario).' },
            },
            {
              name: 'h2Line2Soft',
              type: 'text',
              localized: true,
              admin: { description: 'Segunda línea del H2 (tono muted).' },
            },
            {
              name: 'lead',
              type: 'textarea',
              localized: true,
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
                initCollapsed: true,
                description:
                  '5 spokes del Hub MEMORIA (orden = ángulo 0°→72°→144°→216°→288°). Defaults: Conversa/Genera/Automatiza/Integra/Aprende.',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  localized: true,
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
                initCollapsed: true,
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
                  admin: { description: 'Nombre de la capacidad (ej: Conversa).' },
                },
                {
                  name: 'lede',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'Frase de impacto (1-2 líneas, peso medio).' },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'Descripción desarrollada (2-3 párrafos breves).' },
                },
                {
                  name: 'bullets',
                  type: 'array',
                  localized: true,
                  minRows: 1,
                  label: { en: 'Bullets', es: 'Bullets' },
                  admin: {
                    initCollapsed: true,
                    description: 'Lista de características clave (3-5 items).',
                  },
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
                          admin: { initCollapsed: true },
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
                          admin: { initCollapsed: true },
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
                          admin: { initCollapsed: true },
                          fields: [
                            { name: 'x', type: 'number', required: true },
                            { name: 'y', type: 'number', required: true },
                            {
                              name: 'label',
                              type: 'text',
                              localized: true,
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
                          admin: { initCollapsed: true },
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
                          admin: { initCollapsed: true },
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
                              admin: { initCollapsed: true },
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
    },
    // ─── §3 CASE STUDY ───────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { es: 'Sección Caso (§3)', en: 'Case Study Section (§3)' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'caseStudy',
          type: 'group',
          label: { es: 'Sección Caso (§3)', en: 'Case Study Section (§3)' },
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              localized: true,
              admin: { description: 'Eyebrow mono label (ej: §3 · CASO).' },
            },
            {
              name: 'h2Line1',
              type: 'text',
              localized: true,
              admin: { description: 'Primera línea del H2 (color texto dark principal).' },
            },
            {
              name: 'h2Line2Soft',
              type: 'text',
              localized: true,
              admin: { description: 'Segunda línea del H2 (gradient blue animado).' },
            },
            {
              name: 'lead',
              type: 'textarea',
              localized: true,
              admin: { description: 'Párrafo introductorio bajo el H2 (max ~220 chars).' },
            },
            {
              name: 'mediaChromeLabel',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Etiqueta mono del chrome del frame (ej: SIVAR-BRAINS · WhatsApp Business · live).',
              },
            },
            {
              name: 'mediaTimestamp',
              type: 'text',
              admin: {
                description: 'Timestamp decorativo del chrome (ej: captura · 23:04 viernes).',
              },
            },
            {
              name: 'mediaAsset',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description:
                  'Imagen estática 16:9 del caso. Si se prefiere video, usar videoPoster + videoSources.',
              },
            },
            {
              name: 'videoPoster',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description:
                  'Imagen poster del video del caso (mostrada antes de carga). Opcional.',
              },
            },
            {
              name: 'videoSources',
              type: 'array',
              minRows: 0,
              label: { en: 'Video Sources', es: 'Fuentes de Video' },
              admin: {
                initCollapsed: true,
                description:
                  'Fuentes de video del caso en orden de prioridad (mejor codec primero). Vacío → placeholder.',
              },
              fields: [
                {
                  name: 'src',
                  type: 'text',
                  required: true,
                  admin: { description: 'URL del archivo de video.' },
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
              name: 'phases',
              type: 'array',
              minRows: 3,
              maxRows: 3,
              label: { en: 'Case Phases', es: 'Fases del Caso' },
              admin: {
                initCollapsed: true,
                description:
                  'Las 3 fases del caso (Situación→Construcción→Operación). Exactamente 3.',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Tag temporal del phase (ej: Antes, 12 semanas, Hoy).' },
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  admin: {
                    description: 'Título de la fase (ej: Situación, Construcción, Operación).',
                  },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'Descripción de la fase (2-3 líneas).' },
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: { en: 'Icon (optional)', es: 'Ícono (opcional)' },
                  required: false,
                  options: Object.keys(Icons).map((key) => ({ label: key, value: key })),
                  admin: {
                    description:
                      'Ícono Lucide opcional junto al título de la fase (registry.ts D-108).',
                  },
                },
              ],
            },
            {
              name: 'timelineAttribution',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Atribución del Timeline (ej: En operación · Sivar Brains). Pill mono-xs con dot azul sobre el scroller.',
              },
            },
            {
              name: 'milestones',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              label: { en: 'Timeline Milestones', es: 'Hitos del Timeline' },
              admin: {
                initCollapsed: true,
                description:
                  'Hitos de trayectoria §4·B (Timeline). Independiente de phases[] (fases narrativas). Orden = orden visual en el scroller.',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  admin: {
                    description: 'Título del hito (ej: Primer cliente del cerebro de marca).',
                  },
                },
                {
                  name: 'note',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'Nota descriptiva breve del hito (1-2 líneas).' },
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: { en: 'Icon (optional)', es: 'Ícono (opcional)' },
                  required: false,
                  options: Object.keys(Icons).map((key) => ({ label: key, value: key })),
                  admin: {
                    description:
                      'Ícono Lucide del hito. Reutiliza el mismo registry que phase.icon (D-108 SSOT).',
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'next',
                  options: [
                    { label: { en: 'Active ✓', es: 'Activo ✓' }, value: 'active' },
                    { label: { en: 'In demo ◉', es: 'En demo ◉' }, value: 'demo' },
                    { label: { en: 'Upcoming ○', es: 'Próximo ○' }, value: 'next' },
                  ],
                  admin: {
                    description:
                      'Estado del hito: active=en producción, demo=conectando/en pruebas, next=próximo.',
                  },
                },
                {
                  name: 'statusLabel',
                  type: 'text',
                  localized: true,
                  admin: {
                    description:
                      'Texto del badge de estado (ej: Activo · En demo, conectándose · Próximo). Localized.',
                  },
                },
              ],
            },
            {
              name: 'quoteText',
              type: 'textarea',
              localized: true,
              admin: { description: 'Texto de la cita blockquote (display font grande).' },
            },
            {
              name: 'quoteCaption',
              type: 'text',
              localized: true,
              admin: {
                description: 'Atribución de la cita (mono-xs, ej: — Equipo BBF · Sivar Brains).',
              },
            },
            {
              name: 'ctaLabel',
              type: 'text',
              localized: true,
              admin: { description: 'Label del CTA link-arrow (ej: Leer el caso completo).' },
            },
            {
              name: 'ctaHref',
              type: 'text',
              defaultValue: '/casos/sivar-brains',
              admin: { description: 'URL destino del CTA.' },
            },
          ],
        },
      ],
    },
    // ─── §4 COMPARISON (POR QUÉ) ─────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { es: 'Sección Por Qué (§4)', en: 'Why Section (§4)' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'comparison',
          type: 'group',
          label: { es: 'Sección Por Qué (§4)', en: 'Why Section (§4)' },
          admin: {
            description: {
              en: '§4 comparison table: Why a brand brain vs agencies / consultants / SaaS.',
              es: '§4 tabla comparativa: Por qué un cerebro de marca vs agencias / consultoras / SaaS.',
            },
          },
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              localized: true,
              admin: { description: 'Eyebrow label (ej: §4 · POR QUÉ).' },
            },
            {
              name: 'h2Line1',
              type: 'text',
              localized: true,
              admin: { description: 'Primera línea del H2 (color primario).' },
            },
            {
              name: 'h2Line2Soft',
              type: 'text',
              localized: true,
              admin: { description: 'Segunda línea del H2 (tono muted).' },
            },
            {
              name: 'lead',
              type: 'textarea',
              localized: true,
              admin: { description: 'Párrafo introductorio bajo el H2 (max ~220 chars).' },
            },
            {
              name: 'columns',
              type: 'array',
              dbName: 'cmp_columns',
              label: { en: 'Table Columns', es: 'Columnas de la Tabla' },
              admin: {
                initCollapsed: true,
                description:
                  'Columnas de la tabla comparativa. Exactamente 1 columna debe tener isHighlighted=true (columna BBF).',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Nombre de la columna (ej: Cerebro de marca).' },
                },
                {
                  name: 'sub',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Sub-label de la columna (ej: Sistema propio).' },
                },
                {
                  name: 'isHighlighted',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description:
                      'Columna BBF destacada. Activa el crown pill "▼ BBF" y es el tab por defecto en mobile.',
                  },
                },
              ],
            },
            {
              name: 'rows',
              type: 'array',
              dbName: 'cmp_rows',
              label: { en: 'Table Rows', es: 'Filas de la Tabla' },
              admin: {
                initCollapsed: true,
                description: 'Filas de la tabla comparativa (dimensiones de comparación).',
              },
              fields: [
                {
                  name: 'attribute',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Nombre de la dimensión (ej: Aprende tu empresa).' },
                },
                {
                  name: 'cells',
                  type: 'array',
                  dbName: 'cmp_cells',
                  label: { en: 'Cells', es: 'Celdas' },
                  admin: {
                    initCollapsed: true,
                    description:
                      'Una celda por columna, en el mismo orden que las columnas definidas arriba.',
                  },
                  fields: [
                    {
                      name: 'state',
                      type: 'select',
                      required: true,
                      defaultValue: 'text',
                      options: [
                        { label: 'Sí ✓', value: 'yes' },
                        { label: 'No ✗', value: 'no' },
                        { label: 'Parcial —', value: 'mid' },
                        { label: 'Solo texto', value: 'text' },
                      ],
                      admin: {
                        description:
                          'Ícono de la celda (yes=✓ circulo, no=✗ circulo, mid=— circulo, text=solo texto).',
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      localized: true,
                      admin: { description: 'Texto de la celda.' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'epilogue',
              type: 'group',
              label: { en: 'Epilogue', es: 'Epílogo' },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Título del epílogo (ej: La diferencia operativa).' },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                  admin: {
                    description:
                      'Párrafos del epílogo separados por línea en blanco. Se renderizan como párrafos independientes.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // ─── §5 METHOD ───────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { es: 'Sección Método (§5)', en: 'Method Section (§5)' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'method',
          type: 'group',
          label: { es: 'Sección Método (§5)', en: 'Method Section (§5)' },
          admin: {
            description: {
              es: '§5 tres servicios coordinados: Diagnóstico → Build → Retainer.',
              en: '§5 three coordinated services: Diagnóstico → Build → Retainer.',
            },
          },
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              localized: true,
              admin: { description: 'Eyebrow label (ej: §5 · MÉTODO).' },
            },
            {
              name: 'h2Line1',
              type: 'text',
              localized: true,
              admin: { description: 'Primera línea del H2 (ej: Tres servicios coordinados.).' },
            },
            {
              name: 'h2Line2Soft',
              type: 'text',
              localized: true,
              admin: { description: 'Segunda línea del H2 en tono muted (ej: Sin sorpresas.).' },
            },
            {
              name: 'phases',
              type: 'array',
              dbName: 'mth_phases',
              label: { en: 'Process Bar Phases', es: 'Fases del Process Bar' },
              admin: {
                initCollapsed: true,
                description: 'Nodos del process bar horizontal (01 · Diagnóstico, etc.).',
              },
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  required: true,
                  admin: { description: 'Número del nodo (ej: 01).' },
                },
                {
                  name: 'shortLabel',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Etiqueta corta del nodo (ej: Diagnóstico).' },
                },
              ],
            },
            {
              name: 'services',
              type: 'array',
              dbName: 'mth_services',
              minRows: 3,
              maxRows: 3,
              label: { en: 'Service Cards', es: 'Tarjetas de Servicio' },
              admin: {
                initCollapsed: true,
                description: 'Los 3 servicios BBF (Diagnóstico / Build / Retainer). Exactamente 3.',
              },
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  required: true,
                  admin: { description: 'Número del servicio (ej: 01).' },
                },
                {
                  name: 'name',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Nombre del servicio (ej: Diagnóstico).' },
                },
                {
                  name: 'duration',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Duración (ej: 2 – 3 semanas).' },
                },
                {
                  name: 'commitment',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Compromiso (ej: Alcance cerrado · sin recurrencia).' },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'Descripción del servicio (2-3 líneas).' },
                },
                {
                  name: 'deliverables',
                  type: 'array',
                  dbName: 'mth_deliverables',
                  label: { en: 'Deliverables', es: 'Entregables' },
                  admin: {
                    initCollapsed: true,
                    description: 'Lista de entregables del servicio (3-4 items).',
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      localized: true,
                      admin: { description: 'Texto del entregable.' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'ctaLabel',
              type: 'text',
              localized: true,
              admin: { description: 'Texto del CTA link-arrow (ej: Conocer el método completo).' },
            },
            {
              name: 'ctaHref',
              type: 'text',
              defaultValue: '/metodo',
              admin: { description: 'URL destino del CTA.' },
            },
          ],
        },
      ],
    },
    // ─── §6 CLOSING ──────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { es: 'Sección Cierre (§6)', en: 'Closing Section (§6)' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'closing',
          type: 'group',
          label: { es: 'Sección Cierre (§6)', en: 'Closing Section (§6)' },
          admin: {
            description: {
              es: '§6 última sección del homepage. Surface dark. Statement + CTA principal + firma brand.',
              en: '§6 last homepage section. Dark surface. Statement + main CTA + brand signature.',
            },
          },
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              localized: true,
              defaultValue: '§6 · CIERRE',
              admin: { description: 'Eyebrow meta row izquierda (ej: §6 · CIERRE).' },
            },
            {
              name: 'brandLine',
              type: 'text',
              defaultValue: 'Sivar Brains',
              admin: {
                description:
                  'Nombre de marca en la meta row (asset fijo — editable por seguridad).',
              },
            },
            {
              name: 'brandYear',
              type: 'text',
              required: false,
              admin: {
                description:
                  'Año en la meta row. Si vacío → fallback dinámico new Date().getFullYear().',
              },
            },
            {
              name: 'statementLine1',
              type: 'text',
              localized: true,
              admin: {
                description: 'Primera línea del statement H2 display (color primario sobre dark).',
              },
            },
            {
              name: 'statementLine2Soft',
              type: 'text',
              localized: true,
              admin: {
                description: 'Segunda línea del statement H2 (red gradient animado — D-S6-06).',
              },
            },
            {
              name: 'ctaKey',
              type: 'text',
              admin: {
                description:
                  'Key de SiteCtaLibrary (ej: cierre-cta). Mismo patrón que hero.ctas[].ctaKey. Requiere que el item exista en admin → SiteCtaLibrary.',
              },
            },
            {
              name: 'ctaNote',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Nota bajo el CTA (ej: Diagnóstico cerrado · 2-3 semanas · sin compromiso).',
              },
            },
            {
              name: 'signatureTagline',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Tagline de la firma brand en pill (ej: No hay urgencia. Hay método.).',
              },
            },
          ],
        },
      ],
    },
    // ─── SEO / GEO ───────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { en: 'SEO + GEO Optimization', es: 'Optimización SEO + GEO' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'seo',
          type: 'group',
          label: { en: 'SEO + GEO Optimization', es: 'Optimización SEO + GEO' },
          admin: {
            description: {
              en: 'GEO Answer Capsules for AI citation (Perplexity, ChatGPT, Claude). One 40-60-word capsule per homepage section, ES + EN. Fill after TP-SEO-01 sign-off.',
              es: 'Answer Capsules GEO para citación IA (Perplexity, ChatGPT, Claude). Una cápsula de 40-60 palabras por sección del homepage, ES + EN. Completar tras firma TP-SEO-01.',
            },
          },
          fields: [
            {
              name: 'answerCapsules',
              type: 'array',
              label: { en: 'Answer Capsules', es: 'Answer Capsules' },
              maxRows: 6,
              admin: {
                initCollapsed: true,
                description: {
                  en: 'One capsule per homepage section (§1 Hero, §2 Capabilities, §3 Case, §4 Why, §5 Method). Fill ES + EN for each. 40-60 words each.',
                  es: 'Una cápsula por sección del homepage (§1 Hero, §2 Capacidades, §3 Caso, §4 Por qué, §5 Método). Completar ES + EN en cada una. 40-60 palabras.',
                },
              },
              fields: [
                {
                  name: 'sectionId',
                  type: 'select',
                  required: true,
                  options: [
                    { label: '§1 · Hero', value: 'hero' },
                    { label: '§2 · Capabilities', value: 'capabilities' },
                    { label: '§3 · Case Study', value: 'caseStudy' },
                    { label: '§4 · Why / Comparison', value: 'comparison' },
                    { label: '§5 · Method', value: 'method' },
                  ],
                  admin: {
                    description: 'Sección del homepage a la que responde esta cápsula.',
                  },
                },
                {
                  name: 'capsule',
                  type: 'textarea',
                  localized: true,
                  maxLength: 400,
                  admin: {
                    description:
                      'Texto de citación IA: responde directamente la pregunta implícita de la sección. 40-60 palabras. Sin filler. Sin marca registrada.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // ─── FIN SEO / GEO ───────────────────────────────────────────────────────
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
};
