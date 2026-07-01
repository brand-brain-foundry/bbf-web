import { getSiteIdentity, getSiteHomepageCapabilities } from '@/config/site';
import { getEntityBySlug } from '@/lib/data/entities';
import { interpolate } from '@/lib/content-interpolation';
import { SITE_NAME_FALLBACK } from '@/lib/brand';

/**
 * StructuredData — Schema.org JSON-LD @graph para entity disambiguation.
 *
 * @graph (layout-level, todas las páginas):
 *   Organization SB + Person[] founders + Organization[] affiliated + WebSite + Service×5
 *
 * WebPage y FAQPage se añaden per-page en page.tsx (homepage-specific).
 *
 * FASE 3.6 — L-BBF-240: @id canonical bajo siteDomain.
 * Sprint 1: Service×5 @ids heredables por páginas internas ({domain}/#service-{slug}).
 */

/** NFD normalize → strip diacritics → kebab slug */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Strip stray trailing quotes/whitespace from admin text fields */
function cleanField(value: string | null | undefined): string {
  return (value ?? '').replace(/["]+$/, '').trim();
}

/** Normalize URL for shared-URL comparison */
function normalizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  return url.trim().toLowerCase().replace(/\/$/, '');
}

type FounderLike = { name?: string | null; url?: string | null };

/**
 * Person.url: null when URL is shared with another founder.
 * Shared URL = entity-home of the Organization, not the individual Person.
 * D1 = A (firmada Zavala, FASE 3.6).
 */
function getPersonUrl(founder: FounderLike, allFounders: FounderLike[]): string | null {
  if (!founder.url) return null;
  const sharedWithOther = allFounders.some(
    (other) =>
      other.name !== founder.name &&
      other.url &&
      normalizeUrl(other.url) === normalizeUrl(founder.url),
  );
  return sharedWithOther ? null : founder.url;
}

/**
 * Organization.url: derived from the first founder with that affiliation.
 * Never hardcoded — only data Zavala entered in admin (L-BBF-240).
 */
function getOrgUrl(
  affiliationName: string,
  founders: Array<{ affiliation?: string | null; url?: string | null }>,
): string | null {
  return founders.find((f) => cleanField(f.affiliation) === affiliationName)?.url ?? null;
}

export async function StructuredData({ locale }: { locale: string }) {
  const l = locale === 'en' ? 'en' : 'es';
  const site = await getSiteIdentity(l);

  const domain = site.siteDomain;
  const founders = site.founders ?? [];

  // D-ALIGN-41: sameAs lee de Entity 'sivar-brains' (solo perfiles externos, no dominio propio)
  // D-ALIGN-45: knowsAbout lee de Entity.organization.knowsAbout (no SiteIdentity.schemaKnowsAbout)
  // Sprint 1: Entity 'christian-zavala' para sameAs completo (linkedin + github) de Person Zavala
  const [orgEntity, zavalaEntity] = await Promise.all([
    getEntityBySlug('sivar-brains', l),
    getEntityBySlug('christian-zavala', l),
  ]);

  const rawKnowsAbout = (orgEntity?.organization?.knowsAbout ?? []) as Array<
    { name?: string | null } | number
  >;
  const knowsAbout = rawKnowsAbout
    .map((t) => (typeof t === 'object' && t !== null ? t.name : null))
    .filter(Boolean);
  const sameAs = (orgEntity?.sameAs ?? []).map((s) => s.url).filter(Boolean);
  // SiteIdentity.ts:20: longDescription → Organization.description (full); fallback a siteDescription
  const orgDescription = await interpolate(site.longDescription || site.siteDescription, l);

  // zavala sameAs: linkedin + github (de Entity 'christian-zavala')
  const zavalaSameAs = (zavalaEntity?.sameAs ?? []).map((s) => s.url).filter(Boolean);

  // Service×5: @id heredable por páginas internas Sprint 1 G-04
  const capItems = await getSiteHomepageCapabilities(l);

  // ── Person nodes — @id always under siteDomain (L-BBF-240) ─────────────
  const personNodes = founders.map((f) => {
    const slug = slugify(f.name ?? '');
    const personUrl = getPersonUrl(f, founders);
    const affiliationName = cleanField(f.affiliation);

    // Zavala gets full sameAs from Entity (linkedin + github); others keep linkedin only
    const isZavala = f.name === 'Christian Zavala';
    const personSameAs =
      isZavala && zavalaSameAs.length > 0 ? zavalaSameAs : f.linkedin ? [f.linkedin] : undefined;

    return {
      '@type': 'Person',
      '@id': `${domain}/#${slug}-person`,
      name: f.name,
      ...(f.role ? { jobTitle: f.role } : {}),
      ...(personUrl ? { url: personUrl } : {}),
      ...(personSameAs ? { sameAs: personSameAs } : {}),
      ...(affiliationName
        ? {
            affiliation: {
              '@type': 'Organization',
              '@id': `${domain}/#${slugify(affiliationName)}-org`,
              name: affiliationName,
            },
          }
        : {}),
      worksFor: [{ '@id': `${domain}/#org` }],
    };
  });

  const founderRefs = personNodes.map((p) => ({ '@id': p['@id'] }));

  // ── Affiliated Organization nodes — derived from founders, never hardcoded ─
  const orgsMap = new Map<string, { name: string; url: string | null }>();
  founders.forEach((f) => {
    const name = cleanField(f.affiliation);
    if (name && !orgsMap.has(name)) {
      orgsMap.set(name, { name, url: getOrgUrl(name, founders) });
    }
  });

  const affiliatedOrgs = Array.from(orgsMap.values()).map((org) => ({
    '@type': 'Organization',
    '@id': `${domain}/#${slugify(org.name)}-org`,
    name: org.name,
    ...(org.url ? { url: org.url } : {}),
  }));

  // ── Service×5 nodes (@id heredable por páginas internas) ─────────────────
  const serviceNodes = capItems.map((item, i) => ({
    '@type': 'Service',
    '@id': `${domain}/#service-${item.slug.replace(/^#+/, '').trim()}`,
    name: item.title ?? item.slug,
    ...(item.lede ? { description: item.lede } : {}),
    provider: { '@id': `${domain}/#org` },
    serviceType: 'BrandBrainService',
  }));

  const serviceList =
    serviceNodes.length > 0
      ? [
          {
            '@type': 'ItemList',
            '@id': `${domain}/#service-list`,
            name:
              l === 'en'
                ? `${site.siteName ?? SITE_NAME_FALLBACK} Services`
                : `Servicios de ${site.siteName ?? SITE_NAME_FALLBACK}`,
            numberOfItems: serviceNodes.length,
            itemListElement: serviceNodes.map((svc, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: { '@id': svc['@id'] },
            })),
          },
          ...serviceNodes,
        ]
      : [];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${domain}/#org`,
        name: site.siteName,
        url: domain,
        logo: {
          '@type': 'ImageObject',
          url: `${domain}/icon-512.png`,
          width: 512,
          height: 512,
        },
        description: orgDescription,
        foundingDate: '2025-10',
        founder: founderRefs.length > 0 ? founderRefs : undefined,
        knowsAbout,
        sameAs,
        knowsLanguage: ['es', 'en'],
        areaServed: [
          { '@type': 'Country', name: 'El Salvador', addressCountry: 'SV' },
          { '@type': 'AdministrativeArea', name: 'Latin America' },
        ],
      },
      ...personNodes,
      ...affiliatedOrgs,
      {
        '@type': 'WebSite',
        '@id': `${domain}/#website`,
        url: domain,
        name: site.siteName,
        publisher: { '@id': `${domain}/#org` },
        inLanguage: ['es', 'en'],
      },
      ...serviceList,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
