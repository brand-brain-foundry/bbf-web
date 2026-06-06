/**
 * BBF MobileSubMenu variants — CVA canon multi-export (Wave 11.6-C)
 *
 * 5 exports: toggle button + panel (isOpen) + general item + card item + title (hasDescription).
 * Hover D-BBF-WEB-ZZ canonical preserved: [@media(hover:hover)]:hover:
 * Image scale + description inline en MobileSubMenu.tsx (static, no variant needed).
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const mobileSubMenuToggleVariants = cva([
  'group w-full',
  'flex items-center justify-between',
  'min-h-[44px] px-2 py-4',
  'text-lg font-medium text-[var(--bbf-text-on-sand)]',
  'transition-all duration-200 ease-out',
  '[@media(hover:hover)]:hover:text-[var(--bbf-accent-blue)]',
  'focus-visible:text-[var(--bbf-accent-blue)] focus-visible:outline-none',
]);

export const mobileSubMenuPanelVariants = cva(
  ['overflow-hidden', 'transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]'],
  {
    variants: {
      open: {
        true: 'max-h-[1200px] opacity-100',
        false: 'max-h-0 opacity-0',
      },
    },
    defaultVariants: { open: false },
  },
);

export const mobileSubMenuGeneralItemVariants = cva([
  'block min-h-[44px] px-2 py-3',
  'text-sm font-medium text-[var(--bbf-text-on-sand-muted)]',
  'border-b border-[var(--bbf-border-on-sand)]/30',
  'transition-colors duration-150 ease-out',
  '[@media(hover:hover)]:hover:text-[var(--bbf-accent-blue)]',
  'focus-visible:text-[var(--bbf-accent-blue)] focus-visible:outline-none',
]);

export const mobileSubMenuCardVariants = cva([
  'group flex items-center gap-3',
  'min-h-[44px] px-2 py-3',
  'rounded-xl',
  'transition-all duration-150 ease-out',
  '[@media(hover:hover)]:hover:bg-[var(--bbf-surface-hover-subtle-on-sand)]',
  'focus-visible:bg-[var(--bbf-surface-hover-subtle-on-sand)] focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-1 focus-visible:outline-none',
]);

export const mobileSubMenuTitleVariants = cva(
  [
    'text-base font-medium',
    'text-[var(--bbf-text-on-sand)]',
    'transition-colors duration-150 ease-out',
    '[@media(hover:hover)]:group-hover:text-[var(--bbf-accent-blue)] group-focus-visible:text-[var(--bbf-accent-blue)]',
  ],
  {
    variants: {
      hasDescription: {
        true: 'mb-0.5',
        false: '',
      },
    },
    defaultVariants: { hasDescription: false },
  },
);

export type MobileSubMenuPanelVariants = VariantProps<typeof mobileSubMenuPanelVariants>;
export type MobileSubMenuTitleVariants = VariantProps<typeof mobileSubMenuTitleVariants>;
