import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchCornerstoneBySlug } from '@/lib/payload/fetchContent';
import { CornerstoneTemplate } from '@/components/templates/CornerstoneTemplate';
import { buildHreflangBySlugMap } from '@/lib/seo/hreflang';
import { buildWebPageSchema } from '@/lib/seo/jsonld';

export const revalidate = 3600;

type Props = { params: Promise<{ locale: 'es' | 'en' }> };

const SLUG_BY_LOCALE = { es: 'cerebro-marca', en: 'brand-brain' } as const;

const PAGE_URL: Record<'es' | 'en', string> = {
  es: 'https://sivarbrains.com/cerebro-marca',
  en: 'https://sivarbrains.com/en/brand-brain',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const slug = SLUG_BY_LOCALE[locale];
  const item = await fetchCornerstoneBySlug(slug, locale);
  if (!item) return {};

  const alternates = buildHreflangBySlugMap(locale, SLUG_BY_LOCALE);

  return {
    title: item.title,
    description: item.excerpt,
    alternates,
  };
}

export default async function CerebroMarcaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const slug = SLUG_BY_LOCALE[locale];
  const item = await fetchCornerstoneBySlug(slug, locale);

  if (!item) notFound();

  const webPageSchema = buildWebPageSchema({
    locale,
    title: item.title,
    description: item.excerpt ?? '',
    url: PAGE_URL[locale],
    datePublished: item.createdAt,
    dateModified: item.updatedAt,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <CornerstoneTemplate contentItem={item} locale={locale} />
    </>
  );
}
