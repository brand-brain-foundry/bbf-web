import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Rate limiters por endpoint
 * Sliding window canon 2026 (Upstash recomendado)
 *
 * Contact form: 3 submits / 10 min / IP
 *   Más permisivo para typo corrections legítimos
 *   Más estricto que API general (anti-spam outcome)
 */
export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '10 m'),
  prefix: 'ratelimit:bbf:contact',
  analytics: true,
});

/**
 * Get client IP del request headers
 * Funciona con Vercel x-forwarded-for + Cloudflare CF-Connecting-IP
 */
export function getClientIp(headerList: Headers): string {
  // Cloudflare proxy (primary BBF)
  const cf = headerList.get('cf-connecting-ip');
  if (cf) return cf.trim();

  // Vercel + standard proxies
  const xff = headerList.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  // Direct connection (raro en producción)
  const realIp = headerList.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '127.0.0.1';
}
