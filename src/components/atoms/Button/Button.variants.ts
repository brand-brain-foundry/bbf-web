import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-body font-semibold tracking-wide',
    'rounded-[var(--bbf-radius-btn)]',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--bbf-surface-black)] text-[var(--bbf-color-white)]',
          'hover:bg-[var(--bbf-surface-black-elevated)]',
        ],
        secondary: [
          'bg-transparent text-[var(--bbf-text-on-light)]',
          'border border-[var(--bbf-color-black-900)]',
          'hover:bg-[var(--bbf-color-sand-100)]',
        ],
        ghost: [
          'bg-transparent text-[var(--bbf-text-on-light)]',
          'hover:bg-[var(--bbf-color-sand-100)]',
        ],
        destructive: [
          'bg-[var(--bbf-accent-red)] text-[var(--bbf-color-white)]',
          'hover:bg-[var(--bbf-accent-red-accessible)]',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);
