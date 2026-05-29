'use client';

/**
 * BBF Lissajous Atom — Wave 11.8-B
 *
 * Unified atom — llamable por nombre (canon iconos pattern).
 *
 * Usage:
 *   <Lissajous name="trefoil-3d" />
 *   <Lissajous name="dense-2d" />
 *   <Lissajous name="trefoil-3d" speed={1.2} />
 *
 * Refs: D-BBF-WEB-QQ (Lissajous como sistema iconos)
 * Default: TRANSPARENT (adopta surface debajo per D-BBF-WEB-QQ §5.1)
 * prefers-reduced-motion: respected per WCAG 2.3.3
 */

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

import { getLissajousVariant, Lissajous2DMotor, Lissajous3DMotor } from '@/lib/motion/lissajous';
import type {
  LissajousName,
  LissajousRuntimeOptions,
  LissajousPreset2D,
  LissajousPreset3D,
} from '@/lib/motion/lissajous';

import { cn } from '@/lib/utils';

export interface LissajousProps extends LissajousRuntimeOptions {
  /**
   * Nombre registrado de la variante. Use autocompletion para ver opciones.
   */
  name: LissajousName;

  /**
   * Override de math preset (advanced — raro).
   */
  overrideMath?: LissajousPreset2D | LissajousPreset3D;

  /**
   * className wrapper (para sizing, positioning).
   * Default: w-full h-full (llena container parent).
   */
  className?: string;

  /**
   * aria-label para accessibility.
   */
  ariaLabel?: string;

  /**
   * Modo de animación 2D. Solo aplica a variantes 2D (ignorado en 3D).
   * - traveling: path animado continuo (default)
   * - static: path estático renderizado una vez
   * - point-center: path estático + dot central
   */
  animation?: 'traveling' | 'static' | 'point-center';
}

export function Lissajous({
  name,
  overrideMath,
  className,
  ariaLabel,
  animation = 'point-center',
  ...runtimeOptions
}: LissajousProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // runtimeOptions omitted from deps: motors are init-once per Wave 11.8-B scope.
  // name/overrideMath/prefersReducedMotion changes restart the motor correctly.

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (prefersReducedMotion) return;

    const variant = getLissajousVariant(name);
    const preset = overrideMath ?? variant.preset;

    if (variant.dimension === '3d') {
      const motor = new Lissajous3DMotor({
        preset: preset as LissajousPreset3D,
        container,
        ...runtimeOptions,
      });
      motor.start();
      return () => motor.stop();
    } else {
      const motor = new Lissajous2DMotor({
        preset: preset as LissajousPreset2D,
        container,
        animation: animation,
        ...runtimeOptions,
      });
      motor.start();
      return () => motor.stop();
    }
  }, [name, overrideMath, prefersReducedMotion, animation]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel ?? getLissajousVariant(name).defaultLabel}
      className={cn('relative h-full w-full overflow-hidden', className)}
    >
      {prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center [color:currentColor]"
        >
          <svg
            viewBox="0 0 24 24"
            width="48"
            height="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12c1.5-3 4.5-3 6 0M8 12c1.5 3 4.5 3 6 0" />
          </svg>
        </div>
      )}
    </div>
  );
}
