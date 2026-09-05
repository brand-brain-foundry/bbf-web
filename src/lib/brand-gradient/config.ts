/**
 * brand-gradient/config.ts — SSOT parámetros (D-SBWEB-BLOB-BRAND-01)
 *
 * Todo lo extraído del asset madre (`public/assets/blob/background-back/
 * SB Blobs Background.html`, 341L) como PARÁMETRO — nunca lógica de render
 * (SDF, blend 4-color, blur, fading-zoom quedan en `shaders.ts`/`engine.ts`
 * sin cambios). Con `BRAND_GRADIENT_DEFAULTS` el render es pixel-idéntico al
 * asset original (despacho F-b, gate de pixel-fidelidad).
 *
 * Análogo a `BLOB_INTENTS` (`lib/blob/blob-intents.ts`) y a
 * `LISSAJOUS_2D_DEFAULTS` (`lib/motion/lissajous/2d/config.ts`): objeto de
 * config plano, el motor lee de aquí.
 *
 * ── MAPEO DE COLOR (12 stops → tokens de marca, despacho F-c) ───────────────
 * Los 12 stops RGB hardcodeados del asset (3 gradientes 4-color: capa de
 * blobs, fondo, grade de ajuste) YA eran esencialmente colores de marca sin
 * armonizar (Strategic: "blob verde" ≈ dE 1.8 de green-400, "blob azul" ≈
 * dE 3.0 de blue-600). Mapeo por READ directo del comentario de capa AE
 * (`green`/`blue`/`navy`/`black`) contra el step de marca más cercano:
 *
 *   Capa                    Color   RGB original            → Token
 *   ──────────────────────  ──────  ──────────────────────  ──────────
 *   Shape Layer 3 (blobs)   green   (0.208, 0.871, 0.549)   green-400
 *                           blue    (0.118, 0.310, 0.784)   blue-600
 *                           blue    (0.086, 0.337, 0.941)   blue-500
 *                           navy    (0.078, 0.153, 0.369)   blue-900
 *   Blob 2 (fondo)          blue    (0.118, 0.310, 0.784)   blue-600
 *                           black   (0, 0, 0)               black-900
 *                           black   (0, 0, 0)               black-900
 *                           navy    (0.043, 0.075, 0.220)   blue-900
 *   Adjustment Layer 1      green   (0.302, 0.933, 0.608)   green-400
 *   (grade)                 blue    (0.165, 0.353, 0.816)   blue-600
 *                           blue    (0.102, 0.353, 0.941)   blue-500
 *                           navy    (0.118, 0.227, 0.471)   blue-900
 *
 * Solo 5 tokens de marca cubren los 12 stops (varios stops eran casi
 * idénticos entre capas) — CERO color fuera de los primitivos, CERO paleta
 * ampliada (Zavala, decisión 2). Los "negros" literales (0,0,0) → black-900
 * exacto; los "navy" (azul muy oscuro, no puro negro) → blue-900, el step
 * más profundo de la rampa blue existente — NO se deriva un step nuevo más
 * oscuro (eso sería expandir la rampa, fuera de alcance).
 */

import { type BrandToken } from './tokens';

interface SinusoidTerm {
  fn: 'sin' | 'cos';
  /** madre: frecuencia angular del drift idle (rad/s implícito en `t*freq`). */
  freq: number;
  /** madre: amplitud del drift, en AE comp px. */
  amp: number;
}

interface Point {
  x: number;
  y: number;
}

interface Lobe {
  /** Centro base, AE comp px (1920×1080). */
  anchor: Point;
  /** Radios de la elipse SDF, AE comp px. */
  radius: Point;
  /** Señal de "respiración" (breathe) que escala el radio — índice en `breatheSignals`. */
  breathe: 'br' | 'br2';
  /** Radio de smooth-min con el lóbulo anterior en la cadena. `null` = primer lóbulo (sin merge). */
  smoothK: number | null;
  drift: {
    x: readonly SinusoidTerm[];
    y: readonly SinusoidTerm[];
  };
}

interface GradientStop {
  /** Punto ancla del stop, AE comp px. */
  point: Point;
  token: BrandToken;
}

