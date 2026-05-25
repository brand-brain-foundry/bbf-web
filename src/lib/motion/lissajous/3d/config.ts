/**
 * BBF Lissajous 3D Config — Wave 11.8-B
 *
 * Defaults runtime para motor 3D. NO incluye background.
 *
 * Source: public/assets/documents/BBF-Lissajous-3D/bbf-3d-config.js
 */

export const LISSAJOUS_3D_DEFAULTS = {
  numNodes: 28,
  speed: 0.55,
  nodeSize: 0.2,
  scale: 2.5,
  showCurve: true,
  autoRotate: true,
  bloom: true,
  curveOpacity: 0.55,
  bloomOpacity: 0.15,
  fogNear: 14,
  fogFar: 40,
} as const;

export type Lissajous3DDefaults = typeof LISSAJOUS_3D_DEFAULTS;
