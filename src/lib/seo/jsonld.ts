const BASE_URL = 'https://brandbrainfoundry.com';

type Locale = 'es' | 'en';

type BuildWebPageArgs = {
  locale: Locale;
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string;
};

/**
 * Build WebPage JSON-LD schema.
 *
 * Cada página debe emitir este schema para SEO clásico (GSC),
 * GEO (Bing AI, Perplexity) y AEO (citation context para LLMs).
 */
export function buildWebPageSchema(args: BuildWebPageArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${args.url}#webpage`,
    url: args.url,
    name: args.title,
    description: args.description,
    inLanguage: args.locale,
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
    ...(args.datePublished && { datePublished: args.datePublished }),
    ...(args.dateModified && { dateModified: args.dateModified }),
    ...(args.imageUrl && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: args.imageUrl,
      },
    }),
  };
}

/**
 * Build BreadcrumbList JSON-LD schema.
 */
export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
