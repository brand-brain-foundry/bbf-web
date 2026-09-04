'use client';

/**
 * BBF BrandGradientBackground — lazy client boundary (perf)
 *
 * Defiere el chunk del motor WebGL2 fuera del First Load JS de la ruta —
 * `ssr:false` requiere un client boundary propio (Next.js App Router no
 * permite `ssr:false` en Server Components, HeroSection.tsx lo es). El fondo
 * dark base de HeroSection ya pinta vía CSS
 * (`[data-component='bbf-hero-section'][data-surface='dark']` en hero.css)
 * antes de que este chunk cargue — sin flash sin-fondo.
 */

import dynamic from 'next/dynamic';

export const BrandGradientBackgroundLazy = dynamic(
  () => import('./BrandGradientBackground').then((m) => m.BrandGradientBackground),
  { ssr: false },
);
