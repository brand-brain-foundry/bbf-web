/**
 * BBF MegaMenuPanel variants — CVA canon multi-export (Wave 11.6-C)
 *
 * 4 exports: panel (isOpen state) + item link + title (hasDescription) + description.
 * Hover D-BBF-WEB-ZZ canonical preserved: [@media(hover:hover)]:hover:
 * Image scale inline en MegaMenuPanel.tsx (static, no variant needed).
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const megaMenuPanelVariants = cva(
  [
    'absolute top-[calc(100%+0.5rem)] right-0 left-0',
    'z-[var(--bbf-z-mega-menu)]',
    'rounded-2xl',
    'bg-[var(--bbf-surface-sand)]',
    'border border-[var(--bbf-border-on-sand)]',
    '[box-shadow:var(--bbf-shadow-floating)]',
    'overflow-hidden',
    'transition-all duration-200 ease-out',
  ],
  {
    variants: {
      open: {
        true: 'pointer-events-auto translate-y-0 opacity-100',
        false: 'pointer-events-none -translate-y-2 opacity-0',
      },
    },
    defaultVariants: { open: false },
  },
);

export const megaMenuItemVariants = cva([
  'group block p-4',
  'rounded-xl',
  'bg-transparent',
  'transition-all duration-200 ease-out',
  '[@media(hover:hover)]:hover:bg-[var(--bbf-surface-hover-subtle-on-sand)]',
  'focus-visible:bg-[var(--bbf-surface-hover-subtle-on-sand)] focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-1 focus-visible:outline-none',
]);

export const megaMenuTitleVariants = cva(
  [
    'text-sm font-semibold',
    'text-[var(--bbf-text-on-sand)]',
    'transition-colors duration-200 ease-out',
    '[@media(hover:hover)]:group-hover:text-[var(--bbf-accent-red)] group-focus-visible:text-[var(--bbf-accent-red)]',
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
  'text-xs',
  'leading-[var(--bbf-leading-snug)]',
  'text-[var(--bbf-text-on-sand-muted)]',
]);

export type MegaMenuPanelVariants = VariantProps<typeof megaMenuPanelVariants>;
export type MegaMenuTitleVariants = VariantProps<typeof megaMenuTitleVariants>;
