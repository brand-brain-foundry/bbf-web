import { getPayload } from 'payload';
import config from '@/payload-config';
import type { ContentItem } from '@/payload/payload-types';

async function getPayloadClient() {
  return getPayload({ config });
}

export async function fetchCornerstoneBySlug(
  slug: string,
  locale: 'es' | 'en',
): Promise<ContentItem | null> {
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
}

export async function fetchAllCornerstones(locale: 'es' | 'en'): Promise<ContentItem[]> {
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
}
