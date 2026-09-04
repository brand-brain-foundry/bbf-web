'use client';

/**
 * BBF BrandGradientBackground — lazy client boundary (perf + crash isolation)
 *
 * Defiere el chunk del motor WebGL2 fuera del First Load JS de la ruta —
 * `ssr:false` requiere un client boundary propio (Next.js App Router no
 * permite `ssr:false` en Server Components, HeroSection.tsx lo es). El fondo
 * dark base de HeroSection ya pinta vía CSS
 * (`[data-component='bbf-hero-section'][data-surface='dark']` en hero.css)
 * antes de que este chunk cargue — sin flash sin-fondo.
 *
 * Envuelto en `BrandGradientBackgroundBoundary` (post-incidente
 * 2026-09-04) — si el chunk falla al cargar o el componente lanza al
 * montar, el boundary degrada a fondo estático en vez de tumbar la página.
 */

import dynamic from 'next/dynamic';

import { BrandGradientBackgroundBoundary } from './BrandGradientBackgroundBoundary';

const BrandGradientBackgroundDynamic = dynamic(
  () => import('./BrandGradientBackground').then((m) => m.BrandGradientBackground),
  { ssr: false },
);

export function BrandGradientBackgroundLazy() {
  return (
    <BrandGradientBackgroundBoundary>
      <BrandGradientBackgroundDynamic />
    </BrandGradientBackgroundBoundary>
  );
}
