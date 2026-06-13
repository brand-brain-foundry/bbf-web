import { defineRouting } from 'next-intl/routing';
import { PATHNAMES } from './pathnames';

/**
 * Routing canon BBF — Multilingüe ES/EN
 *
 * Decisiones firmadas:
 * - D-BBF-WEB-49: route group app/(frontend)/[locale]/
 * - D-BBF-WEB-50: next-intl como library
 * - D-BBF-WEB-51: localePrefix 'as-needed' (ES sin prefijo, EN con /en/). REAFIRMADA por
 *   D-NAV-7 (FASE 4.C.1, 2026-06-13). El 'always' previo era drift NO firmado de Wave 12-A2
 *   (solo aquí; middleware/navigation.ts/componentes/M4_Decisions §3 siempre fueron 'as-needed') → raíz del blocker EN-404.
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

  pathnames: PATHNAMES, // SSOT compartido: src/i18n/pathnames.ts (C-01)

  localeDetection: true,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365, // 1 año
  },

  alternateLinks: false,
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
