/**
 * BBF Design System — useSurface hook
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-77 (surface-aware), D-97 NUEVA (surface flow context-only)
 *
 * Retorna la surface contextual actual (auto/dark/sand/glass).
 * Surface flows top-down via SurfaceContext.
 *
 * D-97 NUEVA (M5-D6): Estrategia DOM traversal por ref DESCARTADA.
 * React 19 + RSC Server Components hacen incompatible el DOM traversal
 * (Server Components no tienen refs en cliente). Surface se propaga
 * ÚNICAMENTE via SurfaceContext. TD-M5-D1-01 + TD-M5-D1-02 cerradas.
 *
 * Pattern canon: components que necesitan surface override → prop explícita.
 * Components que heredan surface → useSurface() + SurfaceProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const surface = useSurface(); // 'auto' | 'dark' | 'sand' | 'glass' | undefined
 *   if (surface === 'dark') { ... }
 *   return <div>...</div>;
 * }
 * ```
 */

'use client';

import { useSurfaceContext, type Surface } from '../context/SurfaceContext';

export function useSurface(): Surface | undefined {
  return useSurfaceContext();
}
