import { getPayload } from 'payload';
import { unstable_cache } from 'next/cache';
import config from '@/payload-config';
import type { ContentItem } from '@/payload/payload-types';
import { contentCacheTag } from '@/lib/cache/contentCacheTag';

async function getPayloadClient() {
  return getPayload({ config });
}

const CONTENT_ITEMS_CACHE_TAG = contentCacheTag('collection', 'contentItems');

export const fetchCornerstoneBySlug = unstable_cache(
  async (slug: string, locale: 'es' | 'en'): Promise<ContentItem | null> => {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: 'contentItems',
      where: {
        and: [
          { slug: { equals: slug } },
          { kind: { equals: 'cornerstone-page' } },
          { editorialState: { equals: 'D' } },
        ],
      },
      locale,
      limit: 1,
      overrideAccess: false,
    });

    return (result.docs[0] as ContentItem) ?? null;
  },
  ['contentItems-cornerstone-by-slug'],
  { tags: [CONTENT_ITEMS_CACHE_TAG], revalidate: 3600 },
);

export const fetchAllCornerstones = unstable_cache(
  async (locale: 'es' | 'en'): Promise<ContentItem[]> => {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: 'contentItems',
      where: {
        and: [{ kind: { equals: 'cornerstone-page' } }, { editorialState: { equals: 'D' } }],
      },
      locale,
      limit: 20,
      overrideAccess: false,
    });

    return result.docs as ContentItem[];
  },
  ['contentItems-all-cornerstones'],
  { tags: [CONTENT_ITEMS_CACHE_TAG], revalidate: 3600 },
);
