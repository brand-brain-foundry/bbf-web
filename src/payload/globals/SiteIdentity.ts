import type { GlobalConfig } from 'payload';
import { publicRead, isAdmin } from '@/payload/lib/access';
import { revalidateGlobal } from '../hooks/revalidateGlobal';

/**
 * SiteIdentity — Entity Identity de la organización (single source of truth).
 *
 * Pre-implementación de una Entity Type "Organization" del sistema
 * ONTOLOGY PRIMITIVES (Entities, Topics, Clusters, Signals) que se
 * implementará en FASE 6. Cuando llegue ese momento, este global se
 * promueve a primer registro de la collection `Entities` sin pérdida de datos.
 *
 * Hoy:   1 organización canónica ("Sivar Brains")
 * FASE 6: collection escalable con N entities (Organizations, Persons, Products)
 *
 * Schema.org mapping:
 *   siteName         → Organization.name
 *   siteTagline      → Organization.slogan
 *   siteDescription  → Organization.description
 *   longDescription  → Organization.description (full)
 *   siteDomain       → Organization.url
 *   founders[].name  → Organization.founder[] (Person[] array — FASE 3.6 multi-founder)
 *   producer.name    → Organization.producer (Organization reference)
 *
 * FASE 3.6: founder group → founders array (3 co-fundadores: BBF + Sivar Films).
 * Multi-founder amplifica entity signal AEO/LLMO 2026 (Knowledge Panel + AI citations).
 *
 * Consume via getSiteIdentity() en src/config/site-identity.ts.
 * Alimenta: metadata HTML, Schema.org JSON-LD, llms.txt, sitemap,
 *           wordmark visible, content interpolation {{siteName}}, {{founderName}}, {{foundersList}}.
 */
