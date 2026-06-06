import { getSiteIdentity } from '@/config/site';
import { interpolate } from '@/lib/content-interpolation';

/**
 * StructuredData — Schema.org JSON-LD @graph para entity disambiguation.
 *
 * Emite: Organization SB + Organization BBF (producer) + Person Zavala + WebSite.
 * Consumido desde layout.tsx en todas las páginas.
 * AEO/LLMO 2026: sameAs cross-domain + knowsAbout + producer chain.
 */
export async function StructuredData({ locale }: { locale: string }) {
  const l = locale === 'en' ? 'en' : 'es';
  const site = await getSiteIdentity(l);

  const domain = site.siteDomain;
  const producerUrl = site.producer?.url ?? 'https://brandbrainfoundry.com';
  const producerName = site.producer?.name ?? 'Brand Brain Foundry';
  const founderName = site.founder?.name ?? 'Christian Zavala';
  const founderUrl = site.founder?.url ?? producerUrl;
  const knowsAbout = (site.schemaKnowsAbout ?? []).map((t) => t.topic).filter(Boolean);
  const sameAs = (site.schemaSameAs ?? []).map((s) => s.url).filter(Boolean);
  const siteDescription = await interpolate(site.siteDescription, l);

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
        foundingDate: '2025',
        founder: {
          '@type': 'Person',
          '@id': `${producerUrl}/#person-zavala`,
          name: founderName,
          url: founderUrl,
        },
        producer: {
          '@type': 'Organization',
          '@id': `${producerUrl}/#org`,
          name: producerName,
          url: producerUrl,
        },
        knowsAbout,
        sameAs,
        inLanguage: l,
        areaServed: { '@type': 'Country', name: 'El Salvador' },
      },
      {
        '@type': 'Organization',
        '@id': `${producerUrl}/#org`,
        name: producerName,
        url: producerUrl,
        description:
          'Foundry que construye y mantiene cerebros de marca. Sistemas de inteligencia de marca para empresas.',
        founder: { '@id': `${producerUrl}/#person-zavala` },
      },
      {
        '@type': 'Person',
        '@id': `${producerUrl}/#person-zavala`,
        name: founderName,
        url: founderUrl,
        worksFor: [{ '@id': `${domain}/#org` }, { '@id': `${producerUrl}/#org` }],
        jobTitle: 'Founder',
      },
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
