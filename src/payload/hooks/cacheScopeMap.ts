/**
 * cacheScopeMap — fuente única «Global → alcance de invalidación»
 * (R-CACHE F2, D-SBWEB-CACHE).
 *
 * Cada entrada refleja el alcance REAL verificado por consumidor (grep de
 * quién llama `payload.findGlobal({slug: ...})` / el helper cacheado
 * correspondiente), no una suposición por el nombre del Global.
 * `revalidateGlobal.ts` SOLO consulta este mapa — no reimplementa la
 * decisión de qué invalida cada Global.
 *
 * Layout compartido (Header/Footer, layout.tsx raíz — TODAS las páginas):
 * - site-identity     → Header.tsx, Footer.tsx (getSiteIdentity)
 * - site-navigation   → Header.tsx, Footer.tsx
 * - site-newsletter   → Footer.tsx (NewsletterBox embebido) — el nombre
 *   sugiere "páginas de newsletter" pero el único consumidor real es el
 *   footer global; verificado por grep, no asumido.
 * - site-cta-library  → Header.tsx (getCtaByKey) + homepage
 * - seoDefaults (SEO) → metadata default de toda página sin override
 *   propio. Orden Zavala: cableado PRIMERO (mayor impacto de misión).
 * - socialLinks       → 0 consumidores en render verificados hoy. Alcance
 *   conservador (layout) — depende de D-SBWEB-BRAND sin resolver (marco
 *   §8). No se inventa alcance fino sin base; se ajusta cuando BRAND firme.
 * - brandSystem       → getBrandSystem() sin caller real en src/ (coincide
 *   con HAL-SBWEB-BRANDSYSTEM-DISCONNECTED-01, "5/6 grupos sin puente a
 *   render"). Mismo criterio conservador que socialLinks.
 *
 * Página específica (su propio path exacto, sin cascada):
 * - site-homepage      → home (page.tsx)
 * - site-contact-page  → /contacto (contacto/page.tsx)
 * - site-contact       → /contacto (contacto/page.tsx)
 */
import { layoutScope, pageScope, type CachePath } from '@/lib/cache/invalidate';

export const globalCacheScope: Record<string, CachePath[]> = {
  'site-identity': layoutScope(),
  'site-navigation': layoutScope(),
  'site-newsletter': layoutScope(),
  'site-cta-library': layoutScope(),
  seoDefaults: layoutScope(),
  socialLinks: layoutScope(),
  brandSystem: layoutScope(),
  'site-homepage': pageScope(),
  'site-contact-page': pageScope('/contacto'),
  'site-contact': pageScope('/contacto'),
};
