/**
 * cacheTags — tags de cache compartidos entre el consumidor
 * (`unstable_cache` en `src/lib/data/*`) y el emisor (Payload `afterChange`
 * hook en `src/payload/collections/*`) de una misma pieza de contenido.
 *
 * Módulo sin dependencias de Payload/`payload-config` a propósito: los
 * hooks de colección viven dentro del árbol que construye
 * `payload.config.ts`, así que no pueden importar de `src/lib/data/entities.ts`
 * (que sí importa `payload-config` para `getPayload()`) sin crear un ciclo
 * `payload.config.ts → collections/entities → lib/data/entities →
 * payload-config`. Esta constante es el punto de encuentro sin ciclo.
 */
export const ENTITY_CACHE_TAG = 'collection_entities';
