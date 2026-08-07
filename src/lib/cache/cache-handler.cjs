/**
 * cacheHandler — adaptador Data Cache de Next.js respaldado por Upstash Redis (P-CACHE).
 *
 * Reemplaza el handler propio (3 bugs en secuencia: DNS, serialización `a.pipeTo`,
 * invalidación) por `@fortedigital/nextjs-cache-handler` — mantenido contra los cambios
 * internos de serialización de Next entre versiones. Cierra HAL-SBWEB-ISR-STALE-NO-ONDEMAND-01
 * completo (ambas mitades): el crash de prefetch RSC (`a.pipeTo`) y la invalidación por tag/path.
 *
 * Versión pineada: 2.5.3 — NO 3.x. La línea 3.x del paquete (`peerDependencies.next >=16.1.5`,
 * keyword "next16") requiere Next 16; producción corre Next 15.5.18. La línea compatible es
 * 2.x (`peerDependencies.next >=15.2.4`, keyword "next15"), verificado contra el registro npm
 * — el diagnóstico madre citó mal la versión (asumió que 3.2.0 cubría Next 15).
 *
 * CommonJS (.cjs) por la misma razón que el handler anterior: package.json tiene
 * "type":"module", next.config.mjs resuelve este archivo con `require.resolve()` fuera del
 * pipeline de transpilación de la app.
 *
 * Transporte: `redis` (node-redis, TCP/RESP vía `createClient`), NO `@upstash/redis` (SDK REST
 * sobre `fetch`). Next parchea el `fetch()` global durante el render estático para rastrear
 * "dynamic server usage" — cualquier SDK que llame fetch() dentro de get()/set() dispara
 * `DynamicServerError`. `redis` usa sockets TCP crudos, invisible a ese parcheo. Conexión nueva
 * y distinta a `src/lib/redis/client.ts` (SDK REST, usado por rate-limit) — mismo Redis físico
 * (Upstash), credencial TCP separada (`rediss://`), NUNCA se toca ese cliente REST.
 *
 * Serialización Buffer (resuelve `a.pipeTo`): el sub-handler `redis-strings` del fork convierte
 * `rscData`/`segmentData` (APP_PAGE) y `body` (APP_ROUTE) a base64 antes de `JSON.stringify` y
 * los revierte a Buffer al leer — verificado en su código fuente (`parseBuffersToStrings` /
 * `convertStringsToBuffers`). El handler propio no hacía esta conversión: `JSON.stringify` sobre
 * un Buffer produce `{type:'Buffer',data:[...]}`, que `JSON.parse` no revive — de ahí el crash
 * en el prefetch RSC del CTA `/contacto`.
 *
 * Tags implícitos de path (absorbe el fix de PR#14): la clase `CacheHandler` del fork lee
 * `x-next-cache-tags` de las cabeceras del valor cacheado en su propio `set()` (mismo mecanismo
 * que PR#14 añadió a mano) y propaga `ctx.softTags` como `implicitTags` a `get()` — el
 * sub-handler compara esos tags contra un registro de revalidación (`_N_T_<path>`) para
 * invalidar. PR#14 (`fix/r-cache-invalidacion`) se cierra sin merge: su lógica queda absorbida
 * nativamente por este handler.
 *
 * No usa `instrumentation.ts`/`registerInitialCache` — es opcional (solo pre-calienta el cache
 * con artefactos de build), no lo requiere el ciclo get/set/revalidateTag. `instrumentation.ts`
 * ya se eliminó una vez de este repo por no correr en `output:standalone`; no se reintroduce
 * para una función que no hace falta.
 *
 * Gate defensivo: si UPSTASH_REDIS_TCP_URL falta, o si la conexión Redis falla, resuelve a
 * `{ handlers: [] }` — el propio fork trata una lista de handlers vacía como no-op seguro
 * (`handlers.filter(Boolean)`, bucles sobre 0 elementos): get() nunca encuentra nada,
 * set()/revalidateTag() no hacen nada. Nunca lanza. Mismo principio que el gate de
 * STORAGE_PROVIDER (R2 ausente no tumba el build) y que el handler anterior (Redis caído no
 * tumba el sitio).
 *
 * `keyPrefix` en v2 (vs. `nextcache:v1:` del handler anterior) — formato de entrada distinto
 * (el fork no es compatible con las keys que escribía el handler propio), separa el namespace
 * a propósito. Las keys v1 quedan huérfanas en Redis (nunca se leen, no bloquean) hasta que
 * expiren o se purguen manualmente — cache frío esperado en el primer deploy, no un bug.
 */
const { CacheHandler } = require('@fortedigital/nextjs-cache-handler');
const createRedisHandler = require('@fortedigital/nextjs-cache-handler/redis-strings').default;
const { createClient } = require('redis');
const { PHASE_PRODUCTION_BUILD } = require('next/constants.js');

CacheHandler.onCreation(() => {
  if (global.cacheHandlerConfig) {
    return global.cacheHandlerConfig;
  }
  if (global.cacheHandlerConfigPromise) {
    return global.cacheHandlerConfigPromise;
  }

  global.cacheHandlerConfigPromise = (async () => {
    const tcpUrl = process.env.UPSTASH_REDIS_TCP_URL;
    let redisClient = null;

    // No conectar durante `next build` — la fase de build no necesita Data Cache persistente
    // y evita depender de red/credencial en el paso de build (mismo patrón que el ejemplo
    // oficial del fork).
    if (tcpUrl && PHASE_PRODUCTION_BUILD !== process.env.NEXT_PHASE) {
      try {
        redisClient = createClient({ url: tcpUrl, pingInterval: 10000 });
        redisClient.on('error', (error) => {
          console.warn('[cache-handler] Redis error, degradando:', error);
          global.cacheHandlerConfig = null;
          global.cacheHandlerConfigPromise = null;
        });
      } catch (error) {
        console.warn('[cache-handler] Falló crear el cliente Redis:', error);
        redisClient = null;
      }
    } else if (!tcpUrl) {
      console.warn(
        '[cache-handler] UPSTASH_REDIS_TCP_URL ausente — degradando a cache-miss permanente (sin Data Cache persistente).',
      );
    }

    if (redisClient) {
      try {
        await redisClient.connect();
      } catch (error) {
        console.warn('[cache-handler] Falló conectar a Redis, degradando:', error);
        await redisClient.disconnect().catch(() => {});
        redisClient = null;
      }
    }

    global.cacheHandlerConfigPromise = null;

    if (!redisClient?.isReady) {
      global.cacheHandlerConfig = { handlers: [] };
      return global.cacheHandlerConfig;
    }

    const redisHandler = createRedisHandler({
      client: redisClient,
      keyPrefix: 'nextcache:v2:',
    });

    global.cacheHandlerConfig = { handlers: [redisHandler] };
    return global.cacheHandlerConfig;
  })();

  return global.cacheHandlerConfigPromise;
});

module.exports = CacheHandler;
