import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  // M4 no pre-genera dynamic paths. M6 lo activará desde Payload.
  return [];
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; pathSegments: string[] }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // M4-B: catch-all retorna 404. M6 lo activará con resolución Payload.
  notFound();
}
