import { revalidatePath, revalidateTag } from 'next/cache';
import type { CollectionAfterChangeHook } from 'payload';
import { purgeCloudflareCache } from '@/lib/cloudflare/purge-cache';

// H-BBF-524: revalidatePath/Tag INLINE — patrón oficial Payload embebido
// (ver revalidateGlobal.ts). Path con locale explícito ya estaba correcto
// aquí desde el original (issue payloadcms/payload#13884).
export const revalidatePage: CollectionAfterChangeHook = async ({ doc, req: { payload } }) => {
  if (doc._status === 'published') {
    const locales = ['es', 'en'] as const;
    locales.forEach((locale) => {
      const path = doc.path ? `/${locale}/${doc.path}` : `/${locale}`;
      revalidatePath(path);
    });
    revalidateTag('sitemap');
    revalidateTag('llms-txt');
    payload.logger.info(`Revalidated page: ${doc.path}`);

    // B-BBF-WEB-FIX-CACHE-CDN-01: revalidatePath/Tag solo invalidan el cache
    // interno de Next — el edge de Cloudflare (s-maxage) necesita su propio purge.
    await purgeCloudflareCache();
  }
  return doc;
};
