/**
 * BBF Lissajous Math — Wave 11.8-B
 *
 * Pure math functions ported from source bbf-3d-motor.js + bbf-motor.js.
 * NO side effects, NO DOM access — pure math reusable en motors + tests.
 *
 * Source: public/assets/documents/BBF-Lissajous-3D/bbf-3d-motor.js
 *         public/assets/documents/efecto-3/bbf-motor.js
 */

import type { LissajousPreset3D, LissajousPreset2D } from './types';

/**
 * Posición 3D Lissajous en parámetro t.
 *
 * Returns [x, y, z] como tuple (no Three.js Vector3 — pure math).
 * Consumer (motor.ts) crea Vector3 si necesita.
 */
export function lissajousPosition3D(
  t: number,
  preset: LissajousPreset3D,
  scale: number,
): [number, number, number] {
  return [
    scale * Math.sin(preset.a * t + preset.dx),
    scale * Math.sin(preset.b * t + preset.dy),
    scale * Math.sin(preset.c * t + preset.dz),
  ];
}

/**
 * Posición 2D Lissajous en parámetro t.
 *
 * Returns [x, y] tuple.
 */
export function lissajousPosition2D(
  t: number,
  preset: LissajousPreset2D,
  radius: number,
  delta = 0,
): [number, number] {
  return [
    radius * Math.sin(preset.a * t + delta + (preset.delta ?? 0)),
    radius * Math.sin(preset.b * t),
  ];
}

/**
 * Color HSL gradient cálido a frío para fracción f en [0, 1].
 *
 * Ported from bbf-3d-motor.js obtenerColor().
 * Returns object {h, s, l} normalizado para crear THREE.Color o CSS hsl().
 */
export function lissajousColor(f: number): { h: number; s: number; l: number } {
  const h = (0.08 + ((f * 0.6) % 1)) % 1;
  const l = 0.55 + 0.1 * Math.sin(f * 2 * Math.PI);
  return { h, s: 0.75, l };
}

/**
 * Genera SVG path string para curva Lissajous 2D completa.
 *
 * @param preset — Math preset 2D
 * @param radius — Scale factor
 * @param resolution — Número de puntos para muestrear (default 720)
 * @param delta — Fase animación (cambia con tiempo)
 * @returns SVG path "M x,y L x,y L ..." string
 */
export function lissajous2DPath(
  preset: LissajousPreset2D,
  radius: number,
  resolution = 720,
  delta = 0,
): string {
  let path = '';
  for (let i = 0; i <= resolution; i++) {
    const t = (i / resolution) * Math.PI * 2;
    const [x, y] = lissajousPosition2D(t, preset, radius, delta);
    path += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
  }
  return path;
}
