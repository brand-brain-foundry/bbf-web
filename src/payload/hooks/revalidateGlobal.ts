import type { GlobalAfterChangeHook } from 'payload';
import { purgeCloudflareCache } from '@/lib/cloudflare/purge-cache';
import { env } from '@/lib/env';

/**
 * Hook canon BBF para revalidación de Payload Globals.
 *
 * Patrón Payload website-cms oficial:
 * - Tag granular `global_${slug}` para fetches con unstable_cache
 * - Path layout invalidation para SSG/ISR pages que consumen el global
 *
 * Trazable a D-BBF-KB-98, §13.3 audit (propagación automática), SB_Law I-5.
 *
 * H-BBF-523: revalidatePath/Tag NO se llaman inline aquí — solo surten efecto
 * en el contexto de ejecución de un Route Handler real. Se dispara vía fetch()
 * HTTP a /api/revalidate (ver ese archivo para el porqué).
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
    const res = await fetch(`http://127.0.0.1:${process.env.PORT ?? 3000}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': env.PAYLOAD_SECRET },
      body: JSON.stringify({ paths: ['/'], type: 'layout', tags: [`global_${global.slug}`] }),
    });
    if (!res.ok) {
      req.payload.logger.error(`[revalidate] /api/revalidate respondió ${res.status}`);
    }
  } catch (err) {
    // No-op fuera de Next.js request context (seed scripts, CLI) o si el
    // fetch interno falla. El cambio se commitió en DB — solo omitimos la
    // invalidación de cache ISR.
    req.payload.logger.error({ err }, '[revalidate] fetch a /api/revalidate falló');
  }

  // B-BBF-WEB-FIX-CACHE-CDN-01: revalidatePath/Tag solo invalidan el cache
  // interno de Next — el edge de Cloudflare (s-maxage) necesita su propio purge.
  await purgeCloudflareCache();

  return doc;
};
