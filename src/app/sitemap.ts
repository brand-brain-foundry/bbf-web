import type { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@/payload-config';

const BASE_URL = 'https://brandbrainfoundry.com';

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * BBF sitemap.xml dinámico — Wave 10a
 *
 * Genera entradas para:
 *   1. Páginas estáticas core (existentes hoy)
 *   2. ContentItems cornerstone/page/post/case publicados
 *
 * Cada entrada con hreflang alternates ES + EN.
 * Filtra solo _status: published (no drafts).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [];

  // 1. Páginas estáticas core
  const staticPaths = ['/', '/contacto'];
  for (const path of staticPaths) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: path === '/' ? 1.0 : 0.8,
      alternates: {
        languages: {
          es: `${BASE_URL}${path}`,
          en: `${BASE_URL}/en${path === '/' ? '' : path}`,
        },
      },
    });
  }

  // 2. ContentItems published (cornerstones + pages + posts + cases)
  try {
    const payload = await getPayload({ config });

    // Fetch con locale 'all' para obtener slugs ES + EN en una sola query
    const result = await payload.find({
      collection: 'contentItems',
      locale: 'all',
      where: {
        and: [
          { _status: { equals: 'published' } },
          {
            kind: {
              in: ['cornerstone-page', 'pillar-page', 'page', 'post', 'case'],
            },
          },
        ],
      },
      limit: 500,
      depth: 0,
    });

    for (const item of result.docs) {
      // slug es localized: string con locale='all' retorna { es: '...', en: '...' }
      const slugRaw = item.slug as unknown as Record<string, string> | string;
      const slugObj =
        typeof slugRaw === 'object' && slugRaw !== null
          ? slugRaw
          : { es: slugRaw as string, en: slugRaw as string };

      const slugEs = slugObj['es'];
      const slugEn = slugObj['en'];

      if (!slugEs) continue;

      const lastMod = item.updatedAt ? new Date(item.updatedAt) : new Date();
      const esPath = buildPath(item.kind, slugEs);
      const enPath = slugEn ? buildPath(item.kind, slugEn) : esPath;

      entries.push({
        url: `${BASE_URL}${esPath}`,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: priorityFor(item.kind),
        alternates: {
          languages: {
            es: `${BASE_URL}${esPath}`,
            en: `${BASE_URL}/en${enPath}`,
          },
        },
      });
    }
  } catch (error) {
    console.error('Sitemap: error fetching contentItems', error);
  }

  return entries;
}

function buildPath(kind: string, slug: string): string {
  switch (kind) {
    case 'cornerstone-page':
    case 'pillar-page':
    case 'page':
      return `/${slug}`;
    case 'post':
      return `/blog/${slug}`;
    case 'case':
      return `/casos/${slug}`;
    case 'episode':
      return `/podcast/${slug}`;
    default:
      return `/${slug}`;
  }
}

function priorityFor(kind: string): number {
  switch (kind) {
    case 'cornerstone-page':
      return 0.9;
    case 'pillar-page':
      return 0.8;
    case 'page':
      return 0.7;
    case 'case':
      return 0.7;
    case 'post':
      return 0.6;
    default:
      return 0.5;
  }
}
