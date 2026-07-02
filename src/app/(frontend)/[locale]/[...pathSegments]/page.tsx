import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@/payload-config';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { generatePageMetadata } from '@/lib/seo/generateMetadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildWebPageJsonLd } from '@/lib/seo/jsonLd/webPage';
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonLd/breadcrumbList';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { routing } from '@/i18n/routing';
import { getSiteIdentity } from '@/config/site';

type Locale = 'es' | 'en';

interface PageParams {
  params: Promise<{ locale: string; pathSegments?: string[] }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale, pathSegments = [] } = await params;
  const path = pathSegments.join('/');
  const { siteDomain } = await getSiteIdentity(locale as Locale);
  return generatePageMetadata({ locale: locale as Locale, path, domain: siteDomain });
}

export default async function DynamicPage({ params }: PageParams) {
  const { locale, pathSegments = [] } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  const path = pathSegments.join('/');
  const [payload, { siteDomain }] = await Promise.all([
    getPayload({ config }),
    getSiteIdentity(locale as Locale),
  ]);

  // @ts-justify: pages pending payload generate:types — Wave 12-A
  const pagesResult = await (payload.find as Function)({
    collection: 'pages',
    locale: locale as Locale,
    where: {
      and: [{ path: { equals: path } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
  });

  const docs = (pagesResult as { docs: Record<string, unknown>[] }).docs;
  if (!docs.length) {
    notFound();
  }

  const page = docs[0];
  const webPageJsonLd = buildWebPageJsonLd({ page, locale: locale as Locale, domain: siteDomain });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    page,
    locale: locale as Locale,
    domain: siteDomain,
  });

  const layout = (page.layout ?? []) as Array<{
    id?: string;
    blockType: string;
    [key: string]: unknown;
  }>;

  return (
    <>
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd]} />
      <main>
        <h1>{page.title as string}</h1>
        {layout.map((block, index) => (
          <BlockRenderer key={block.id ?? index} block={block} />
        ))}
      </main>
    </>
  );
}

export const revalidate = 60;
