/**
 * BBF Lissajous Registry — Wave 11.8-B
 *
 * Catálogo central de TODAS las variantes Lissajous llamables por nombre.
 *
 * Pattern canon: matches BBF Icons system (Wave 11.4).
 * Use: <Lissajous name="trefoil-3d" />
 *
 * Refs: D-BBF-WEB-QQ §3 (12 variantes inicial)
 */

import type { LissajousName, LissajousVariant } from './types';

export const LISSAJOUS_REGISTRY: Record<LissajousName, LissajousVariant> = {
  // ─── 3D Variants ──────────────────────────────────────────────────────
  'trefoil-3d': {
    name: 'trefoil-3d',
    dimension: '3d',
    preset: { a: 3, b: 2, c: 1, dx: Math.PI / 2, dy: Math.PI / 3, dz: 0 },
    defaultLabel: 'Trefoil Knot 3D',
  },
  'pretzel-3d': {
    name: 'pretzel-3d',
    dimension: '3d',
    preset: { a: 5, b: 3, c: 2, dx: Math.PI / 4, dy: Math.PI / 2, dz: 0 },
    defaultLabel: '5:3:2 Pretzel',
  },
  'toroidal-3d': {
    name: 'toroidal-3d',
    dimension: '3d',
    preset: { a: 4, b: 3, c: 2, dx: Math.PI / 3, dy: Math.PI / 2, dz: Math.PI / 4 },
    defaultLabel: 'Toroidal',
  },
  'wave-3d': {
    name: 'wave-3d',
    dimension: '3d',
    preset: { a: 1, b: 2, c: 3, dx: 0, dy: Math.PI / 2, dz: 0 },
    defaultLabel: '1:2:3 Wave',
  },
  'ring-3d': {
    name: 'ring-3d',
    dimension: '3d',
    preset: { a: 1, b: 1, c: 1, dx: 0, dy: Math.PI / 2, dz: Math.PI / 4 },
    defaultLabel: 'Tilted Ring',
  },
  'dense-3d': {
    name: 'dense-3d',
    dimension: '3d',
    preset: { a: 7, b: 5, c: 3, dx: Math.PI / 6, dy: Math.PI / 3, dz: Math.PI / 2 },
    defaultLabel: '7:5:3 Dense',
  },

  // ─── 2D Variants ──────────────────────────────────────────────────────
  'trefoil-2d': {
    name: 'trefoil-2d',
    dimension: '2d',
    preset: { a: 3, b: 2 },
    defaultLabel: '3:2 Trefoil 2D',
  },
  'pretzel-2d': {
    name: 'pretzel-2d',
    dimension: '2d',
    preset: { a: 5, b: 3 },
    defaultLabel: '5:3 Pretzel 2D',
  },
  'wave-2d': {
    name: 'wave-2d',
    dimension: '2d',
    preset: { a: 1, b: 2 },
    defaultLabel: '1:2 Wave 2D',
  },
  'ring-2d': {
    name: 'ring-2d',
    dimension: '2d',
    preset: { a: 1, b: 1 },
    defaultLabel: 'Circle (Ring 2D)',
  },
  'dense-2d': {
    name: 'dense-2d',
    dimension: '2d',
    preset: { a: 7, b: 5 },
    defaultLabel: '7:5 Dense 2D',
  },
  'figure8-2d': {
    name: 'figure8-2d',
    dimension: '2d',
    preset: { a: 1, b: 2, delta: Math.PI / 2 },
    defaultLabel: 'Figure 8 / Lemniscata',
  },
  'process-2d': {
    name: 'process-2d',
    dimension: '2d',
    preset: { a: 5, b: 4, delta: Math.PI / 4 },
    defaultLabel: '5:4 Process 2D',
  },
  'case-2d': {
    name: 'case-2d',
    dimension: '2d',
    preset: { a: 3, b: 4, delta: Math.PI / 3 },
    defaultLabel: '3:4 Case 2D',
  },
} as const;

/**
 * Helper: get variant por nombre con type safety.
 */
export function getLissajousVariant(name: LissajousName): LissajousVariant {
  return LISSAJOUS_REGISTRY[name];
}

/**
 * Helper: listar todas las names registradas (útil para lab page).
 */
export function getAllLissajousNames(): readonly LissajousName[] {
  return Object.keys(LISSAJOUS_REGISTRY) as LissajousName[];
}

/**
 * Helper: listar names por dimension.
 */
export function getLissajousNamesByDimension(dimension: '2d' | '3d'): readonly LissajousName[] {
  return Object.values(LISSAJOUS_REGISTRY)
    .filter((v) => v.dimension === dimension)
    .map((v) => v.name);
}
