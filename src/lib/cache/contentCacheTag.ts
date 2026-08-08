/**
 * contentCacheTag — fuente única del nombre de un cache tag (F3.3 del
 * contrato de propagación, `OUTPUT-SBWEB-2026-08-07-DIAGNOSTICO-CONTRATO-PROPAGACION`).
 *
 * Hoy el nombre del tag se compone por separado en el lado LECTURA
 * (`unstable_cache({ tags: [...] })`) y en el lado ESCRITURA (hook
 * `afterChange`), coincidiendo solo por verificación manual — ver
 * `config/site.ts` / `revalidateGlobal.ts`. Si un lado cambia sin el otro,
 * el tag queda huérfano y nada lo detecta (ni TS, ni Payload, ni el build).
 *
 * Esta función es el único lugar del repo que sabe cómo se nombra un tag.
 * Ambos lados deben importarla — así es imposible desalinearse.
 *
 * Módulo sin dependencias de Payload/`payload-config` a propósito, mismo
 * patrón que `lib/data/cacheTags.ts`: los hooks de colección viven dentro
 * del árbol que construye `payload.config.ts`, así que no pueden importar
 * nada que a su vez importe `payload-config` sin crear un ciclo.
 */
export function contentCacheTag(kind: 'global' | 'collection', slug: string): string {
  return `${kind}_${slug}`;
}
