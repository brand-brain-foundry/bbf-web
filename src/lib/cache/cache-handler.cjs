/**
 * cacheHandler — adaptador Data Cache de Next.js respaldado por Upstash Redis (P-CACHE).
 *
 * Cierra HAL-SBWEB-ISR-STALE-NO-ONDEMAND-01: sin cacheHandler, revalidateTag() marca el tag
 * en memoria del proceso pero no purga el Data Cache in-memory/filesystem por defecto — el
 * núcleo (invalidateContent) ya emite el tag correcto (verificado por log de runtime), lo que
 * faltaba era este adaptador. NO reemplaza invalidateContent/cacheScopeMap — es el backend que
 * revalidateTag() necesita para que la purga surta efecto.
 *
 * CommonJS (.cjs) porque Next carga este archivo con `require()` fuera del pipeline de
 * transpilación de la app — package.json tiene "type":"module", así que un ".js" plano se
 * interpretaría como ESM y `require()` fallaría (ERR_REQUIRE_ESM).
 *
 * NO usa el SDK `@upstash/redis` (a diferencia de src/lib/redis/client.ts) — habla el protocolo
 * REST de Upstash a mano con `node:https`. Motivo medido, no supuesto: `@upstash/redis` llama al
 * `fetch()` GLOBAL, que Next.js parchea para rastrear "dynamic server usage" durante el render
 * estático. Next invoca get()/set() de este handler DENTRO del mismo contexto de render de cada
 * ruta — el `fetch()` interno del SDK, al no llevar `cache` explícito (Next 15: sin `cache`
 * explícito = no-store), se atribuye a la ruta y dispara `DynamicServerError` en el 100% de las
 * llamadas (108/108 medido en build real contra Redis real, 2026-08-07). Poner `cache:'force-cache'`
 * en el SDK NO es la solución: la respuesta de cada get() quedaría cacheada en el Data Cache de
 * Next indefinidamente (sin `revalidate`), un caché-dentro-del-caché sin invalidación — exactamente
 * el bug que este puerto existe para cerrar. `node:https` no pasa por el `fetch` parcheado por
 * Next (es una API completamente distinta) — invisible al rastreo, cero efecto colateral en la
 * clasificación estática/dinámica de las rutas.
 *
 * Conexión: mismas env vars que src/lib/redis/client.ts (UPSTASH_REDIS_REST_URL/TOKEN) —
 * fuente única de CONFIGURACIÓN de conexión. Mismo Redis, mismas env vars, implementación de
 * transporte distinta por la razón de arriba — no dos fuentes de configuración.
 *
 * Gate defensivo: si UPSTASH_REDIS_REST_URL/TOKEN faltan, o si Redis no responde, el handler
 * degrada a cache-miss permanente (get() devuelve null, set()/revalidateTag() son no-op) — el
 * sitio sigue arrancando y sirviendo, solo sin Data Cache persistente. Mismo principio que el
 * gate de STORAGE_PROVIDER (R2 ausente no tumba el build).
 */
const https = require('node:https');

const KEY_PREFIX = 'nextcache:v1:';
const TAG_PREFIX = 'nextcache:tag:v1:';
const REQUEST_TIMEOUT_MS = 5000;

const restUrl = process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const enabled = Boolean(restUrl && restToken);

if (!enabled) {
  console.warn(
    '[cache-handler] UPSTASH_REDIS_REST_URL/TOKEN ausentes — degradando a cache-miss permanente (sin Data Cache persistente).',
  );
}

/** POST {baseUrl}/pipeline — protocolo REST de Upstash a mano, sin pasar por fetch(). */
function pipeline(commands) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(commands);
    const req = https.request(
      `${restUrl}/pipeline`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${restToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: REQUEST_TIMEOUT_MS,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`Upstash REST ${res.statusCode}: ${raw}`));
            return;
          }
          try {
            resolve(JSON.parse(raw));
          } catch (error) {
            reject(error);
          }
        });
      },
    );
    req.on('timeout', () => req.destroy(new Error('Upstash REST timeout')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = class CacheHandler {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async get(cacheKey) {
    if (!enabled) return null;
    try {
      const [{ result }] = await pipeline([['GET', KEY_PREFIX + cacheKey]]);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      console.warn('[cache-handler] get() falló, degradando a cache-miss:', error);
      return null;
    }
  }

  async set(cacheKey, data, ctx) {
    if (!enabled) return;
    // Next NO pasa tags por `ctx` para entradas PAGE/ROUTE (solo para FETCH) — ver
    // response-cache/index.js. Para páginas, Next embebe los tags (incluido el tag
    // implícito de path `_N_T_/<path>` que revalidatePath necesita) en la cabecera
    // `x-next-cache-tags` del propio valor cacheado (misma fuente que lee el handler
    // de referencia de Next, file-system-cache.js). Sin este merge, revalidatePath()
    // nunca encuentra la key bajo su tag implícito y la invalidación no purga nada.
    const headerTags = (data && data.headers && data.headers['x-next-cache-tags']) || '';
    const tags = [
      ...new Set([...((ctx && ctx.tags) || []), ...headerTags.split(',').filter(Boolean)]),
    ];
    const entry = { value: data, lastModified: Date.now(), tags };
    try {
      const commands = [['SET', KEY_PREFIX + cacheKey, JSON.stringify(entry)]];
      for (const tag of tags) {
        commands.push(['SADD', TAG_PREFIX + tag, cacheKey]);
      }
      await pipeline(commands);
    } catch (error) {
      console.warn('[cache-handler] set() falló, entrada no persistida:', error);
    }
  }

  async revalidateTag(tagsArg) {
    if (!enabled) return;
    const tags = [tagsArg].flat();
    try {
      for (const tag of tags) {
        const [{ result: keys }] = await pipeline([['SMEMBERS', TAG_PREFIX + tag]]);
        const commands = (keys || []).map((key) => ['DEL', KEY_PREFIX + key]);
        commands.push(['DEL', TAG_PREFIX + tag]);
        await pipeline(commands);
      }
    } catch (error) {
      console.warn('[cache-handler] revalidateTag() falló:', error);
    }
  }

  resetRequestCache() {}
};
