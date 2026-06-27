import type { FAQPage, WithContext } from 'schema-dts';

export function buildFaqPageJsonLd(
  faqs: Array<{ question: string; answer: string }>,
  id?: string,
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(id ? { '@id': id } : {}),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  };
}
