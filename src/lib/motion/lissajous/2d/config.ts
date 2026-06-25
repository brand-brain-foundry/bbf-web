/**
 * BBF Lissajous 2D Config — SSOT canónico
 *
 * SSOT para todos los parámetros visuales del motor 2D.
 * Cada valor lleva linaje: madre → fórmula → valor.
 * El motor lee de aquí. Los tokens CSS en lissajous.css DOCUMENTAN estos valores, no los controlan.
 *
 * Source original: public/assets/documents/efecto-3/bbf-config.js (Wave 11.8-B)
 */

export const LISSAJOUS_2D_DEFAULTS = {
  // ── geometría ────────────────────────────────────────────────────────────
  radius: 140, // madre: container 96px × ~1.46 headroom · curva ocupa ±radius → no toca borde
  viewBoxPad: 60, // madre: padding anti-clip del stroke en borde SVG · viewBox = radius*2 + viewBoxPad = 340

  // ── stroke / dot ─────────────────────────────────────────────────────────
  curveWidth: 7.1, // madre: intención visual 2.0px @ container 96px · fórmula: 2.0 × (340/96) ≈ 7.1
  dotRadius: 12, // madre: intención visual 3.4px @ container 96px · fórmula: 3.4 × (340/96) ≈ 12

  // ── animación ─────────────────────────────────────────────────────────────
  resolution: 720, // 720 muestras/2π — calidad de curva (parámetro técnico, no visual)
  speed: 1.0, // madre: 1 ciclo/segundo · unidad: δ = t × speed × 2π

  // ── flags heredados ───────────────────────────────────────────────────────
  showCurve: true,
  curveOpacity: 1.0,
  colorMode: 'surface' as 'surface' | 'gradient-primary', // DEFAULT real: surface-aware (currentColor + cascade)
  showFloatingDot: false,
  floatingDotRadius: 30,
  floatAreaRange: 35,
} as const;

export type Lissajous2DDefaults = typeof LISSAJOUS_2D_DEFAULTS;
