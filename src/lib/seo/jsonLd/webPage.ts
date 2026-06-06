import type { WebPage, WithContext } from 'schema-dts';

interface BuildWebPageOptions {
  page: Record<string, unknown>;
  locale: 'es' | 'en';
  domain: string;
}

export function buildWebPageJsonLd({
  page,
  locale,
  domain,
}: BuildWebPageOptions): WithContext<WebPage> {
  const siteUrl = domain;
  const path = typeof page.path === 'string' ? page.path : '';
  const pageUrl = path ? `${siteUrl}/${locale}/${path}` : `${siteUrl}/${locale}`;

  const meta = page.meta as Record<string, unknown> | undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: (meta?.title as string) || (page.title as string),
    description: meta?.description as string | undefined,
    inLanguage: locale === 'es' ? 'es-MX' : 'en-US',
    datePublished: page.publishedAt as string | undefined,
    dateModified: page.updatedAt as string | undefined,
    isPartOf: {
      '@type': 'WebSite' as const,
      '@id': `${siteUrl}#website`,
      url: siteUrl,
    },
  };
}