export const SiteIdentity: GlobalConfig = {
  slug: 'site-identity',
  label: {
    en: 'Site Identity (Entity)',
    es: 'Identidad del Sitio (Entidad)',
  },
  access: { read: publicRead, update: isAdmin },
  admin: {
    group: {
      en: 'Site Settings',
      es: 'Configuración del Sitio',
    },
    description: {
      en: 'Canonical brand identity. ONE source of truth for name, domain, founder, schema, content interpolation. Editing here propagates everywhere (metadata, Schema.org, llms.txt, sitemap, {{siteName}} in content).',
      es: 'Identidad canónica de marca. UNA fuente de verdad para nombre, dominio, fundador, schema, interpolación de contenido. Editar acá se propaga en todo el sitio (metadata, Schema.org, llms.txt, sitemap, {{siteName}} en contenido).',
    },
  },
  fields: [
    // ── Core Identity ────────────────────────────────────────────────
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Sivar Brains',
      localized: true,
      admin: {
        description:
          'Nombre canónico de la marca. Aparece en title, OG, Schema, wordmark, llms.txt. Placeholder: {{siteName}}',
      },
    },
    {
      name: 'siteShortName',
      type: 'text',
      required: true,
      defaultValue: 'Sivar Brains',
      localized: true,
      admin: {
        description:
          'Versión corta para mobile/PWA manifest. Default igual al name si no aplica. Placeholder: {{siteShortName}}',
      },
    },
    {
      name: 'siteDomain',
      type: 'text',
      required: true,
      defaultValue: 'https://sivarbrains.com',
      admin: {
        description: 'URL canónica con protocolo. Sin trailing slash. Placeholder: {{siteDomain}}',
      },
    },
    {
      name: 'siteTagline',
      type: 'text',
      required: true,
      defaultValue: 'Construimos tu cerebro de marca', // C-1: corrige §6.3 prohibido "Cerebros de marca operacionales"
      localized: true,
      admin: {
        description:
          'Tagline corto para meta description fallback + Schema description. Placeholder: {{siteTagline}}',
      },
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      required: true,
      defaultValue:
        'Sivar Brains construye cerebros de marca para empresas: contenido, conversación, soporte e integraciones operando como sistema. No hay urgencia. Hay método.',
      localized: true,
      admin: {
        description:
          'Descripción media (150-300 chars). Meta description + OG + Schema. Placeholder: {{siteDescription}}',
      },
    },
    {
      name: 'longDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'Descripción larga para about page y Schema.org Organization.description completa. Placeholder: {{longDescription}}',
      },
    },

    // ── Org metadata (D-ALIGN-02 + D-ALIGN-05) ──────────────────────
    {
      name: 'foundingDate',
      type: 'text',
      label: { es: 'Fecha de fundación', en: 'Founding date' },
      admin: {
        description: {
          es: 'Formato YYYY-MM o YYYY-MM-DD (Schema.org Organization.foundingDate). Ej: 2025-10',
          en: 'Format YYYY-MM or YYYY-MM-DD (Schema.org Organization.foundingDate). E.g. 2025-10',
        },
        placeholder: '2025-10',
      },
      validate: (val: string | null | undefined) => {
        if (!val) return true;
        return /^\d{4}-\d{2}(-\d{2})?$/.test(val) || 'Format must be YYYY-MM or YYYY-MM-DD';
      },
    },
    {
      name: 'areaServed',
      type: 'array',
      label: { es: 'Áreas atendidas', en: 'Areas served' },
      admin: {
        initCollapsed: true,
        description: {
          es: 'Geografías que Sivar Brains atiende (Schema.org Organization.areaServed)',
          en: 'Geographies Sivar Brains serves (Schema.org Organization.areaServed)',
        },
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: ['Country', 'AdministrativeArea', 'Region', 'Place'],
          defaultValue: 'Country',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          localized: true,
        },
        {
          name: 'iso2',
          type: 'text',
          admin: { description: 'ISO 3166-1 alpha-2 (e.g. SV, US, MX)' },
        },
      ],
    },

    // ── Founders / Entity disambiguation ────────────────────────────
    {
      name: 'founders',
      type: 'array',
      label: { en: 'Founders', es: 'Co-fundadores' },
      minRows: 1,
      required: true,
      admin: {
        initCollapsed: true,
        description:
          'Co-fundadores de la organización. Schema.org Person array. Multi-founder amplifica entity signal AEO/LLMO 2026 (Knowledge Panel + AI citations). El primer founder (índice 0) alimenta {{founderName}}. Todos alimentan {{foundersList}}.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Nombre completo del co-fundador. Aparece en Schema.org Person.name.',
          },
        },
        {
          name: 'role',
          type: 'text',
          localized: true,
          admin: {
            description:
              'Rol por habilidades — NO títulos corporativos. Ej: "Co-fundador · Arquitecto del método". Schema.org Person.jobTitle.',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description:
              'Entity-home del founder (página personal, portafolio, o LinkedIn). Schema.org Person.url.',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            description: 'URL LinkedIn del founder. Schema.org Person.sameAs.',
          },
        },
        {
          name: 'affiliation',
          type: 'text',
          admin: {
            description:
              'Organización aliada. Ej: "Brand Brain Foundry" o "Sivar Films". Schema.org Person.affiliation.name.',
          },
        },
      ],
    },

    // ── Producer (BBF como foundry constructora) ─────────────────────
    {
      name: 'producer',
      type: 'group',
      label: { en: 'Producer', es: 'Productora' },
      admin: {
        description:
          'La foundry que construye el sistema. Solo aparece en Schema.org para entity disambiguation.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          defaultValue: 'Brand Brain Foundry',
          admin: { description: 'Placeholder: {{producerName}}' },
        },
        {
          name: 'url',
          type: 'text',
          defaultValue: '',
        },
      ],
    },

    // ── SEO config ───────────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'defaultLocale',
          type: 'select',
          defaultValue: 'es_SV',
          options: [
            { label: 'Español (SV)', value: 'es_SV' },
            { label: 'Español', value: 'es' },
            { label: 'English (US)', value: 'en_US' },
          ],
          admin: { description: 'Locale OG primario (og:locale).' },
        },
        {
          name: 'twitterHandle',
          type: 'text',
          defaultValue: '',
          admin: { description: 'Handle Twitter/X con @. Vacío si no aplica.' },
        },
        {
          name: 'ogImagePath',
          type: 'text',
          defaultValue: '/og-image.png',
          admin: { description: 'Path relativo a la imagen OG default (1200x630).' },
        },
        {
          name: 'themeColor',
          type: 'text',
          defaultValue: '#0a0a0a',
          admin: { description: 'Color para manifest + meta theme-color. Hex.' },
        },
      ],
    },

    // ── Status Banner ────────────────────────────────────────────────
    {
      name: 'statusBanner',
      type: 'group',
      label: { en: 'Status Banner', es: 'Banner de Estado' },
      admin: {
        description:
          'Banner de estado visible en nav (ej: "Beta", "Lanzamiento próximo"). Consumer: Header organism.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Mostrar u ocultar el banner en Nav.' },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: { description: 'Texto del pill de estado.' },
        },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'URL opcional al hacer click en el banner.' },
        },
        {
          name: 'dotColor',
          type: 'text',
          defaultValue: '#3b82f6',
          admin: { description: 'Color hex del dot indicador.' },
        },
      ],
    },

    // ── Organization Entity reference (D-ALIGN-42) ────────────────────
    // Pointer explícito a la Entity canónica de la organización en la
    // collection Entities. SSOT para JSON-LD Organization (StructuredData.tsx)
    // + cualquier consumer futuro. Permite deprecar Site legacy global
    // (que también tenía organizationEntity, sin consumers de código).
    {
      name: 'organizationEntity',
      type: 'relationship',
      relationTo: 'entities',
      filterOptions: { kind: { equals: 'organization' } },
      label: { en: 'Organization Entity', es: 'Entidad Organización' },
      admin: {
        description: {
          en: 'Canonical organization entity (D-ALIGN-42). Links to Entities collection. Powers StructuredData JSON-LD. Only organization-type entities shown.',
          es: 'Entidad canónica de la organización (D-ALIGN-42). Enlaza a la collection Entities. Alimenta StructuredData JSON-LD. Solo se muestran entidades tipo organización.',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
};
