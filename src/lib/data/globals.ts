import { getPayload, type GlobalSlug } from 'payload';
import { unstable_cache } from 'next/cache';

import config from '@/payload-config';
import { contentCacheTag } from '@/lib/cache/contentCacheTag';

type Locale = 'es' | 'en';

/**
 * getGlobalContent — helper único para leer un Payload Global cacheado.
 *
 * Generaliza el patrón de referencia `getSiteIdentity` (config/site.ts) y
 * `getEntityBySlug` (lib/data/entities.ts): `unstable_cache` + tag de
 * `contentCacheTag('global', slug)`, revalidate 3600. Ese tag coincide por
 * construcción con el que `revalidateGlobal.ts` emite (`global_<slug>`) —
 * migrar un global a este helper es lo que hace que su tag gane consumidor
 * (HAL-SBWEB-CACHE-COVERAGE-GAPS-01).
 *
 * `depth` es opcional y se preserva tal cual: si el caller no lo pasa, la
 * lectura no fija `depth` (mismo comportamiento que `findGlobal` sin la
 * key, que usa el default de Payload) — el helper envuelve, no cambia el
 * resultado de ninguna lectura existente.
 */
export function getGlobalContent<TSlug extends GlobalSlug>(
  slug: TSlug,
  locale: Locale = 'es',
  opts: { depth?: number } = {},
) {
  const { depth } = opts;
  const readGlobal = unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      return depth === undefined
        ? payload.findGlobal({ slug, locale })
        : payload.findGlobal({ slug, locale, depth });
    },
    [slug, locale, String(depth ?? 'default')],
    { tags: [contentCacheTag('global', slug)], revalidate: 3600 },
  );
  return readGlobal();
}
