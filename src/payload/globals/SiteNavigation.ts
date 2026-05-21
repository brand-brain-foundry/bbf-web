import type { GlobalConfig } from 'payload';
import { publicRead, isAdmin } from '@/payload/lib/access';
import { revalidateGlobal } from '../hooks/revalidateGlobal';

export const SiteNavigation: GlobalConfig = {
  slug: 'site-navigation',
  label: {
    en: 'Site Navigation',
    es: 'Navegación del Sitio',
  },
  access: { read: publicRead, update: isAdmin },
  admin: {
    group: {
      en: 'Site Settings',
      es: 'Configuración del Sitio',
    },
    description: {
      en: 'Navigation structure: header + footer links. Source of truth for navegación.',
      es: 'Estructura de navegación: links header + footer. Fuente única.',
    },
  },
  fields: [
    {
      name: 'headerLinks',
      type: 'array',
      label: {
        en: 'Header Navigation Links',
        es: 'Links Navegación Header',
      },
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: { en: 'Link', es: 'Link' },
        plural: { en: 'Links', es: 'Links' },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: {
            description: 'Path relativo (ej. /metodo o /casos). NO incluir locale prefix.',
          },
        },
        // === Wave 8: mega-menu sub-links ===
        {
          name: 'hasSubMenu',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Si está activo, al hacer hover/click se abre mega-menu con sub-links.',
          },
        },
        {
          name: 'subLinks',
          type: 'array',
          maxRows: 8,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.hasSubMenu),
            description: 'Sub-links del mega-menu (visibles al hacer hover/click en desktop).',
          },
          labels: {
            singular: { en: 'Sub-link', es: 'Sub-link' },
            plural: { en: 'Sub-links', es: 'Sub-links' },
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              maxLength: 120,
              admin: {
                description: 'Descripción corta opcional (ej: "El proceso paso a paso").',
              },
            },
            {
              name: 'mediaType',
              type: 'select',
              defaultValue: 'none',
              required: true,
              options: [
                { label: { en: 'None (label only)', es: 'Solo label' }, value: 'none' },
                { label: { en: 'Image', es: 'Imagen' }, value: 'image' },
                { label: { en: 'Video', es: 'Video' }, value: 'video' },
              ],
            },
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.mediaType === 'image' || siblingData?.mediaType === 'video',
                description: 'Imagen o video preview (solo si mediaType ≠ none).',
              },
            },
          ],
        },
        // === END Wave 8 ===
      ],
    },
    {
      name: 'headerCta',
      type: 'group',
      label: {
        en: 'Header CTA Button',
        es: 'Botón CTA Header',
      },
      admin: {
        description: 'CTA destacado en header (D-BBF-KB-100). Junto a LanguageSwitcher.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/contacto',
        },
        {
          name: 'intent',
          type: 'select',
          required: true,
          defaultValue: 'primary',
          options: [
            { label: 'Primary (black)', value: 'primary' },
            { label: 'Secondary (red)', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
    {
      name: 'footerGroups',
      type: 'array',
      label: {
        en: 'Footer Link Groups',
        es: 'Grupos de Links del Footer',
      },
      maxRows: 5,
      labels: {
        singular: { en: 'Footer Group', es: 'Grupo de Footer' },
        plural: { en: 'Footer Groups', es: 'Grupos de Footer' },
      },
      admin: {
        description: {
          en: 'Footer link groups (e.g. Navigation, Resources, Company)',
          es: 'Grupos de links del footer (e.g. Navegación, Recursos, Empresa)',
        },
      },
      fields: [
        {
          name: 'groupTitle',
          type: 'text',
          localized: true,
          required: true,
          admin: {
            description: 'Title of the group (e.g. "Navigation"). Shown in uppercase canon.',
          },
        },
        {
          name: 'links',
          type: 'array',
          minRows: 1,
          maxRows: 10,
          labels: {
            singular: { en: 'Link', es: 'Link' },
            plural: { en: 'Links', es: 'Links' },
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              admin: {
                description: 'Relative path (e.g. /metodo). No locale prefix.',
              },
            },
            {
              name: 'flag',
              type: 'text',
              localized: true,
              admin: {
                description: 'Optional badge text (e.g. "New", "Beta", "Soon"). Empty = no badge.',
              },
            },
            {
              name: 'flagVariant',
              type: 'select',
              defaultValue: 'default',
              options: [
                { label: { en: 'Default', es: 'Default' }, value: 'default' },
                { label: { en: 'Accent (red)', es: 'Accent (rojo)' }, value: 'accent' },
                { label: { en: 'Success (green)', es: 'Éxito (verde)' }, value: 'success' },
                { label: { en: 'Beta (blue)', es: 'Beta (azul)' }, value: 'beta' },
              ],
              admin: {
                description: 'Badge color variant (visible only if flag has text).',
                condition: (_, siblingData) => Boolean(siblingData?.flag),
              },
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
