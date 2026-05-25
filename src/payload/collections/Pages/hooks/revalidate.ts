import { revalidatePath, revalidateTag } from 'next/cache';
import type { CollectionAfterChangeHook } from 'payload';

export const revalidatePage: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  if (doc._status === 'published') {
    const locales = ['es', 'en'] as const;
    locales.forEach((locale) => {
      const path = doc.path ? `/${locale}/${doc.path}` : `/${locale}`;
      revalidatePath(path);
    });
    revalidateTag('sitemap');
    revalidateTag('llms-txt');
    payload.logger.info(`Revalidated page: ${doc.path}`);
  }
  return doc;
};
