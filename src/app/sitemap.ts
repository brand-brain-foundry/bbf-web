import type { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { getSiteIdentity } from '@/config/site';

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
  const site = await getSiteIdentity('es');
  const BASE_URL = site.siteDomain;

  // G-14: use real updatedAt instead of runtime new Date()
  const siteLastMod = site.updatedAt ? new Date(site.updatedAt) : new Date();

  const entries: SitemapEntry[] = [];

  // 1. Páginas estáticas core
  // Homepage
  entries.push({
    url: `${BASE_URL}/`,
    lastModified: siteLastMod,
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: { languages: { es: `${BASE_URL}/`, en: `${BASE_URL}/en` } },
  });
  // Contacto — D-CT-03: slugs localizados (ES: /contacto, EN: /en/contact)
  // Prioridad 0.4: página terminal de conversión, no pelea tráfico educativo (SEO-AEO §1)
  entries.push({
    url: `${BASE_URL}/contacto`,
    lastModified: siteLastMod,
    changeFrequency: 'monthly',
    priority: 0.4,
    alternates: {
      languages: {
        es: `${BASE_URL}/contacto`,
        en: `${BASE_URL}/en/contact`,
      },
    },
  });

  // 2. Pages collection (Wave 12-A)
  try {
    const payload = await getPayload({ config });

    // G-14: override homepage "/" with more accurate site-homepage.updatedAt
    try {
      const hp = await payload.findGlobal({ slug: 'site-homepage', locale: 'es', depth: 0 });
      if (hp.updatedAt) {
        const homeEntry = entries.find((e) => e.url === `${BASE_URL}/`);
        if (homeEntry) homeEntry.lastModified = new Date(hp.updatedAt);
      }
    } catch {
      /* keep siteLastMod */
    }
    // @ts-justify: pages pending payload generate:types — Wave 12-A
    const pagesResult = await (payload.find as Function)({
      collection: 'pages',
      locale: 'all',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
    });
    for (const page of (pagesResult as { docs: Record<string, unknown>[] }).docs) {
      const pathRaw = page.path as unknown as Record<string, string> | string;
      const pathObj =
        typeof pathRaw === 'object' && pathRaw !== null
          ? pathRaw
          : { es: pathRaw as string, en: pathRaw as string };
      const pathEs = pathObj['es'];
      const pathEn = pathObj['en'] || pathEs;
      if (!pathEs) continue;
      entries.push({
        url: `${BASE_URL}/es/${pathEs}`,
        lastModified: typeof page.updatedAt === 'string' ? new Date(page.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            es: `${BASE_URL}/es/${pathEs}`,
            en: `${BASE_URL}/en/${pathEn}`,
          },
        },
      });
    }
  } catch {
    // pages table not yet migrated — skip gracefully
  }

  // 3. ContentItems published (cornerstones + pages + posts + cases)
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
