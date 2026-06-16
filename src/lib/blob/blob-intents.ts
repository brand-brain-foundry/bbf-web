/**
 * blob-intents.ts — SSOT de intenciones del blob por surface (D-BLOB-01)
 *
 * El motor (blob-scene.js) es agnóstico: recibe config vía BlobScene.setTweaks().
 * Cada intención define la "piel" completa para un data-surface dado.
 * El wrapper React (Fase 3) resuelve: data-surface → BLOB_INTENTS[surface] → setTweaks().
 *
 * COLORES: referencian tokens de la paleta canon BBF (D-BBF-KB-104).
 * PARAMS NUMÉRICOS: valores de comportamiento (no tokens — no tienen primitivo de color).
 */

export type BlobIntent = {
  bgColor: string; // hex — color del fondo WebGL (clearColor + uBg uniform)
  glowColor: string; // hex — tint/temperatura de la reflexión del matcap
  lightIntensity: number; // % 0-200 — brillo del matcap
  matcap: 'a' | 'b' | 'c' | 'd' | 'e' | 'f'; // key de textura (a/b = local; c-f = CDN)
  speed: number; // % 0-220 — velocidad del drift idle
  deform: number; // % 0-100 — gooeyness (smooth-union radius + drift amplitude)
  camera: boolean; // si la cámara orbita lentamente
};

export const BLOB_INTENTS: Record<string, BlobIntent> = {
  /**
   * DARK — intención principal. Valores validados por Zavala 2026-06-16.
   * Matcap 'b' = matcap-b.png local (Noche) — sin dependencia de CDN externo.
   */
  dark: {
    bgColor: '#000000', // --bbf-color-black-900 (canon black D-BBF-KB-104)
    glowColor: '#fdf5ed', // --bbf-color-sand-100  (canon sand  D-BBF-KB-104)
    lightIntensity: 5,
    matcap: 'b', // matcap-b.png local — NO 'c' (CDN GitHub)
    speed: 220,
    deform: 0,
    camera: true,
  },

  /**
   * SAND — TBD. Zavala calibra al construir el surface sand (FASE 4+).
   * Los valores numéricos son placeholders razonables, NO definitivos.
   * Los colores mapean a la paleta canon como propuesta inicial.
   */
  // sand: {
  //   bgColor:        '#fdf5ed', // --bbf-color-sand-100 (canon sand — superficie cálida)
  //   glowColor:      '#000000', // --bbf-color-black-900 (luz fría sobre arena)
  //   lightIntensity: 8,         // TBD
  //   matcap:         'a',       // matcap-a.png local (Cálido) — TBD
  //   speed:          150,       // TBD
  //   deform:         20,        // TBD
  //   camera:         true,
  // },
};
