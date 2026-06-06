// Fetches page + SEO defaults, returns Next.js Metadata.
// seo-defaults global depends on T3 escalation resolution; degrades gracefully.
import type { Metadata } from 'next';
import { getPayload } from 'payload';
import config from '@/payload-config';

interface GenerateMetadataOptions {
  locale: 'es' | 'en';
  path: string;
}

export async function generatePageMetadata({
  locale,
  path,
}: GenerateMetadataOptions): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sivarbrains.com';

  try {
    const payload = await getPayload({ config });

    // @ts-justify: pages + seo-defaults pending payload generate:types + T3 resolution
    const pagesResult = await (payload.find as Function)({
      collection: 'pages',
      locale,
      where: {
        and: [{ path: { equals: path } }, { _status: { equals: 'published' } }],
      },
      limit: 1,
      depth: 1,
    });
    const seoDefaults = await (payload.findGlobal as Function)({
      slug: 'seo-defaults',
      locale,
      depth: 1,
    }).catch(() => null);

    const page = (pagesResult as { docs: unknown[] }).docs[0] as
      | Record<string, unknown>
      | undefined;
    const defaults = seoDefaults as Record<string, unknown> | null;

    const meta = page?.meta as Record<string, unknown> | undefined;
    const title =
      (meta?.title as string | undefined) ||
      (defaults?.defaultTitle as string | undefined) ||
      'Sivar Brains';
    const description =
      (meta?.description as string | undefined) ||
      (defaults?.defaultDescription as string | undefined);
    const ogImageRaw = (meta?.image ?? defaults?.defaultOgImage) as { url?: string } | undefined;
    const pageUrl = path ? `${siteUrl}/${locale}/${path}` : `${siteUrl}/${locale}`;

    return {
      title,
      description,
      alternates: {
        canonical: pageUrl,
        languages: {
          'es-MX': `${siteUrl}/es/${path}`,
          'en-US': `${siteUrl}/en/${path}`,
        },
      },
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: 'Sivar Brains',
        locale: locale === 'es' ? 'es_MX' : 'en_US',
        type: 'website',
        images: ogImageRaw?.url ? [{ url: `${siteUrl}${ogImageRaw.url}` }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
        },
      },
    };
  } catch {
    return { title: 'Sivar Brains' };
  }
}
