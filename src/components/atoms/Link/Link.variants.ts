/**
 * BBF Link atom variants — CVA canon (TD-11-61)
 *
 * Hover: [@media(hover:hover)]:hover: canon (D-BBF-WEB-ZZ Wave 11.5-B)
 * Variants: default / subtle / underline
 */

import { cva, type VariantProps } from 'class-variance-authority';

const focusVisibleClasses =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:rounded-sm';

export const linkVariants = cva('transition-colors duration-150', {
  variants: {
    variant: {
      default: [
        'text-[var(--bbf-text-on-light)]',
        '[@media(hover:hover)]:hover:text-[var(--bbf-accent-red)]',
        '[@media(hover:hover)]:hover:underline',
        'underline-offset-4',
        'active:opacity-70',
        focusVisibleClasses,
      ].join(' '),
      subtle: [
        'text-[var(--bbf-text-on-light-secondary)]',
        '[@media(hover:hover)]:hover:text-[var(--bbf-text-on-light)]',
        'active:opacity-70',
        focusVisibleClasses,
      ].join(' '),
      underline: [
        'underline underline-offset-4',
        'text-[var(--bbf-text-on-light)]',
        '[@media(hover:hover)]:hover:text-[var(--bbf-accent-red)]',
        'active:opacity-70',
        focusVisibleClasses,
      ].join(' '),
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type LinkVariants = VariantProps<typeof linkVariants>;
