/**
 * BBF Lissajous Types — Wave 11.8-B
 *
 * Types compartidos por motors 2D + 3D + registry + atom.
 *
 * Refs: D-BBF-WEB-QQ (Lissajous como sistema iconos)
 */

/**
 * Math preset 3D — define las frecuencias (a,b,c) y phases (dx,dy,dz)
 * para una curva Lissajous en 3 dimensiones.
 */
export interface LissajousPreset3D {
  a: number;
  b: number;
  c: number;
  dx: number;
  dy: number;
  dz: number;
}

/**
 * Math preset 2D — define frecuencias (a,b) y fase opcional para 2D.
 */
export interface LissajousPreset2D {
  a: number;
  b: number;
  delta?: number;
}

/**
 * Names registrados de variantes Lissajous (autocompletable).
 *
 * Naming canon: {preset}-{dimension}
 * Ejemplos: trefoil-3d, dense-2d, ring-3d.
 *
 * Para agregar nueva variante: agregar al registry.ts + actualizar este type.
 */
export type LissajousName =
  // 3D variants
  | 'trefoil-3d'
  | 'pretzel-3d'
  | 'toroidal-3d'
  | 'wave-3d'
  | 'ring-3d'
  | 'dense-3d'
  // 2D variants
  | 'trefoil-2d'
  | 'pretzel-2d'
  | 'wave-2d'
  | 'ring-2d'
  | 'dense-2d'
  | 'figure8-2d'
  | 'method-2d';

/**
 * Dimension de la variante.
 */
export type LissajousDimension = '2d' | '3d';

/**
 * Definición completa de una variante en el registry.
 */
export interface LissajousVariant {
  name: LissajousName;
  dimension: LissajousDimension;
  preset: LissajousPreset3D | LissajousPreset2D;
  defaultLabel: string;
}

/**
 * Configuración runtime opcional override para advanced usage.
 */
export interface LissajousRuntimeOptions {
  speed?: number;
  scale?: number;
  numNodes?: number;
  nodeSize?: number;
  showCurve?: boolean;
  autoRotate?: boolean;
  bloom?: boolean;
  showFloatingDot?: boolean;
  showGuides?: boolean;
}
