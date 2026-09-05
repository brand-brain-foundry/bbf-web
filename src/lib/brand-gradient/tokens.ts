/**
 * brand-gradient/tokens.ts — SSOT color (D-SBWEB-BLOB-BRAND-01)
 *
 * GLSL no lee custom properties CSS (`var()`) — un shader necesita el valor
 * numérico al compilar. Este módulo espeja los primitivos OKLCH de marca
 * (`primitives/colors.css`) como vec3 sRGB PRECOMPUTADOS, mismo patrón que
 * `lib/blob/blob-intents.ts` (comentario `// --bbf-color-X` documenta el
 * origen, no lo verifica en runtime).
 *
 * Precomputado documentado preferido sobre un parser oklch→sRGB en runtime
 * (despacho §5 escalación: "más simple, sin runtime parse"). Cambiar el
 * primitivo canon en `colors.css` requiere re-derivar el valor aquí a mano.
 *
 * Cero HEX crudo (`#rrggbb`) — fuera del scope de detección de
 * `scripts/lint/check-color-tokens.ts` (que solo vigila HEX), pero la fuente
 * de verdad real es la misma: los primitivos `-oklch` de `colors.css`.
 */

export interface BrandTokenDefinition {
  /** [r, g, b] sRGB 0..1 — valor a usar directo como uniform/constante vec3 GLSL. */
  rgb: readonly [number, number, number];
  /** Primitivo OKLCH espejado (primitives/colors.css). */
  cssVar: string;
}

export const BRAND_TOKENS = {
  'green-400': {
    rgb: [0.256, 0.897, 0.552],
    cssVar: '--bbf-color-green-400-oklch',
  },
  'blue-500': {
    rgb: [0.145, 0.373, 0.945],
    cssVar: '--bbf-color-blue-500-oklch',
  },
  'blue-600': {
    rgb: [0.074, 0.288, 0.858],
    cssVar: '--bbf-color-blue-600-oklch',
  },
  'blue-900': {
    rgb: [0.0, 0.055, 0.522],
    cssVar: '--bbf-color-blue-900-oklch',
  },
  'black-900': {
    rgb: [0, 0, 0],
    cssVar: '--bbf-color-black-900-oklch',
  },
} as const satisfies Record<string, BrandTokenDefinition>;

export type BrandToken = keyof typeof BRAND_TOKENS;
