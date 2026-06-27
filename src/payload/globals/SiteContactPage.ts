import type { GlobalConfig } from 'payload';
import { publicRead, isAdmin } from '@/payload/lib/access';
import { revalidateGlobal } from '../hooks/revalidateGlobal';

export const SiteContactPage: GlobalConfig = {
  slug: 'site-contact-page',
  label: {
    en: 'Contact Page',
    es: 'Página de Contacto',
  },
  access: { read: publicRead, update: isAdmin },
  admin: {
    group: {
      en: 'Site Settings',
      es: 'Configuración del Sitio',
    },
    description: {
      en: 'Contact page content: hero, steps, form config, microcopy, FAQ, SEO. Single source of truth (W-2). Emails live in SiteContact.',
      es: 'Contenido de /contacto: hero, pasos, config form, microcopy, FAQ, SEO. Fuente única (W-2). Emails viven en SiteContact.',
    },
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    // ─── §1 HERO ─────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { en: 'Hero', es: 'Hero' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'hero',
          type: 'group',
          label: { en: 'Hero', es: 'Hero' },
          fields: [
            {
              name: 'heading',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'H1 principal. ES: "Sentémonos a pensar." / EN: "Let\'s think this through."',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Subtítulo italic. ES: "No hay urgencia. Hay método." / EN: "No rush. A method."',
              },
            },
            {
              name: 'lede',
              type: 'textarea',
              localized: true,
              admin: {
                description:
                  'Texto de apertura (1-2 frases). ES: "Contános dónde está…" / EN: "Tell us where…"',
              },
            },
            {
              name: 'anchorPhrase',
              type: 'textarea',
              localized: true,
              admin: {
                description:
                  'Frase ancla GEO/AEO 40-80 palabras (§1.4 ContentMaster). No se renderiza en el body — se usa en llms.txt y metadatos estructurados.',
              },
            },
          ],
        },
      ],
    },

    // ─── §2 STEPS "QUÉ PASA DESPUÉS" ─────────────────────────────────────────
    {
      type: 'collapsible',
      label: { en: 'Steps — What Happens Next', es: 'Pasos — Qué Pasa Después' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'stepsEyebrow',
          type: 'text',
          localized: true,
          admin: {
            description:
              'Eyebrow del bloque de pasos. ES: "QUÉ PASA DESPUÉS" / EN: "WHAT HAPPENS NEXT"',
          },
        },
        {
          name: 'steps',
          type: 'array',
          label: { en: 'Steps', es: 'Pasos' },
          labels: {
            singular: { en: 'Step', es: 'Paso' },
            plural: { en: 'Steps', es: 'Pasos' },
          },
          admin: {
            description: '4 pasos del proceso post-contacto. Se muestran antes del form.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              admin: {
                description: 'Título del paso en negrita.',
              },
            },
            {
              name: 'body',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Descripción breve del paso.',
              },
            },
          ],
        },
      ],
    },

    // ─── §3 FORM CONFIG ───────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { en: 'Form Configuration', es: 'Configuración del Formulario' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'formConfig',
          type: 'group',
          label: { en: 'Form Config', es: 'Config del Form' },
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              admin: {
                description: 'Título del form-card. ES: "Nuevo mensaje" / EN: "New message"',
              },
            },
            {
              name: 'stageLabel',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Label del chip group "En qué estás". ES: "En qué estás (opcional)" / EN: "Where you\'re at (optional)"',
              },
            },
            {
              name: 'stageOptions',
              type: 'array',
              dbName: 'cp_stage',
              label: { en: 'Stage Options (chips)', es: 'Opciones de Etapa (chips)' },
              labels: {
                singular: { en: 'Option', es: 'Opción' },
                plural: { en: 'Options', es: 'Opciones' },
              },
              admin: {
                description:
                  '4 chips del recorrido canónico. Label localized, value slug no-localized.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Texto visible del chip.' },
                },
                {
                  name: 'value',
                  type: 'text',
                  admin: {
                    description:
                      'Valor slug (no localized). Ej: "exploring", "diagnosis", "build", "operating".',
                  },
                },
              ],
            },
            {
              name: 'roleLabel',
              type: 'text',
              localized: true,
              admin: {
                description: 'Label del dropdown Rol. ES: "Rol (opcional)" / EN: "Role (optional)"',
              },
            },
            {
              name: 'roleOptions',
              type: 'array',
              dbName: 'cp_role',
              label: { en: 'Role Options (dropdown)', es: 'Opciones de Rol (dropdown)' },
              labels: {
                singular: { en: 'Option', es: 'Opción' },
                plural: { en: 'Options', es: 'Opciones' },
              },
              admin: {
                description:
                  '5 opciones del dropdown de rol. Label localized, value slug no-localized.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Texto visible de la opción.' },
                },
                {
                  name: 'value',
                  type: 'text',
                  admin: {
                    description:
                      'Valor slug (no localized). Ej: "founder", "marketing", "ops", "sales", "other".',
                  },
                },
              ],
            },
            {
              name: 'messagePlaceholder',
              type: 'textarea',
              localized: true,
              admin: {
                description:
                  'Placeholder del campo Mensaje. ES: "Contános dónde está tu marca hoy…" / EN: "Tell us where your brand is today…"',
              },
            },
            {
              name: 'requiredHint',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Texto al pie del form. ES: "Los campos marcados son obligatorios." / EN: "Required fields are marked."',
              },
            },
            {
              name: 'submitLabel',
              type: 'text',
              localized: true,
              admin: {
                description: 'Label del botón submit. ES: "Enviar mensaje" / EN: "Send message"',
              },
            },
          ],
        },
      ],
    },

    // ─── §4 MICROCOPY ─────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { en: 'Microcopy (Form States)', es: 'Microcopy (Estados del Form)' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'microcopy',
          type: 'group',
          label: { en: 'Microcopy', es: 'Microcopy' },
          fields: [
            {
              name: 'successTitle',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Título estado éxito. ES: "Listo. Te respondemos en 24h hábiles." / EN: "Done. We\'ll reply within 24 business hours."',
              },
            },
            {
              name: 'successBody',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Cuerpo opcional del estado éxito (confirmación adicional).',
              },
            },
            {
              name: 'otherChannelsLabel',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Texto del bloque "Otros canales" (D-07=A). ES: "Si preferís escribir directamente:" / EN: "If you prefer to write directly:"',
              },
            },
            {
              name: 'otherChannelsNote',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Nota al pie de canales. ES: "Misma persona, misma respuesta." / EN: "Same person, same response."',
              },
            },
          ],
        },
      ],
    },

    // ─── §5 FAQ ───────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { en: 'FAQ (Contact-specific)', es: 'FAQ (Específicas de /contacto)' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'faqHeading',
          type: 'text',
          localized: true,
          admin: {
            description:
              'H2 del bloque FAQ. ES: "Preguntas frecuentes" / EN: "Frequently asked questions"',
          },
        },
        {
          name: 'faq',
          type: 'array',
          dbName: 'cp_faq',
          label: { en: 'FAQs', es: 'FAQs' },
          labels: {
            singular: { en: 'FAQ', es: 'FAQ' },
            plural: { en: 'FAQs', es: 'FAQs' },
          },
          admin: {
            description: '5 preguntas contacto-specific. NO duplicar /como-trabajamos FAQs.',
          },
          fields: [
            {
              name: 'question',
              type: 'text',
              localized: true,
              admin: { description: 'Pregunta (H3 candidate).' },
            },
            {
              name: 'answer',
              type: 'textarea',
              localized: true,
              admin: { description: 'Respuesta. Puede incluir {{contactEmail}} como token.' },
            },
          ],
        },
      ],
    },

    // ─── §6 SEO ───────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: { en: 'SEO', es: 'SEO' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'seo',
          type: 'group',
          label: { en: 'SEO', es: 'SEO' },
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Meta title. ES: "Sentémonos a pensar · Contacto · {{siteName}}" (target 45 chars). EN: similar.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              localized: true,
              admin: {
                description:
                  'Meta description (target 150-160 chars). ES: 157 chars con trust signals (ver SEO-AEO-contacto-SB §4).',
              },
            },
          ],
        },
      ],
    },
  ],
};
