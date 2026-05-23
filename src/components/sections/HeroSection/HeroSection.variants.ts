/**
 * BBF Design System — HeroSection variants
 *
 * Subordinado a: B-BBF-WEB-M5-D4-HEROSECTION
 * Decisiones: D-89 (compound), D-77 (surface-aware), D-82 (AI-readable)
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const heroSectionVariants = cva(['bbf-hero-section', 'relative', 'overflow-hidden'], {
  variants: {
    surface: {
      auto: 'bg-[var(--bbf-surface-sand)]',
      dark: 'bg-[var(--bbf-surface-black)]',
      sand: 'bg-[var(--bbf-surface-sand)]',
      transparent: '',
    },
    height: {
      screen: 'min-h-screen',
      auto: '',
      half: 'min-h-[50vh]',
    },
  },
  defaultVariants: {
    surface: 'auto',
    height: 'screen',
  },
});

export const heroSectionContentVariants = cva(
  ['bbf-hero-section__content', 'relative', 'z-20', 'mx-auto', 'flex', 'min-h-screen', 'flex-col'],
  {
    variants: {
      align: {
        center: 'items-center justify-center text-center',
        left: 'items-start justify-center text-left',
        right: 'items-end justify-center text-right',
      },
    },
    defaultVariants: {
      align: 'center',
    },
  },
);

export type HeroSectionVariants = VariantProps<typeof heroSectionVariants>;
export type HeroSectionContentVariants = VariantProps<typeof heroSectionContentVariants>;
