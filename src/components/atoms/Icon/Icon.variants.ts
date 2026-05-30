/**
 * BBF Design System — Icon atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisión: D-BBF-WEB-77 (surface-aware), D-BBF-WEB-81 (folder canon)
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const iconVariants = cva(['inline-block', 'shrink-0', 'transition-colors'], {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
    color: {
      current: 'text-current',
      primary: 'text-[var(--bbf-text-on-light)]',
      secondary: 'text-[var(--bbf-text-on-light-secondary)]',
      muted: 'text-[var(--bbf-text-on-light-muted)]',
      accent: 'text-[var(--bbf-accent-red)]',
      inverse: 'text-[var(--bbf-text-on-dark)]',
      success: 'text-[var(--bbf-text-success)]',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'current',
  },
});

export type IconVariants = VariantProps<typeof iconVariants>;
