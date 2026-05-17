/**
 * BBF Design System — useSurface hook
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisión: D-BBF-WEB-77 (surface-awareness híbrido)
 *
 * Detecta el surface del ancestor cercano vía data-surface attribute.
 * Útil para componentes que necesitan saber surface en JS
 * (ej: motion variants que dependen de surface).
 *
 * Para styling normal, preferir CSS rules con [data-surface="X"] selectors.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const surface = useSurface(); // 'sand' | 'dark' | 'glass' | undefined
 *   if (surface === 'dark') { ... }
 *   return <div>...</div>;
 * }
 * ```
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useSurfaceContext, type Surface } from '../context/SurfaceContext';

export function useSurface(): Surface | undefined {
  const contextSurface = useSurfaceContext();
  const ref = useRef<HTMLDivElement>(null);
  const [domSurface, setDomSurface] = useState<Surface | undefined>(undefined);

  useEffect(() => {
    if (contextSurface) {
      // Context override tiene prioridad
      return;
    }
    if (!ref.current) return;

    // Buscar ancestor más cercano con data-surface
    const ancestor = ref.current.closest('[data-surface]');
    const surface = ancestor?.getAttribute('data-surface') as Surface | null;
    setDomSurface(surface ?? undefined);
  }, [contextSurface]);

  return contextSurface ?? domSurface;
}
