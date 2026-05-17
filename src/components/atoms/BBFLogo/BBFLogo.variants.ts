/**
 * BBF Design System — BBFLogo atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 *
 * NOTA: M5-D1 introduce variants size canon. Preserva tamaño hero original
 * (var(--bbf-logo-size-hero)) como default.
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const bbfLogoVariants = cva(['relative', 'inline-block'], {
  variants: {
    size: {
      xs: '[--logo-rendered-size:1.5rem]', // 24px (nav futuro)
      sm: '[--logo-rendered-size:2rem]', // 32px
      md: '[--logo-rendered-size:2.5rem]', // 40px (nav)
      lg: '[--logo-rendered-size:4rem]', // 64px
      xl: '[--logo-rendered-size:6rem]', // 96px
      hero: '', // default: usa --bbf-logo-size-hero clamp() responsive
    },
  },
  defaultVariants: {
    size: 'hero',
  },
});

export type BBFLogoVariants = VariantProps<typeof bbfLogoVariants>;
