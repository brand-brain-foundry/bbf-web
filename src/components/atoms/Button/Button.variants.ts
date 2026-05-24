/**
 * BBF Button — pill canon (D-BBF-KB-108)
 *
 * Sigue 3+ señales perceptibles L-BBF-21 para hover:
 *   1. gradient position shift (Tailwindflex 2026 canon)
 *   2. translate-y(-1px) lift
 *   3. shadow-md elevation
 *
 * Intents: primary (gradient red), secondary (black), outline (red border), ghost
 * Shape: rounded-full (pill canon)
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2',
    'font-semibold whitespace-nowrap',
    'rounded-full',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-60',
    'select-none cursor-pointer',
    'will-change-transform',
  ].join(' '),
  {
    variants: {
      intent: {
        primary: [
          'text-[var(--bbf-text-on-gradient-red)]',
          '[background:var(--bbf-gradient-red)]',
          '[background-size:200%_200%]',
          '[background-position:0%_50%]',
          'shadow-sm',
          '[@media(hover:hover)]:hover:[background-position:100%_50%] [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:shadow-md',
          'active:scale-[0.97] active:[background-position:50%_50%]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)]',
        ].join(' '),
        secondary: [
          'text-[var(--bbf-text-on-black)]',
          'bg-[var(--bbf-surface-black)]',
          'shadow-sm',
          '[@media(hover:hover)]:hover:bg-[var(--bbf-surface-black-elevated)] [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:shadow-md',
          'active:scale-[0.97]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)]',
        ].join(' '),
        outline: [
          'text-[var(--bbf-accent-red)]',
          'bg-transparent',
          'border-2 border-[var(--bbf-accent-red)]',
          '[@media(hover:hover)]:hover:bg-[var(--bbf-accent-red)] [@media(hover:hover)]:hover:text-[var(--bbf-text-on-red)] [@media(hover:hover)]:hover:-translate-y-px',
          'active:scale-[0.97]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)]',
        ].join(' '),
        ghost: [
          'text-[var(--bbf-text-on-sand)]',
          'bg-transparent',
          '[@media(hover:hover)]:hover:bg-[var(--bbf-color-black-100)] [@media(hover:hover)]:hover:-translate-y-px',
          'active:scale-[0.97]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)]',
        ].join(' '),
      },
      size: {
        xs: 'h-7  px-3  text-xs   gap-1.5',
        sm: 'h-9  px-4  text-sm   gap-1.5',
        md: 'h-11 px-5  text-base gap-2',
        lg: 'h-13 px-7  text-lg   gap-2',
        xl: 'h-16 px-9  text-xl   gap-2.5',
        icon: 'h-11 w-11 p-0',
      },
      surface: {
        auto: '',
        sand: '',
        dark: 'focus-visible:ring-offset-[var(--bbf-surface-black)]',
        black: 'focus-visible:ring-offset-[var(--bbf-surface-black)]',
        red: 'focus-visible:ring-offset-[var(--bbf-surface-red)]',
        glass: 'backdrop-blur-md',
      },
      loading: {
        true: 'pointer-events-none',
        false: '',
      },
    },
    compoundVariants: [
      {
        intent: 'ghost',
        surface: 'dark',
        class:
          'text-[var(--bbf-text-on-black)] [@media(hover:hover)]:hover:bg-[var(--bbf-surface-black-elevated)]',
      },
      {
        intent: 'ghost',
        surface: 'black',
        class:
          'text-[var(--bbf-text-on-black)] [@media(hover:hover)]:hover:bg-[var(--bbf-surface-black-elevated)]',
      },
      {
        intent: 'outline',
        surface: 'dark',
        class:
          'border-[var(--bbf-border-on-dark)] text-[var(--bbf-text-on-dark)] [@media(hover:hover)]:hover:bg-[var(--bbf-surface-black-elevated)]',
      },
    ],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      surface: 'auto',
      loading: false,
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
