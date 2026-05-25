// Depends on T3 globals resolution: seo-defaults + site-settings slugs.
// Uses try/catch to degrade gracefully until globals are registered.
import type { Organization, WithContext } from 'schema-dts';
import { getPayload } from 'payload';
import config from '@/payload-config';

export async function buildOrganizationJsonLd(
  locale: 'es' | 'en' = 'es',
): Promise<WithContext<Organization>> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brandbrainfoundry.com';

  let siteName = 'Brand Brain Foundry';
  let siteDescription: string | undefined;
  let contactEmail: string | undefined;
  let logoUrl: string | undefined;
  let founders: Array<{ name: string; role?: string; sameAs?: string }> = [];
  let sameAs: string[] = [];

  try {
    const payload = await getPayload({ config });

    // T3 escalated: seo-defaults + site-settings globals pending T3 resolution
    // @ts-justify: slugs will exist after T3 + payload generate:types
    const [seoDefaults, siteSettings] = await Promise.all([
      (payload.findGlobal as Function)({ slug: 'seo-defaults', locale, depth: 1 }).catch(
        () => null,
      ),
      (payload.findGlobal as Function)({ slug: 'site-settings', locale, depth: 1 }).catch(
        () => null,
      ),
    ]);

    if (siteSettings) {
      const s = siteSettings as unknown as Record<string, unknown>;
      if (typeof s.siteName === 'string') siteName = s.siteName;
      if (typeof s.siteDescription === 'string') siteDescription = s.siteDescription;
      if (typeof s.contactEmail === 'string') contactEmail = s.contactEmail;
      const logo = s.logo as { url?: string } | undefined;
      if (logo?.url) logoUrl = `${siteUrl}${logo.url}`;
    }

    if (seoDefaults) {
      const s = seoDefaults as unknown as Record<string, unknown>;
      const org = s.organization as Record<string, unknown> | undefined;
      if (org) {
        const foundersRaw = org.founders as
          | Array<{ name: string; role?: string; sameAs?: string }>
          | undefined;
        if (foundersRaw) founders = foundersRaw;
        const sameAsRaw = org.sameAs as Array<{ url: string }> | undefined;
        if (sameAsRaw) sameAs = sameAsRaw.map((s) => s.url).filter(Boolean);
      }
    }
  } catch {
    // degraded fallback — globals not yet registered (pre-T3)
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    logo: logoUrl,
    founders: founders.length
      ? founders.map((f) => ({
          '@type': 'Person' as const,
          name: f.name,
          jobTitle: f.role,
          sameAs: f.sameAs ? [f.sameAs] : undefined,
        }))
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    email: contactEmail,
  };
}
