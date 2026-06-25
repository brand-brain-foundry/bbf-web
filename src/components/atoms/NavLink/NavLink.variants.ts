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
    '[font-size:var(--bbf-text-body-md)] [font-weight:var(--bbf-weight-medium)]' /* D-5: 14px→16px (piso cuerpo mobile, footer + desktop nav) */,
    'text-[var(--bbf-on-surface-title)]',
    'transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
    '[@media(hover:hover)]:hover:text-[var(--bbf-on-surface-link)]',
    'focus-visible:outline-none focus-visible:text-[var(--bbf-on-surface-link)]',
  ],
  {
    variants: {
      active: {
        true: 'text-[var(--bbf-on-surface-link)]',
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
  [
    'absolute left-0 h-px',
    'bg-[var(--bbf-on-surface-link)]',
    'transition-all [transition-duration:var(--bbf-motion-duration-base)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
  ],
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
