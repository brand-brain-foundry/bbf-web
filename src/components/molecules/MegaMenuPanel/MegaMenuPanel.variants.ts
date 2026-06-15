/**
 * BBF MegaMenuPanel variants — CVA canon multi-export (Wave 11.6-C, updated Wave 11.8-C2)
 *
 * 3 exports: item link + title (hasDescription) + description.
 * Panel show/hide handled by Framer Motion AnimatePresence (Wave 11.8-C2).
 * Hover D-BBF-WEB-ZZ canonical preserved: [@media(hover:hover)]:hover:
 * Image scale inline en MegaMenuPanel.tsx (static, no variant needed).
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const megaMenuItemVariants = cva([
  'group block p-4',
  'rounded-xl',
  'bg-transparent',
  'transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
  '[@media(hover:hover)]:hover:bg-[var(--bbf-surface-hover-subtle-on-sand)]',
  'focus-visible:bg-[var(--bbf-surface-hover-subtle-on-sand)] focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-1 focus-visible:outline-none',
]);

export const megaMenuTitleVariants = cva(
  [
    'text-[length:var(--bbf-text-body-sm)] [font-weight:var(--bbf-weight-semibold)]',
    'text-[var(--bbf-text-on-sand)]',
    'transition-colors [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
    '[@media(hover:hover)]:group-hover:text-[var(--bbf-accent-blue)] group-focus-visible:text-[var(--bbf-accent-blue)]',
  ],
  {
    variants: {
      hasDescription: {
        true: 'mb-1',
        false: '',
      },
    },
    defaultVariants: { hasDescription: false },
  },
);

export const megaMenuDescriptionVariants = cva([
  'text-[length:var(--bbf-text-xs)]',
  'leading-[var(--bbf-leading-snug)]',
  'text-[var(--bbf-text-on-sand-muted)]',
]);

export type MegaMenuTitleVariants = VariantProps<typeof megaMenuTitleVariants>;
