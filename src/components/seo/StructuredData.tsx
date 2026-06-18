import { getSiteIdentity } from '@/config/site';
import { getEntityBySlug } from '@/lib/data/entities';
import { interpolate } from '@/lib/content-interpolation';

/**
 * StructuredData — Schema.org JSON-LD @graph para entity disambiguation.
 *
 * @graph: Organization SB + Person[] founders + Organization[] affiliated + WebSite
 *
 * FASE 3.6 — L-BBF-240 (Regla No-Invención + @id canonical):
 * - Person.@id SIEMPRE bajo siteDomain (sivarbrains.com/#{slug}-person)
 * - Organization.@id SIEMPRE bajo siteDomain (sivarbrains.com/#{slug}-org)
 * - Organization nodes derivados de founders.affiliation (no hardcoded)
 * - Person.url vacío cuando founders comparten URL (es URL de Org, no entity individual)
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
  const orgEntity = await getEntityBySlug('sivar-brains', l);
  const rawKnowsAbout = (orgEntity?.organization?.knowsAbout ?? []) as Array<
    { name?: string | null } | number
  >;
  const knowsAbout = rawKnowsAbout
    .map((t) => (typeof t === 'object' && t !== null ? t.name : null))
    .filter(Boolean);
  const sameAs = (orgEntity?.sameAs ?? []).map((s) => s.url).filter(Boolean);
  const siteDescription = await interpolate(site.siteDescription, l);

  // ── Person nodes — @id always under siteDomain (L-BBF-240) ─────────────
  const personNodes = founders.map((f) => {
    const slug = slugify(f.name ?? '');
    const personUrl = getPersonUrl(f, founders);
    const affiliationName = cleanField(f.affiliation);
    return {
      '@type': 'Person',
      '@id': `${domain}/#${slug}-person`,
      name: f.name,
      ...(f.role ? { jobTitle: f.role } : {}),
      ...(personUrl ? { url: personUrl } : {}),
      ...(f.linkedin ? { sameAs: [f.linkedin] } : {}),
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
        description: siteDescription,
        foundingDate: '2025-10',
        founder: founderRefs.length > 0 ? founderRefs : undefined,
        knowsAbout,
        sameAs,
        knowsLanguage: ['es', 'en'],
        areaServed: [
          { '@type': 'Country', name: 'El Salvador' },
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
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
