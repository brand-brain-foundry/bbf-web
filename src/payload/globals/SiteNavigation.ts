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
      name: 'footerLinks',
      type: 'array',
      label: {
        en: 'Footer Navigation Links',
        es: 'Links Navegación Footer',
      },
      maxRows: 8,
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
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
};