export const BRAND_GRADIENT_DEFAULTS = {
  /** AE comp size — madre: comp original 1920×1080, todos los puntos viven en este espacio. */
  comp: { width: 1920, height: 1080 },

  /** madre: todo lo downstream queda muy blureado — renderizar el chain de blobs a mitad de res basta. */
  scale: 0.5,
  /** madre: cap de dpr para no sobrecargar GPU en pantallas retina. */
  dprClamp: 1.75,

  /** madre: AE Gaussian Blur "Blurriness" 12 (comp px), separable H+V. */
  blur: { sigma: 12.0 },

  /** madre: AE CC Radial Blur (Fading Zoom) — Center 1531.4,431.4 · Amount 81 normalizado. */
  radialBlur: {
    center: { x: 1531.4, y: 431.4 },
    amount: 0.105,
    /** madre: 28 muestras por eje de sampling del fading-zoom. */
    taps: 28,
    /** madre: caída de peso por muestra (`1.0 - t*fade`) — cuánto se desvanece cada streak. */
    fade: 0.86,
  },

  /** madre: intensidad de grade de Adjustment Layer 1 sobre el compuesto (luma-matched). */
  grade: { mix: 0.62 },

  /** madre: AE Noise 14% (color, clipped); `rate` = refresh del ruido en Hz (12 = cuantiza uTime). */
  noise: { amount: 0.14, rate: 12.0 },

  /** madre: smoothstep del borde SDF de los blobs (interior/exterior, AE comp px normalizado). */
  edgeSoft: { inner: 60.0, outer: -120.0 },

  /** madre: 2 señales de "respiración" compartidas — lobes 1&4 usan `br`, lobes 2&3 usan `br2`. */
  breatheSignals: {
    br: { fn: 'sin', freq: 0.33, amp: 0.1 } as SinusoidTerm,
    br2: { fn: 'cos', freq: 0.44, amp: 0.1 } as SinusoidTerm,
  },

  /** madre: 4 lóbulos SDF (Shape Layer 3) — orden de merge smin idéntico al asset. */
  lobes: [
    {
      anchor: { x: 330.0, y: 90.0 },
      radius: { x: 610.0, y: 430.0 },
      breathe: 'br',
      smoothK: null,
      drift: {
        x: [
          { fn: 'sin', freq: 0.42, amp: 150.0 },
          { fn: 'sin', freq: 0.19, amp: 80.0 },
        ],
        y: [{ fn: 'cos', freq: 0.35, amp: 115.0 }],
      },
    },
    {
      anchor: { x: 1660.0, y: 60.0 },
      radius: { x: 505.0, y: 365.0 },
      breathe: 'br2',
      smoothK: 55.0,
      drift: {
        x: [
          { fn: 'cos', freq: 0.31, amp: 165.0 },
          { fn: 'cos', freq: 0.17, amp: 70.0 },
        ],
        y: [{ fn: 'sin', freq: 0.46, amp: 100.0 }],
      },
    },
    {
      anchor: { x: 840.0, y: 1110.0 },
      radius: { x: 600.0, y: 420.0 },
      breathe: 'br2',
      smoothK: 55.0,
      drift: {
        x: [
          { fn: 'sin', freq: 0.27, amp: 185.0 },
          { fn: 'sin', freq: 0.51, amp: 70.0 },
        ],
        y: [{ fn: 'cos', freq: 0.38, amp: 130.0 }],
      },
    },
    {
      anchor: { x: 2030.0, y: 330.0 },
      radius: { x: 360.0, y: 330.0 },
      breathe: 'br',
      smoothK: 85.0,
      drift: {
        x: [{ fn: 'cos', freq: 0.49, amp: 125.0 }],
        y: [
          { fn: 'sin', freq: 0.23, amp: 160.0 },
          { fn: 'sin', freq: 0.41, amp: 60.0 },
        ],
      },
    },
  ] as readonly Lobe[],

  /** madre: los 3 gradientes 4-color del comp AE — ver tabla de mapeo arriba. */
  stops: {
    /** Shape Layer 3 — capa de blobs. */
    shape: [
      { point: { x: 1059.9, y: 40.0 }, token: 'green-400' },
      { point: { x: 1850.1, y: 95.5 }, token: 'blue-600' },
      { point: { x: 1498.3, y: 479.8 }, token: 'blue-500' },
      { point: { x: 1875.5, y: 774.2 }, token: 'blue-900' },
    ],
    /** Layer "Blob 2" — fondo. */
    background: [
      { point: { x: 872.2, y: -43.8 }, token: 'blue-600' },
      { point: { x: 1850.1, y: 95.5 }, token: 'black-900' },
      { point: { x: 1498.3, y: 479.8 }, token: 'black-900' },
      { point: { x: 1532.8, y: 907.5 }, token: 'blue-900' },
    ],
    /** Adjustment Layer 1 — grade. */
    adjustment: [
      { point: { x: 856.0, y: 4.6 }, token: 'green-400' },
      { point: { x: 1894.1, y: 63.3 }, token: 'blue-600' },
      { point: { x: 595.7, y: 809.2 }, token: 'blue-500' },
      { point: { x: 1441.6, y: 995.9 }, token: 'blue-900' },
    ],
  } as {
    shape: readonly GradientStop[];
    background: readonly GradientStop[];
    adjustment: readonly GradientStop[];
  },
} as const;

export type BrandGradientConfig = typeof BRAND_GRADIENT_DEFAULTS;
export type { SinusoidTerm, Lobe, GradientStop, Point };
