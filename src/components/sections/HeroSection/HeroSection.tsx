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
  type HeroSectionVariants,
  type HeroSectionContentVariants,
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
   COMPOUND EXPORT (canon Radix pattern)
   ============================================================ */
export const HeroSection = Object.assign(HeroSectionRoot, {
  Content: HeroSectionContent,
});
