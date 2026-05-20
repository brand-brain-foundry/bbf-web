import type { GlobalConfig } from 'payload';
import { publicRead, isAdmin } from '@/payload/lib/access';
import { revalidateGlobal } from '../hooks/revalidateGlobal';

export const SiteIdentity: GlobalConfig = {
  slug: 'site-identity',
  label: {
    en: 'Site Identity',
    es: 'Identidad del Sitio',
  },
  access: { read: publicRead, update: isAdmin },
  admin: {
    group: {
      en: 'Site Settings',
      es: 'Configuración del Sitio',
    },
    description: {
      en: 'Brand identity: name, tagline, description. Source of truth for header, footer, and metadata.',
      es: 'Identidad de marca: nombre, tagline, descripción. Fuente única para header, footer y metadata.',
    },
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Brand Brain Foundry',
      admin: {
        description: 'Nombre oficial del sitio. Aparece en header logo.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Piensa, y que trabaje tu marca.',
      admin: {
        description: 'Eslogan corto (D-BBF-COPY-01). Aparece en footer bajo logo.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      required: true,
      maxLength: 200,
      defaultValue:
        'Foundry de cerebros de marca. Construimos sistemas de inteligencia de marca propios, propietarios y portables.',
      admin: {
        description:
          'Descripción corta (max 200 chars). Footer bajo logo + meta description default.',
      },
    },
    {
      name: 'longDescription',
      type: 'textarea',
      localized: true,
      maxLength: 600,
      admin: {
        description:
          'Descripción larga (max 600 chars). Used para Open Graph + JSON-LD Schema.org.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
};
