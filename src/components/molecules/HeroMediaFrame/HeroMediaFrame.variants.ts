/**
 * BBF Design System — HeroMediaFrame molecule variants
 *
 * Despacho: B-BBF-WEB-HERO-HOME-CONSTRUCTION (FASE 5)
 * Decisiones: D-86 (compound API), D-FASE2-06 (HeroMediaFrame NEW)
 *
 * CSS classes live in tokens/components/hero-media-frame.css (Tier 3).
 * Variants here are minimal — compound slots use BEM classes directly.
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const heroMediaFrameVariants = cva(['bbf-hero-media-frame'], {
  variants: {},
  defaultVariants: {},
});

export type HeroMediaFrameVariants = VariantProps<typeof heroMediaFrameVariants>;
