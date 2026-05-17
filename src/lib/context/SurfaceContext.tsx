/**
 * BBF Design System — Surface Context (programmatic override)
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisión: D-BBF-WEB-77 (surface-awareness híbrido B+C)
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
 */

'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type Surface = 'sand' | 'dark' | 'glass' | 'sand-elevated' | 'dark-elevated' | 'auto';

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
