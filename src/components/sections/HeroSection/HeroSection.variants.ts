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

/* === Grid sub-component (D-FASE2-01, D-89 compound extension) === */
export const heroSectionGridVariants = cva(['bbf-hero-section-grid', 'grid', 'relative'], {
  variants: {
    cols: {
      '1': ['grid-cols-1', 'gap-[clamp(28px,3.5vw,48px)]'],
      '2-1.4-1': [
        'grid-cols-1',
        'gap-[clamp(28px,3.5vw,48px)]',
        'min-[920px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]',
        'min-[920px]:gap-[clamp(32px,6vw,96px)]',
        'min-[920px]:items-end',
      ],
    },
  },
  defaultVariants: {
    cols: '1',
  },
});

export type HeroSectionVariants = VariantProps<typeof heroSectionVariants>;
export type HeroSectionContentVariants = VariantProps<typeof heroSectionContentVariants>;
export type HeroSectionGridVariants = VariantProps<typeof heroSectionGridVariants>;
