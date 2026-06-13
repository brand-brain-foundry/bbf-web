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
  '/cerebro-marca': { es: '/cerebro-marca', en: '/brand-brain' }, // CS-02 + P1
  '/metodo': { es: '/metodo', en: '/method' }, // CS-03 + P6
  '/casos': { es: '/casos', en: '/cases' }, // CS-04 + P5
  '/como-construir': { es: '/como-construir', en: '/how-to-build' }, // P2
  '/hub-and-spoke': '/hub-and-spoke', // P3
  '/marca-cognitiva': { es: '/marca-cognitiva', en: '/cognitive-brand' }, // P4
  '/contacto': { es: '/contacto', en: '/contact' },
} as const;

/** Claves de ruta canónicas (para options del select routeKey en SiteNavigation). */
export const ROUTE_KEYS = Object.keys(PATHNAMES) as Array<keyof typeof PATHNAMES>;
