/**
 * BrandLogoAnimator — Client Component (D-DS-08, 2026-06-12)
 *
 * Rename BBFLogoAnimator → BrandLogoAnimator (agnóstico).
 * Subordinado a: B-BBF-WEB-M5-E-MOTION-SYSTEM
 * Decisiones: D-99 (Server + Client split), D-DS-08 (rename)
 *
 * Wrapper Client Component que aplica WAAPI a BrandLogo Server.
 * Resuelve TD-M5-D1.5-05: hover speed transition smooth via updatePlaybackRate.
 *
 * NOTA: Solo necesario cuando se requiere hover speed control smooth.
 * Para logo estático (no animated), usar BrandLogo directo.
 *
 * @example
 * ```tsx
 * import { BrandLogo } from './BrandLogo';
 * import { BrandLogoAnimator } from './BrandLogoAnimator';
 *
 * <BrandLogoAnimator>
 *   <BrandLogo variant="stamp" size="hero" animated />
 * </BrandLogoAnimator>
 * ```
 */

'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Constantes canon BBF (alineadas con motion.css tokens)
const ROTATION_DURATION_IDLE = 40000; // 40s — token canon
const ROTATION_DURATION_HOVER = 12000; // 12s — token canon
const PLAYBACK_RATE_IDLE = 1;
const PLAYBACK_RATE_HOVER = ROTATION_DURATION_IDLE / ROTATION_DURATION_HOVER; // 3.33x

export interface BrandLogoAnimatorProps {
  /** Children: BrandLogo Server Component (variant=stamp + animated=true esperado). */
  children: ReactNode;
}

export function BrandLogoAnimator({ children }: BrandLogoAnimatorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const nameCircle = wrapperRef.current.querySelector(
      '.bbf-logo-name-circle',
    ) as SVGElement | null;
    if (!nameCircle) return;

    // Cancelar CSS animation, tomar control con WAAPI
    nameCircle.style.animation = 'none';

    const animation = nameCircle.animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
      {
        duration: ROTATION_DURATION_IDLE,
        iterations: Infinity,
        easing: 'linear',
      },
    );

    animationRef.current = animation;

    return () => {
      animation.cancel();
      animationRef.current = null;
      if (nameCircle) {
        nameCircle.style.animation = '';
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (animationRef.current) {
      animationRef.current.updatePlaybackRate(PLAYBACK_RATE_HOVER);
    }
  };

  const handleMouseLeave = () => {
    if (animationRef.current) {
      animationRef.current.updatePlaybackRate(PLAYBACK_RATE_IDLE);
    }
  };

  return (
    <div
      ref={wrapperRef}
      data-component="brand-logo-animator"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-flex' }}
    >
      {children}
    </div>
  );
}
