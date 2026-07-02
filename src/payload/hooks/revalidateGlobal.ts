import type { GlobalAfterChangeHook } from 'payload';
import { revalidatePath, revalidateTag } from 'next/cache';
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
 * Path con locale explícito (issue payloadcms/payload#13884): '/' solo no
 * basta con next-intl — se revalida cada locale (/es, /es/en) por separado.
 *
 * Trazable a D-BBF-KB-98, §13.3 audit (propagación automática), SB_Law I-5.
 *
 * Uso en cualquier Payload Global:
 * ```ts
 * hooks: { afterChange: [revalidateGlobal] }
 * ```
 */
const LOCALES = ['es', 'en'] as const;

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
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}`);
    }
  } catch {
    // No-op fuera de Next.js request context (seed scripts, CLI).
    // El cambio se commitió en DB — solo omitimos la invalidación de cache ISR.
  }

  // Capa ADICIONAL independiente (edge de Cloudflare, s-maxage) — no depende
  // de si la invalidación de arriba tuvo éxito, y no debe tumbar el hook si
  // faltan credenciales (guard interno en purgeCloudflareCache).
  await purgeCloudflareCache();

  return doc;
};
