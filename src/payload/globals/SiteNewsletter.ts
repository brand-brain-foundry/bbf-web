import type { GlobalConfig } from 'payload';
import { publicRead, isAdmin } from '@/payload/lib/access';
import { revalidateGlobal } from '../hooks/revalidateGlobal';

export const SiteNewsletter: GlobalConfig = {
  slug: 'site-newsletter',
  label: {
    en: 'Newsletter',
    es: 'Newsletter',
  },
  admin: {
    group: {
      en: 'Site Settings',
      es: 'Configuración del Sitio',
    },
    description: {
      en: 'Newsletter subscription content (D-BBF-KB-103). Copy editable.',
      es: 'Contenido suscripción newsletter (D-BBF-KB-103). Copy editable.',
    },
  },
  access: {
    read: publicRead,
    update: isAdmin,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Habilita o deshabilita newsletter site-wide.',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Cerebros de marca, cada quince días.',
      admin: {
        description: 'Título principal newsletter box (footer).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: true,
      maxLength: 200,
      defaultValue:
        'Pensamiento aplicado sobre construcción de marca, sistemas e inteligencia. Sin ruido. Sin spam.',
      admin: {
        description: 'Descripción corta value prop (max 200 chars).',
      },
    },
    {
      name: 'emailPlaceholder',
      type: 'text',
      localized: true,
      defaultValue: 'tu@email.com',
    },
    {
      name: 'submitLabel',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Suscribirme',
    },
    {
      name: 'submittingLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Enviando…',
    },
    {
      name: 'successTitle',
      type: 'text',
      localized: true,
      defaultValue: 'Revisá tu email',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      localized: true,
      defaultValue: 'Te enviamos un link para confirmar tu suscripción. Si no lo ves, revisá spam.',
    },
    {
      name: 'privacyNote',
      type: 'text',
      localized: true,
      defaultValue: 'No compartimos tu email. Podés darte de baja cuando quieras.',
      admin: {
        description: 'Nota privacidad debajo del input (microcopy canon).',
      },
    },
    {
      name: 'confirmationEmailSubject',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Confirmá tu suscripción a BBF Newsletter',
    },
    {
      name: 'confirmationEmailBody',
      type: 'textarea',
      localized: true,
      required: true,
      defaultValue:
        'Hacé click en el link de abajo para confirmar tu suscripción. Sin esto, no te enviamos nada. Esa es nuestra promesa.',
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
};
