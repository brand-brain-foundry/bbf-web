import type { BreadcrumbList, WithContext } from 'schema-dts';

interface BuildBreadcrumbOptions {
  page: Record<string, unknown>;
  locale: 'es' | 'en';
  domain: string;
}

export function buildBreadcrumbJsonLd({
  page,
  locale,
  domain,
}: BuildBreadcrumbOptions): WithContext<BreadcrumbList> {
  const siteUrl = domain;
  const pathStr = typeof page.path === 'string' ? page.path : '';
  const segments = pathStr ? pathStr.split('/') : [];

  const items = [
    {
      '@type': 'ListItem' as const,
      position: 1,
      name: locale === 'es' ? 'Inicio' : 'Home',
      item: `${siteUrl}/${locale}`,
    },
    ...segments.map((segment, index) => ({
      '@type': 'ListItem' as const,
      position: index + 2,
      name: segment.replace(/-/g, ' '),
      item: `${siteUrl}/${locale}/${segments.slice(0, index + 1).join('/')}`,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}
