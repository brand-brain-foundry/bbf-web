import type { CollectionAfterChangeHook } from 'payload';
import { purgeCloudflareCache } from '@/lib/cloudflare/purge-cache';
import { env } from '@/lib/env';

// H-BBF-523: revalidatePath/Tag NO se llaman inline aquí — ver
// src/app/api/revalidate/route.ts para el porqué (mismo patrón que
// revalidateGlobal.ts).
export const revalidatePage: CollectionAfterChangeHook = async ({ doc, req: { payload } }) => {
  if (doc._status === 'published') {
    const locales = ['es', 'en'] as const;
    const paths = locales.map((locale) => (doc.path ? `/${locale}/${doc.path}` : `/${locale}`));

    try {
      const res = await fetch(`http://127.0.0.1:${process.env.PORT ?? 3000}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': env.PAYLOAD_SECRET },
        body: JSON.stringify({ paths, tags: ['sitemap', 'llms-txt'] }),
      });
      if (!res.ok) {
        payload.logger.error(`[revalidate] /api/revalidate respondió ${res.status}`);
      }
    } catch (err) {
      payload.logger.error({ err }, '[revalidate] fetch a /api/revalidate falló');
    }

    payload.logger.info(`Revalidated page: ${doc.path}`);

    // B-BBF-WEB-FIX-CACHE-CDN-01: revalidatePath/Tag solo invalidan el cache
    // interno de Next — el edge de Cloudflare (s-maxage) necesita su propio purge.
    await purgeCloudflareCache();
  }
  return doc;
};
