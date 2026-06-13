import type { GlobalConfig, Field } from 'payload';
import { publicRead, isAdmin } from '@/payload/lib/access';
import { ROUTE_KEYS } from '@/i18n/pathnames';
import { revalidateGlobal } from '../hooks/revalidateGlobal';

/**
 * Link target polimórfico — L1 Opción C (firma Zavala 2026-06-13).
 * Reusa el patrón D-ONTOLOGY-03 (Surfaces contentItemRef|globalRef): dos refs, uno activo.
 *   routeKey → ruta canónica file-based (SSOT = src/i18n/pathnames.ts). Para cornerstones.
 *   page     → página dinámica (relationship→pages). DORMIDO hasta primera Page dinámica.
 * Resolución en consumer (L2): getPathname(locale, routeKey ?? page.path).
 * Factory (no objeto compartido) para evitar mutación de referencia entre campos.
 */
const ROUTE_KEY_OPTIONS = ROUTE_KEYS.map((k) => ({ label: k, value: k }));

const linkTargetField = (): Field => ({
  name: 'linkTarget',
  type: 'group',
  label: { en: 'Link target', es: 'Destino del link' },
  admin: {
    description:
      'Destino agnóstico: elegí routeKey (ruta canónica) o page (página dinámica). SSOT, sin texto libre.',
  },
  fields: [
    {
      name: 'routeKey',
      type: 'select',
      options: ROUTE_KEY_OPTIONS,
      admin: {
        description:
          'Ruta canónica (SSOT routing.ts pathnames). Usar para cornerstones / rutas fijas.',
      },
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        description: 'Página dinámica (alternativa a routeKey). Dormido hasta que existan Pages.',
      },
    },
  ],
});

/**
 * subLink target polimórfico — L3 (D-NAV-9, firma Zavala 2026-06-13).
 *   page     → página HIJA (relationship→pages). href deriva de page.path (SSOT).
 *   external → URL externa cruda (escape hatch, sin SSOT — solo fuera del sitio).
 * Anchors de sección DIFERIDOS a 4.C.3 (Pages no tiene modelo de secciones hoy).
 */
const subLinkTargetField = (): Field => ({
  name: 'linkTarget',
  type: 'group',
  label: { en: 'Sub-link target', es: 'Destino del sub-link' },
  admin: {
    description: 'Destino agnóstico: page (página hija) o external (URL externa). Anchors → 4.C.3.',
  },
  fields: [
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: { description: 'Página hija (D-NAV-9). href deriva de page.path (SSOT).' },
    },
    {
      name: 'external',
      type: 'text',
      admin: {
        description: 'URL externa cruda (escape hatch, sin SSOT). Solo links fuera del sitio.',
      },
    },
  ],
});

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
        // D-NAV-8 Opción C: destino agnóstico SSOT (href texto libre eliminado en L2).
        linkTargetField(),
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
            // L3 (D-NAV-9): destino agnóstico SSOT del sub-link (href texto libre eliminado).
            subLinkTargetField(),
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
        // D-NAV-8 Opción C: destino agnóstico SSOT (href eliminado en L2). type/text-cta → D-NAV-11 (L2+).
        linkTargetField(),
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
            // D-NAV-8 Opción C: destino agnóstico SSOT (href eliminado en L2).
            linkTargetField(),
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
