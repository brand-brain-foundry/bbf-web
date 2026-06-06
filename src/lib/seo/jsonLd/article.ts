// Placeholder — Wave 16 will populate when BlogPosts collection exists.
import type { Article, WithContext } from 'schema-dts';

export function buildArticleJsonLd(
  post: Record<string, unknown>,
  locale: 'es' | 'en',
  domain: string,
): WithContext<Article> {
  const siteUrl = domain;
  const author = post.author as { name?: string } | undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title as string | undefined,
    description: post.excerpt as string | undefined,
    datePublished: post.publishedAt as string | undefined,
    dateModified: post.updatedAt as string | undefined,
    inLanguage: locale === 'es' ? 'es-MX' : 'en-US',
    author: author?.name ? { '@type': 'Person' as const, name: author.name } : undefined,
    publisher: {
      '@type': 'Organization' as const,
      '@id': `${siteUrl}#organization`,
    },
  };
}
