import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchCornerstoneBySlug } from '@/lib/payload/fetchContent';
import { CornerstoneTemplate } from '@/components/templates/CornerstoneTemplate';

export const revalidate = 3600;

type Props = { params: Promise<{ locale: 'es' | 'en' }> };

const SLUG_BY_LOCALE = { es: 'cerebro-marca', en: 'brand-brain' } as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const slug = SLUG_BY_LOCALE[locale];
  const item = await fetchCornerstoneBySlug(slug, locale);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
  };
}

export default async function CerebroMarcaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const slug = SLUG_BY_LOCALE[locale];
  const item = await fetchCornerstoneBySlug(slug, locale);

  if (!item) notFound();

  return <CornerstoneTemplate contentItem={item} locale={locale} />;
}
