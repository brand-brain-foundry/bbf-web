import { getPayload } from 'payload';
import config from '@/payload-config';
import { unstable_cache } from 'next/cache';

export const SITE_IDENTITY_CACHE_TAG = 'global_site-identity';

/**
 * getSiteIdentity — Entity Identity canónica de la marca.
 *
 * Single source of truth para: metadata HTML, Schema.org JSON-LD,
 * llms.txt, sitemap, wordmark visible, content interpolation {{siteName}}.
 *
 * Cached 1h, invalidado por revalidateGlobal hook al editar en admin.
 * Solo para Server Components. Si un Client Component necesita siteName,
 * recibirlo como prop desde el Server Component padre.
 */
export const getSiteIdentity = unstable_cache(
  async (locale: 'es' | 'en' = 'es') => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: 'site-identity', locale });
  },
  ['site-identity'],
  { tags: [SITE_IDENTITY_CACHE_TAG], revalidate: 3600 },
);

/** @deprecated Use getSiteIdentity */
export const getSiteConfig = getSiteIdentity;
/** @deprecated Use SITE_IDENTITY_CACHE_TAG */
export const SITE_CONFIG_CACHE_TAG = SITE_IDENTITY_CACHE_TAG;
