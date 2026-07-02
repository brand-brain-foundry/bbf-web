import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchCornerstoneBySlug } from '@/lib/payload/fetchContent';
import { CornerstoneTemplate } from '@/components/templates/CornerstoneTemplate';
import { buildHreflangBySlugMap } from '@/lib/seo/hreflang';
import { buildWebPageSchema } from '@/lib/seo/jsonld';
import { getSiteIdentity } from '@/config/site';

export const revalidate = 60;

type Props = { params: Promise<{ locale: 'es' | 'en' }> };

const SLUG_BY_LOCALE = { es: 'cerebro-marca', en: 'brand-brain' } as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const slug = SLUG_BY_LOCALE[locale];
  const item = await fetchCornerstoneBySlug(slug, locale);
  if (!item) return {};

  const { siteDomain } = await getSiteIdentity(locale);
  const alternates = buildHreflangBySlugMap(locale, SLUG_BY_LOCALE, siteDomain);

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
  const [item, { siteDomain }] = await Promise.all([
    fetchCornerstoneBySlug(slug, locale),
    getSiteIdentity(locale),
  ]);

  if (!item) notFound();
  if (!item.blocks || item.blocks.length === 0) notFound();

  const pageUrl =
    locale === 'en'
      ? `${siteDomain}/en/${SLUG_BY_LOCALE.en}`
      : `${siteDomain}/${SLUG_BY_LOCALE.es}`;

  const webPageSchema = buildWebPageSchema({
    domain: siteDomain,
    locale,
    title: item.title,
    description: item.excerpt ?? '',
    url: pageUrl,
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
