/**
 * BBF Design System — HeroSection section compound
 *
 * Subordinado a: B-BBF-WEB-M5-D4-HEROSECTION
 * Decisiones: D-89 (compound API), D-77 (surface-aware data-surface),
 *             D-82 (AI-readable data-component)
 *
 * API compound canon BBF (D-89):
 *
 *   <HeroSection surface="dark">
 *     <HeroVideo ...>...</HeroVideo>
 *     <HeroSection.Content align="center">
 *       <BBFLogo variant="stamp" size="hero" animated />
 *       <Heading level="display-2" color="inverse">...</Heading>
 *       <Text variant="tagline" color="inverse">...</Text>
 *       <Button asChild intent="primary" size="lg">
 *         <a href="mailto:...">contactanos</a>
 *       </Button>
 *     </HeroSection.Content>
 *   </HeroSection>
 *
 * Server Component (sin estado interactivo).
 * TD-M5-D4-01: hero-entrance CSS → migrar a motion system M5-E.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  heroSectionVariants,
  heroSectionContentVariants,
  heroSectionGridVariants,
  type HeroSectionVariants,
  type HeroSectionContentVariants,
  type HeroSectionGridVariants,
} from './HeroSection.variants';

/* ============================================================
   ROOT
   ============================================================ */
export interface HeroSectionProps extends HeroSectionVariants {
  className?: string;
  children: ReactNode;
}

/**
 * HeroSection — raíz del compound. Renderiza como <main>.
 *
 * @example
 * ```tsx
 * <HeroSection surface="dark" height="screen">
 *   <HeroVideo ...>...</HeroVideo>
 *   <HeroSection.Content align="center">...</HeroSection.Content>
 * </HeroSection>
 * ```
 */
function HeroSectionRoot({ surface, height, className, children }: HeroSectionProps) {
  return (
    <main
      data-component="bbf-hero-section"
      data-surface={surface}
      className={cn(heroSectionVariants({ surface, height }), className)}
    >
      {children}
    </main>
  );
}

/* ============================================================
   CONTENT (sub-component)
   ============================================================ */
export interface HeroSectionContentProps extends HeroSectionContentVariants {
  className?: string;
  children: ReactNode;
}

/**
 * HeroSection.Content — contenedor del contenido principal sobre el video.
 *
 * @example
 * ```tsx
 * <HeroSection.Content align="center">
 *   <BBFLogo variant="stamp" size="hero" animated />
 *   <Heading level="display-2" color="inverse" align="center">...</Heading>
 * </HeroSection.Content>
 * ```
 */
function HeroSectionContent({ align, className, children }: HeroSectionContentProps) {
  return (
    <div
      data-component="bbf-hero-section-content"
      className={cn(heroSectionContentVariants({ align }), className)}
    >
      {children}
    </div>
  );
}

/* ============================================================
   GRID (sub-component — D-FASE2-01, compound extension D-89)
   ============================================================ */
export interface HeroSectionGridProps extends HeroSectionGridVariants {
  className?: string;
  children: ReactNode;
}

/**
 * HeroSection.Grid — layout grid sub-component.
 * cols="1" → single column stack.
 * cols="2-1.4-1" → 2-col 1.4fr/1fr at ≥920px (Claude Design hero layout).
 *
 * @example
 * ```tsx
 * <HeroSection.Grid cols="2-1.4-1">
 *   <div>{/* title col *\/}</div>
 *   <div>{/* lede col *\/}</div>
 * </HeroSection.Grid>
 * ```
 */
function HeroSectionGrid({ cols, className, children }: HeroSectionGridProps) {
  return (
    <div
      data-component="bbf-hero-section-grid"
      className={cn(heroSectionGridVariants({ cols }), className)}
    >
      {children}
    </div>
  );
}
HeroSectionGrid.displayName = 'HeroSection.Grid';

/* ============================================================
   COMPOUND EXPORT (canon Radix pattern)
   ============================================================ */
export const HeroSection = Object.assign(HeroSectionRoot, {
  Content: HeroSectionContent,
  Grid: HeroSectionGrid,
});
