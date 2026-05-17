/**
 * BBF Design System — Surface Context (programmatic override)
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-77 (surface-aware), D-94 RATIFICADA (M5-D6)
 *
 * D-94 RATIFICADA: Surface type canon BBF — 4 valores canónicos:
 *   - auto:  contexto heredado (default)
 *   - dark:  fondos oscuros (hero principal, secciones inversas)
 *   - sand:  fondos claros canon (superficie principal BBF)
 *   - glass: superficies translúcidas (backdrop blur, LocaleSwitcher)
 *
 * Valores 'sand-elevated' y 'dark-elevated' ELIMINADOS (M5-D6):
 * eran CSS variable names que se filtraron al type — no son valores
 * de surface context (sus tokens CSS --bbf-surface-sand-elevated
 * permanecen en semantic/colors.css).
 *
 * NOTA: el patrón CANON BBF es data-surface attribute en HTML.
 * Este Context es OPCIONAL — solo cuando se requiere override programático
 * desde JS (ej: tema toggle dinámico, A/B testing).
 *
 * Para uso normal, declarar surface vía data-attribute:
 *   <section data-surface="dark">...</section>
 *
 * Para override programático:
 *   <SurfaceProvider surface="dark">...</SurfaceProvider>
 *
 * D-97 NUEVA (M5-D6): Surface flow ÚNICAMENTE via SurfaceContext.
 * DOM traversal por ref descartado — incompatible con React 19 + RSC.
 */

'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type Surface = 'auto' | 'dark' | 'sand' | 'glass';

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
