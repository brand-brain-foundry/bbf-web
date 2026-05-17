/**
 * BBF Design System — Text atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const textVariants = cva(
  ['font-[var(--bbf-font-body)]', 'leading-[var(--bbf-leading-body)]'],
  {
    variants: {
      variant: {
        'body-lg': 'text-[var(--bbf-text-body-lg)]',
        'body-md': 'text-[var(--bbf-text-body-md)]',
        'body-sm': 'text-[var(--bbf-text-body-sm)]',
        caption: 'text-[var(--bbf-text-caption)] leading-[var(--bbf-leading-snug)]',
        overline:
          'text-[var(--bbf-text-overline)] uppercase tracking-[var(--bbf-tracking-overline)] font-[var(--bbf-weight-bold)]',
      },
      color: {
        primary: 'text-[var(--bbf-text-on-light)]',
        secondary: 'text-[var(--bbf-text-on-light-secondary)]',
        muted: 'text-[var(--bbf-text-on-light-muted)]',
        inverse: 'text-[var(--bbf-text-on-dark)]',
        accent: 'text-[var(--bbf-accent-red)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      weight: {
        regular: 'font-[var(--bbf-weight-regular)]',
        medium: 'font-[var(--bbf-weight-medium)]',
        semibold: 'font-[var(--bbf-weight-semibold)]',
        bold: 'font-[var(--bbf-weight-bold)]',
      },
    },
    defaultVariants: {
      variant: 'body-md',
      color: 'primary',
      align: 'left',
      weight: 'regular',
    },
  },
);

export type TextVariants = VariantProps<typeof textVariants>;
