/**
 * BBF Design System — BBFLogo atom variants
 *
 * Subordinado a: B-BBF-WEB-M5-D1.5-LOGO-SYSTEM-V2
 * Decisiones: D-BBF-WEB-77 (surface-aware), D-BBF-WEB-78 (animated state),
 *             D-BBF-WEB-82 (AI-readable), D-BBF-WEB-84 (assets canon)
 *
 * Variantes canon BBF Logo:
 *   - icon:       solo flor 8-petal (favicons, márgenes pequeños)
 *   - horizontal: icon + nombre horizontal (header, footer, cards)
 *   - name-only:  solo nombre horizontal (footer minimal)
 *   - stamp:      icon centro + nombre circular alrededor (hero, brand moments)
 *
 * El atom NO conoce color (hereda via currentColor + surface canon).
 * El atom SÍ conoce tamaño (variant size + override numérico/string).
 * Proporción interna preservada por variant.
 *
 * Animation pertenece SOLO a variant="stamp" cuando animated=true.
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const bbfLogoVariants = cva(['bbf-logo', 'inline-flex', 'items-center', 'shrink-0'], {
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

export type BBFLogoVariants = VariantProps<typeof bbfLogoVariants>;
