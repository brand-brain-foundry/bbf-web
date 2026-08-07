/**
 * Cliente Upstash Redis — fuente única de conexión (P-CACHE, principio de Zavala).
 *
 * Extraído de rate-limit.ts para que rate-limit y el cacheHandler (cache-handler.js)
 * compartan la misma configuración de conexión (mismas env vars UPSTASH_REDIS_REST_*),
 * sin duplicar la lógica de creación del cliente.
 */
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
