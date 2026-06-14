import type { GlobalConfig } from 'payload';

import { isAdmin, publicRead } from '@/payload/lib/access';
import { revalidateGlobal } from '../hooks/revalidateGlobal';

/**
 * SiteCtaLibrary — fuente única de CTAs cross-site (D-DS-18, D-NAV-11)
 *
 * Catálogo de CTAs con key canónico. Consumers (nav, homepage, etc.) referencian
 * el key y obtienen label localizado + intent/type desde aquí.
 * linkTarget es responsabilidad del consumer (contexto-específico).
 *
 * Ejemplo: key='watch-it-run' → label ES/EN + type=solid + intent=primary.
 */
export const SiteCtaLibrary: GlobalConfig = {
  slug: 'site-cta-library',
  label: {
    en: 'CTA Library',
    es: 'Catálogo de CTAs',
  },
  access: { read: publicRead, update: isAdmin },
  admin: {
    group: {
      en: 'Site Settings',
      es: 'Configuración del Sitio',
    },
    description: {
      en: 'Single source of truth for all cross-site CTA labels and styles (D-DS-18, D-NAV-11).',
      es: 'Fuente única para todos los labels y estilos de CTA cross-site (D-DS-18, D-NAV-11).',
    },
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: { en: 'CTA Items', es: 'Items CTA' },
      labels: {
        singular: { en: 'CTA', es: 'CTA' },
        plural: { en: 'CTAs', es: 'CTAs' },
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          admin: {
            description:
              'Identificador único (e.g. "watch-it-run"). Usado como ctaKey en nav y consumers.',
          },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'solid',
          options: [
            { label: 'Solid', value: 'solid' },
            { label: 'Outline', value: 'outline' },
          ],
        },
        {
          name: 'intent',
          type: 'select',
          required: true,
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Black', value: 'black' },
            { label: 'Red', value: 'red' },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
};
