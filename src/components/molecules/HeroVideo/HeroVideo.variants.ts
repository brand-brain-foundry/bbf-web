/**
 * BBF Design System — HeroVideo molecule variants
 *
 * Subordinado a: B-BBF-WEB-M5-D3-HEROVIDEO
 * Decisiones: D-78 (state simple), D-82 (AI-readable), D-86 (compound API)
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Root container variants
 */
export const heroVideoVariants = cva(['bbf-hero-video', 'absolute', 'inset-0', 'overflow-hidden'], {
  variants: {
    fit: {
      cover: '[--bbf-hero-video-object-fit:cover]',
      contain: '[--bbf-hero-video-object-fit:contain]',
      fill: '[--bbf-hero-video-object-fit:fill]',
    },
  },
  defaultVariants: {
    fit: 'cover',
  },
});

/**
 * Overlay variants
 */
export const heroVideoOverlayVariants = cva(
  ['bbf-hero-video__overlay', 'absolute', 'inset-0', 'pointer-events-none'],
  {
    variants: {
      tone: {
        none: '',
        dark: 'bg-gradient-to-b from-black/0 via-black/20 to-black/40',
        light: 'bg-gradient-to-b from-white/0 via-white/20 to-white/40',
        custom: '', // usa --bbf-hero-overlay-color
      },
    },
    defaultVariants: {
      tone: 'none',
    },
  },
);

export type HeroVideoVariants = VariantProps<typeof heroVideoVariants>;
export type HeroVideoOverlayVariants = VariantProps<typeof heroVideoOverlayVariants>;
