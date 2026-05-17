/**
 * BBF Design System — LocaleSwitcher molecule variants
 *
 * Subordinado a: B-BBF-WEB-M5-D2-LOCALESWITCHER
 * Decisiones: D-77, D-78, D-82, D-85
 *
 * API monolítica canon BBF.
 * Surface-aware via data-attribute ancestor + variant prop override.
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Container variants
 */
export const localeSwitcherVariants = cva(
  ['bbf-locale-switcher', 'inline-flex', 'items-center', 'gap-0'],
  {
    variants: {
      surface: {
        auto: '', // hereda data-surface ancestor
        sand: '', // explícito sand
        dark: '', // explícito dark
        glass: '', // explícito glass
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      surface: 'auto',
      size: 'md',
    },
  },
);

/**
 * Pill variants (cada botón locale)
 */
export const localeSwitcherPillVariants = cva(
  [
    'bbf-locale-switcher__pill',
    'inline-flex items-center justify-center',
    'font-medium uppercase',
    'transition-colors',
    'cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2',
    'disabled:cursor-default',
  ],
  {
    variants: {
      size: {
        sm: 'h-7 px-2.5 text-xs',
        md: 'h-8 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
      },
      active: {
        true: 'bbf-locale-switcher__pill--active',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      active: false,
    },
  },
);

export type LocaleSwitcherVariants = VariantProps<typeof localeSwitcherVariants>;
export type LocaleSwitcherPillVariants = VariantProps<typeof localeSwitcherPillVariants>;
