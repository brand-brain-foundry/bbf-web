/**
 * Pathnames canon — SSOT de rutas localizadas (D-BBF-WEB-52).
 *
 * Objeto plano SIN import de next-intl → seguro de importar en contexto Payload
 * (schema de navegación) Y en next-intl routing. Evita duplicar la lista de rutas
 * (C-01 — una sola fuente de verdad de rutas file-based).
 *
 * Consumido por:
 *  - src/i18n/routing.ts        → defineRouting({ pathnames: PATHNAMES })
 *  - src/payload/globals/SiteNavigation.ts → routeKey select options (L1 — D-NAV-8/L1 Opción C)
 *
 * Resolución a href localizado: getPathname(locale, routeKey) (next-intl, L2).
 */
export const PATHNAMES = {
  '/': '/',
  '/cerebro-marca': { es: '/cerebro-marca', en: '/brand-brain' },
  '/metodo': { es: '/metodo', en: '/method' }, // ⛔ TAREA-METODO-MIGRATION → /como-trabajamos
  '/casos': { es: '/casos', en: '/cases' },
  '/contacto': { es: '/contacto', en: '/contact' },
  '/quienes-somos': { es: '/quienes-somos', en: '/about' }, // P1 — enum migration pendiente
  '/blog': '/blog', // P6 — enum migration pendiente
} as const;

/** Claves de ruta canónicas (para options del select routeKey en SiteNavigation). */
export const ROUTE_KEYS = Object.keys(PATHNAMES) as Array<keyof typeof PATHNAMES>;
