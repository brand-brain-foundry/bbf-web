/**
 * BBF MobileMenu variants — CVA canon multi-export (Wave 11.6-C / F3b drill-down)
 *
 * 5 exports: iconButton (trigger+close) + backdrop + panel + item link + subMenuTrigger (V1 drill-down).
 * F3b: panel sin overflow-y-auto — cada vista controla su propio scroll (absolute inset-0 overflow-y-auto).
 * Hover D-BBF-WEB-ZZ canonical preserved: [@media(hover:hover)]:hover:
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const mobileMenuIconButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    '[border-radius:var(--bbf-radius-interactive)]',
    'text-[var(--bbf-on-surface-title)]',
    'transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
    '[@media(hover:hover)]:hover:bg-[var(--bbf-on-surface-hover-bg)]',
    'active:scale-95',
    'focus-visible:ring-2 focus-visible:ring-[var(--bbf-on-surface-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
  ],
  {
    variants: {
      size: {
        trigger: 'h-11 w-11 lg:hidden',
        close: 'h-9 w-9',
      },
    },
    defaultVariants: { size: 'close' },
  },
);

export const mobileMenuBackdropVariants = cva(
  [
    'fixed inset-0 z-[var(--bbf-z-drawer)] lg:hidden',
    'bg-black/40 backdrop-blur-sm',
    'transition-opacity [transition-duration:var(--bbf-motion-duration-base)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
  ],
  {
    variants: {
      open: {
        true: 'pointer-events-auto opacity-100',
        false: 'pointer-events-none opacity-0',
      },
    },
    defaultVariants: { open: false },
  },
);

export const mobileMenuPanelVariants = cva(
  [
    'fixed top-0 right-0 z-[var(--bbf-z-drawer-panel)] lg:hidden',
    'h-[100dvh] w-[85vw] max-w-[380px]',
    'bg-[var(--bbf-on-surface-bg)]',
    '[border-top-left-radius:var(--bbf-radius-floating)] [border-bottom-left-radius:var(--bbf-radius-floating)]',
    'flex flex-col',
    'transition-transform [transition-duration:var(--bbf-motion-duration-base)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
  ],
  {
    variants: {
      open: {
        true: 'translate-x-0 [box-shadow:var(--bbf-shadow-floating)]',
        false: 'translate-x-[105%] shadow-none',
      },
    },
    defaultVariants: { open: false },
  },
);

export const mobileMenuItemVariants = cva([
  'group block min-h-[44px] border-b border-[var(--bbf-on-surface-border)]/40 px-2 py-4',
  'text-[length:var(--bbf-text-body-lg)] [font-weight:var(--bbf-weight-medium)] text-[var(--bbf-on-surface-title)]',
  'transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
  '[@media(hover:hover)]:hover:translate-x-1 [@media(hover:hover)]:hover:text-[var(--bbf-on-surface-link)]',
  'focus-visible:translate-x-1 focus-visible:text-[var(--bbf-on-surface-link)] focus-visible:outline-none',
]);

// V1 drill-down: ítem con subLinks — button full-width con ChevronRight
export const mobileMenuSubMenuTriggerVariants = cva([
  'group flex w-full items-center justify-between',
  'min-h-[44px] border-b border-[var(--bbf-on-surface-border)]/40 px-2 py-4',
  'text-left text-[length:var(--bbf-text-body-lg)] [font-weight:var(--bbf-weight-medium)] text-[var(--bbf-on-surface-title)]',
  'transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
  '[@media(hover:hover)]:hover:translate-x-1 [@media(hover:hover)]:hover:text-[var(--bbf-on-surface-link)]',
  'focus-visible:translate-x-1 focus-visible:text-[var(--bbf-on-surface-link)] focus-visible:outline-none',
]);

export type MobileMenuIconButtonVariants = VariantProps<typeof mobileMenuIconButtonVariants>;
export type MobileMenuBackdropVariants = VariantProps<typeof mobileMenuBackdropVariants>;
export type MobileMenuPanelVariants = VariantProps<typeof mobileMenuPanelVariants>;
