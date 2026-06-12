/**
 * BBF Design System — Surface Context (programmatic override)
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-77 (surface-aware), D-94 RATIFICADA (M5-D6),
 *             D-110 RATIFICADA (M5-ADMIN-2)
 *
 * D-DS-02 FIRMADA (2026-06-12): Surface type canon BBF — 5 valores:
 *   - auto:        default según context heredado (resolved → algún valor)
 *   - sand:        fondos claros canon (superficie principal BBF)
 *   - warm:        fondos cálidos (CapabilitiesSection, MetodoSection, HeroSection)
 *   - dark:        fondos oscuros (hero principal, secciones inversas)
 *   - transparent: child preserve parent surface (composition cross-surface)
 *
 * D-110 NUEVA (M5-ADMIN-2): 'transparent' agregado.
 * Diferencia semántica vs 'auto':
 *   - auto:        "no tengo opinión, default razonable según context"
 *                  → resolved a un valor concreto con tokens propios
 *   - transparent: "explícitamente preserve lo que viene del padre"
 *                  → sin tokens propios, pure pass-through
 *
 * 'glass' DIFERIDO (D-DS-02): 0 consumers en producción. Si se necesita,
 *   retomar en despacho futuro con implementación CSS completa.
 * Valores 'sand-elevated' y 'dark-elevated' ELIMINADOS (M5-D6).
 *
 * NOTA: el patrón CANON BBF es data-surface attribute en HTML.
 * Este Context es OPCIONAL — solo cuando se requiere override programático
 * desde JS (ej: tema toggle dinámico, A/B testing).
 *
 * Para uso normal, declarar surface vía data-attribute:
 *   <section data-surface="dark">...</section>
 *
 * D-97 NUEVA (M5-D6): Surface flow ÚNICAMENTE via SurfaceContext.
 * DOM traversal por ref descartado — incompatible con React 19 + RSC.
 */

'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * BBF Design System — Surface canon 5 valores (D-DS-02 FIRMADA 2026-06-12)
 *
 * Subordinado a: D-94 (ratificada M5-D6), D-110 (ratificada M5-ADMIN-2),
 *               D-DS-02 (firmada 2026-06-12 — add warm, glass diferido)
 *
 * 5 valores canon BBF:
 *   - auto:        default según context heredado
 *   - sand:        fondos claros canon BBF (default página)
 *   - warm:        fondos cálidos canon BBF (CapabilitiesSection, MetodoSection)
 *   - dark:        fondos oscuros (hero principal, modals dark)
 *   - transparent: child preserve parent surface (composition cross-surface)
 *
 * D-110 NUEVA (M5-ADMIN-2):
 *   'transparent' agregado para composition cross-surface explícita.
 *   Diferencia semántica vs 'auto':
 *     - auto: defaultea según context (resolved → algún valor)
 *     - transparent: explícitamente preserve parent surface
 *
 * 'glass' DIFERIDO (D-DS-02): 0 consumers. Retomar con CSS completo en despacho futuro.
 */
export type Surface = 'auto' | 'sand' | 'warm' | 'dark' | 'transparent';

const SurfaceContext = createContext<Surface | undefined>(undefined);

interface SurfaceProviderProps {
  surface: Surface;
  children: ReactNode;
}

/**
 * Provider opcional para override programático de surface.
 * NO necesario en uso normal — preferir data-surface attribute.
 */
export function SurfaceProvider({ surface, children }: SurfaceProviderProps) {
  return (
    <SurfaceContext.Provider value={surface}>
      <div data-surface={surface}>{children}</div>
    </SurfaceContext.Provider>
  );
}

/**
 * Hook interno para acceder al Context (uso solo dentro de SurfaceProvider).
 * Para uso general, preferir useSurface() en src/lib/hooks/useSurface.ts.
 */
export function useSurfaceContext(): Surface | undefined {
  return useContext(SurfaceContext);
}
