/**
 * BrandLogo variants — D-DS-08 (2026-06-12)
 *
 * Rename BBFLogo → BrandLogo (agnostic, generic).
 * CSS classes bbf-logo* se mantienen (token system, no component name).
 *
 * Decisiones: D-77 (surface-aware), D-78 (animated), D-82 (AI-readable),
 *             D-84 (assets canon), D-99 (Server+Client split), D-DS-08 (rename)
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const brandLogoVariants = cva(['bbf-logo', 'inline-flex', 'items-center', 'shrink-0'], {
  variants: {
    variant: {
      icon: 'bbf-logo--icon',
      horizontal: 'bbf-logo--horizontal',
      'name-only': 'bbf-logo--name-only',
      stamp: 'bbf-logo--stamp',
    },
    size: {
      xs: '[--bbf-logo-rendered:1.5rem]',
      sm: '[--bbf-logo-rendered:2rem]',
      md: '[--bbf-logo-rendered:2.5rem]',
      lg: '[--bbf-logo-rendered:4rem]',
      xl: '[--bbf-logo-rendered:6rem]',
      hero: '', // usa default --bbf-logo-size-hero (responsive clamp)
    },
  },
  defaultVariants: {
    variant: 'icon',
    size: 'md',
  },
});

export type BrandLogoVariants = VariantProps<typeof brandLogoVariants>;
