import type { GlobalConfig } from 'payload';
import { isAdmin } from '@/payload/lib/access';

export const SiteContact: GlobalConfig = {
  slug: 'site-contact',
  label: {
    en: 'Site Contact',
    es: 'Contacto del Sitio',
  },
  // D-BBF-KB-99: contact metadata NOT public-read (no email scrapers)
  access: { read: isAdmin, update: isAdmin },
  admin: {
    group: {
      en: 'Site Settings',
      es: 'Configuración del Sitio',
    },
    description: {
      en: 'Contact metadata (NOT rendered as mailto in front per D-BBF-KB-99). Used for: JSON-LD Schema.org, contact form recipient, admin reference.',
      es: 'Metadata de contacto (NO se renderiza como mailto en front, D-BBF-KB-99). Usado para JSON-LD, recipient form, referencia admin.',
    },
  },
  fields: [
    {
      name: 'primaryEmail',
      type: 'email',
      required: true,
      defaultValue: 'contacto@brandbrainfoundry.com',
      admin: {
        description: 'Email principal (recipient form contacto). NO renderizado en front.',
      },
    },
    {
      name: 'fallbackEmail',
      type: 'email',
      defaultValue: 'hola@brandbrainfoundry.com',
      admin: {
        description: 'Email fallback solo para mensajes de error técnico interno.',
      },
    },
    {
      name: 'fromEmail',
      type: 'email',
      required: true,
      defaultValue: 'web@brandbrainfoundry.com',
      admin: {
        description: 'Email FROM para envíos transaccionales (Resend domain verified).',
      },
    },
  ],
};
