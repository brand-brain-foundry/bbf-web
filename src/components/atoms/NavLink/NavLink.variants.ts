/**
 * BBF NavLink atom variants — CVA canon (TD-11-23)
 *
 * Decisiones: D-BBF-KB-112 (NavLink Wave 8)
 * Hover: [@media(hover:hover)]:hover: canon (D-BBF-WEB-ZZ Wave 11.5-B)
 *
 * Dos variantes:
 *   navLinkBaseVariants  — clases del link/button trigger
 *   navLinkUnderlineVariants — clases del <span> underline decorativo
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const navLinkBaseVariants = cva(
  [
    'group relative inline-flex items-center gap-1',
    'text-sm font-medium',
    'text-[var(--bbf-text-on-sand)]',
    'transition-all duration-200 ease-out',
    '[@media(hover:hover)]:hover:text-[var(--bbf-accent-red)]',
    'focus-visible:outline-none focus-visible:text-[var(--bbf-accent-red)]',
  ],
  {
    variants: {
      active: {
        true: 'text-[var(--bbf-accent-red)]',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export type NavLinkBaseVariants = VariantProps<typeof navLinkBaseVariants>;

export const navLinkUnderlineVariants = cva(
  ['absolute left-0 h-px', 'bg-[var(--bbf-accent-red)]', 'transition-all duration-300 ease-out'],
  {
    variants: {
      active: {
        true: 'w-full',
        false: 'w-0 [@media(hover:hover)]:group-hover:w-full group-focus-visible:w-full',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
