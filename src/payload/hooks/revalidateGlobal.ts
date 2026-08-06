import type { GlobalAfterChangeHook } from 'payload';
import { invalidateContent } from '@/lib/cache/invalidate';
import { globalCacheScope } from './cacheScopeMap';
import { purgeCloudflareCache } from '@/lib/cloudflare/purge-cache';

/**
 * Hook canon BBF para revalidación de Payload Globals.
 *
 * Patrón oficial Payload embebido (templates/website/.../revalidatePage.ts,
 * github.com/payloadcms/payload) — revalidatePath/Tag INLINE, sin HTTP,
 * sin route handler dedicado. H-BBF-524 revirtió el fetch() HTTP de H-523
 * (innecesario para Payload embebido en el mismo proceso Next — ese patrón
 * es para CMS desacoplado). Confirmado con test controlado: inline SÍ
 * invalida el Full Route Cache cuando corre dentro del Route Handler real
 * que procesa el save (REST_POST de @payloadcms/next), que es exactamente
 * el contexto en que corre este hook.
 *
 * El alcance real (qué paths/tipo invalidar) NO vive aquí — lo decide
 * `cacheScopeMap` (fuente única «Global → alcance», R-CACHE F2). Este hook
 * solo consulta el mapa e invoca el núcleo `invalidateContent`.
 *
 * Trazable a D-BBF-KB-98, §13.3 audit (propagación automática), SB_Law I-5,
 * D-SBWEB-CACHE (R-CACHE).
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

  const paths = globalCacheScope[global.slug];
  if (!paths) {
    req.payload.logger.warn(
      `[revalidate] Global ${global.slug} sin entrada en cacheScopeMap — cache no invalidado`,
    );
    return doc;
  }

  invalidateContent({ paths, tags: [`global_${global.slug}`] }, req.payload.logger);

  // Capa ADICIONAL independiente (edge de Cloudflare, s-maxage) — no depende
  // de si la invalidación de arriba tuvo éxito, y no debe tumbar el hook si
  // faltan credenciales (guard interno en purgeCloudflareCache).
  await purgeCloudflareCache();

  return doc;
};
