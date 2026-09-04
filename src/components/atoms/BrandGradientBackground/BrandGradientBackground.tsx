'use client';

/**
 * BBF BrandGradientBackground — atom (D-SBWEB-BLOB-BRAND-01)
 *
 * Integra el asset madre WebGL2 (`public/assets/blob/background-back/
 * SB Blobs Background.html`) como atom de identidad reutilizable — fondo
 * animado de gradiente de marca (blue+green, composición OKLCH). Hermano de
 * `BlobBackground` (Three.js+matcap), NO variante — motores distintos
 * (A-01), comparten solo la categoría "fondo de identidad" y el PATRÓN de
 * wrapper (canvas absolute+lifecycle), no el código (ver nota L-98 abajo).
 *
 * Surface: nace con `useSurface()` (D-97) — NO repite el DOM-traversal
 * (`closest('[data-surface]')`) que `BlobBackground.tsx` usa (deuda
 * preexistente, no tocada este turno). Nota: `useSurface()` devuelve
 * `undefined` salvo que un `<SurfaceProvider>` ancestro exista — hoy CERO
 * consumidores en producción (`lib/context/SurfaceContext.tsx`, patrón
 * "construido y no conectado"). No es una regresión de este atom: a
 * diferencia de `BLOB_INTENTS`, el color de este fondo es fijo a los
 * primitivos de marca (no varía por surface), así que no depende
 * funcionalmente de leer el ambiente — solo expone `data-surface` cuando el
 * contexto SÍ está disponible, en vez de adivinar.
 */

import { useEffect, useRef, useState } from 'react';

import { createBrandGradientEngine, type BrandGradientEngine } from '@/lib/brand-gradient';
import { useSurface } from '@/lib/hooks/useSurface';
import { cn } from '@/lib/utils';

interface BrandGradientBackgroundProps {
  className?: string;
  /** Skip todo el render (útil para tests o override forzado). */
  disabled?: boolean;
}

function webGL2Supported(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

export function BrandGradientBackground({
  className,
  disabled = false,
}: BrandGradientBackgroundProps) {
  const surface = useSurface();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!webGL2Supported()) {
      setUseFallback(true);
      return;
    }

    // Defensa en profundidad post-incidente (2026-09-04): engine.ts ya no
    // lanza hacia arriba (try/catch en cada punto de contacto con la API),
    // pero el punto de llamada se guarda igual — el blob es decorativo,
    // nunca debe tumbar el render de React si algo se escapa igual.
    let engine: BrandGradientEngine | null;
    try {
      engine = createBrandGradientEngine(canvas);
    } catch {
      engine = null;
    }
    if (!engine) {
      setUseFallback(true);
      return;
    }

    // ── Lifecycle: IO + visibilitychange + reduced-motion + resize + cleanup ──
    // L-98 (src/components/CLAUDE.md): el patrón replica el de `BlobBackground`
    // (mismas 4 preocupaciones), el CÓDIGO se duplica a propósito — 2 casos con
    // APIs de motor incompatibles (`window.BlobScene` singleton global vs este
    // engine module-local) no justifican forzar un hook `useEngineLifecycle`
    // compartido (despacho §0.1.4: "si acopla mal, duplicar documentando").
    // BlobBackground no se toca este turno; el día que un 3er consumidor
    // aparezca, ESE es el punto real de extraer el hook (≥3 casos, L-98).
    let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused) engine.pause();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.05) {
          engine.pause();
        } else if (!paused) {
          engine.resume();
        }
      },
      { threshold: [0, 0.05] },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        engine.pause();
      } else if (!paused) {
        engine.resume();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (e: MediaQueryListEvent) => {
      paused = e.matches;
      if (paused) {
        engine.pause();
      } else {
        engine.resume();
      }
    };
    motionMql.addEventListener('change', onMotionChange);

    const onResize = () => engine.resize();
    window.addEventListener('resize', onResize);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motionMql.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', onResize);
      engine.destroy();
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      data-component="bbf-brand-gradient-background"
      {...(surface ? { 'data-surface': surface } : {})}
      className={cn('pointer-events-none absolute inset-0 z-0', className)}
      aria-hidden="true"
    >
      {useFallback ? (
        // Fallback sin color hardcodeado (NO repite la deuda #000000 de
        // BlobBackground, HAL-COMPONENT-LITERAL-HARDCODE-01) — token semantic
        // ya en producción, misma intención de marca que el motor WebGL.
        <div className="absolute inset-0 [background:var(--bbf-gradient-brand)]" />
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full" />
      )}
    </div>
  );
}
