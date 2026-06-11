import { getPayload } from 'payload';
import { unstable_cache } from 'next/cache';

import config from '@/payload-config';

export const ENTITY_CACHE_TAG = 'collection_entities';

/**
 * getEntityBySlug — Lee una Entity por slug desde Payload Local API.
 *
 * FASE 4.B.1.B (D-ALIGN-41): punto de entrada para que StructuredData
 * lea sameAs desde Entity 'sivar-brains' en lugar de SiteIdentity.schemaSameAs.
 *
 * FASE 6: los helpers getOrganizationBySlug / buildOrganizationFromEntity
 * completarán la migración total de StructuredData.tsx desde SiteIdentity proxy.
 */
export const getEntityBySlug = unstable_cache(
  async (slug: string, locale: 'es' | 'en' = 'es') => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'entities',
      where: { slug: { equals: slug } },
      locale,
      depth: 1,
    });
    return result.docs[0] ?? null;
  },
  ['entity'],
  { tags: [ENTITY_CACHE_TAG], revalidate: 3600 },
);
