import type { GlobalAfterChangeHook } from 'payload';
import { revalidatePath, revalidateTag } from 'next/cache';
import { purgeCloudflareCache } from '@/lib/cloudflare/purge-cache';

/**
 * Hook canon BBF para revalidación de Payload Globals.
 *
 * Patrón Payload website-cms oficial:
 * - Tag granular `global_${slug}` para fetches con unstable_cache
 * - Path layout invalidation para SSG/ISR pages que consumen el global
 *
 * Trazable a D-BBF-KB-98, §13.3 audit (propagación automática), SB_Law I-5.
 *
 * Uso en cualquier Payload Global:
 * ```ts
 * hooks: { afterChange: [revalidateGlobal] }
 * ```
 */
export const revalidateGlobal: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
  global,
  req,
}) => {
  if (doc?.updatedAt === previousDoc?.updatedAt) {
    return doc;
  }

  req.payload.logger.info(`[revalidate] Global ${global.slug} updated — invalidating cache`);

  try {
    revalidateTag(`global_${global.slug}`);
    revalidatePath('/', 'layout');
  } catch {
    // No-op fuera de Next.js request context (seed scripts, CLI).
    // El cambio se commitió en DB — solo omitimos la invalidación de cache ISR.
  }

  // B-BBF-WEB-FIX-CACHE-CDN-01: revalidatePath/Tag solo invalidan el cache
  // interno de Next — el edge de Cloudflare (s-maxage) necesita su propio purge.
  await purgeCloudflareCache();

  return doc;
};
