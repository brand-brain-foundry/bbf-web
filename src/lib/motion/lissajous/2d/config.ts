/**
 * BBF Lissajous 2D Config — Wave 11.8-B
 *
 * Defaults runtime para motor 2D. NO incluye background (D-BBF-WEB-QQ).
 *
 * Source: public/assets/documents/efecto-3/bbf-config.js
 */

export const LISSAJOUS_2D_DEFAULTS = {
  resolution: 720,
  radius: 140,
  speed: 1.0,
  showCurve: true,
  curveOpacity: 1.0,
  curveWidth: 2.2,
  curveColor: 'currentColor', // adopta surface color via inherit
  showFloatingDot: false,
  floatingDotRadius: 30,
  floatAreaRange: 35,
} as const;

export type Lissajous2DDefaults = typeof LISSAJOUS_2D_DEFAULTS;
