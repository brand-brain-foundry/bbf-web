import { defineRouting } from 'next-intl/routing';

/**
 * Routing canon BBF — Multilingüe ES/EN
 *
 * Decisiones firmadas:
 * - D-BBF-WEB-49: route group app/(frontend)/[locale]/
 * - D-BBF-WEB-50: next-intl como library
 * - D-BBF-WEB-51: localePrefix 'as-needed' (ES sin prefijo)
 * - D-BBF-WEB-52: pathnames híbrido (7 fijos + catch-all dinámico)
 * - D-BBF-WEB-53: detección cookie > path > Accept-Language > default
 * - D-BBF-WEB-54: alternateLinks false (manual desde Payload data)
 *
 * Pathnames corresponden a los 4 cornerstones + 6 pillars de
 * BBF_PrimitiveTopologyCanon_v1.md §4.3 (7 únicos tras colapso).
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',

  pathnames: {
    '/': '/',
    '/cerebro-marca': { es: '/cerebro-marca', en: '/brand-brain' }, // CS-02 + P1
    '/metodo': { es: '/metodo', en: '/method' }, // CS-03 + P6
    '/casos': { es: '/casos', en: '/cases' }, // CS-04 + P5
    '/como-construir': { es: '/como-construir', en: '/how-to-build' }, // P2
    '/hub-and-spoke': '/hub-and-spoke', // P3
    '/marca-cognitiva': { es: '/marca-cognitiva', en: '/cognitive-brand' }, // P4
  },

  localeDetection: true,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365, // 1 año
  },

  alternateLinks: false,
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
