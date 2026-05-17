/**
 * BBF Design System — Button atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-79 (compound NO), D-BBF-WEB-80 (asChild),
 *             D-BBF-WEB-77 (surface-aware), D-BBF-WEB-81 (folder canon)
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button variants canon BBF.
 *
 * Variants:
 * - intent: visual purpose (primary | secondary | ghost | outline)
 * - size: dimension (sm | md | lg | icon)
 * - surface: contexto visual (auto | sand | dark | glass)
 * - loading: estado loading (true | false)
 */
export const buttonVariants = cva(
  // Base classes — siempre aplicadas
  [
    'inline-flex items-center justify-center',
    'font-medium',
    'transition-all',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2',
    'cursor-pointer',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-[var(--bbf-surface-black)]',
          'text-[var(--bbf-text-on-dark)]',
          'hover:bg-[var(--bbf-surface-black-elevated)]',
          'active:scale-[0.98]',
        ],
        secondary: [
          'bg-[var(--bbf-accent-red)]',
          'text-[var(--bbf-text-on-dark)]',
          'hover:bg-[var(--bbf-accent-red-hover)]',
          'active:scale-[0.98]',
        ],
        ghost: [
          'bg-transparent',
          'text-[var(--bbf-text-on-light)]',
          'hover:bg-[var(--bbf-surface-sand-elevated)]',
        ],
        outline: [
          'border border-[var(--bbf-border-on-light)]',
          'bg-transparent',
          'text-[var(--bbf-text-on-light)]',
          'hover:bg-[var(--bbf-surface-sand-elevated)]',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-lg',
        lg: 'h-12 px-6 text-lg rounded-full',
        icon: 'h-10 w-10 rounded-full',
      },
      surface: {
        auto: '',
        sand: '',
        dark: '',
        glass: 'backdrop-blur-md',
      },
      loading: {
        true: 'pointer-events-none',
        false: '',
      },
    },
    compoundVariants: [
      // Ghost en surface dark
      {
        intent: 'ghost',
        surface: 'dark',
        class: 'text-[var(--bbf-text-on-dark)] hover:bg-[var(--bbf-surface-black-elevated)]',
      },
      // Outline en surface dark
      {
        intent: 'outline',
        surface: 'dark',
        class:
          'border-[var(--bbf-border-on-dark)] text-[var(--bbf-text-on-dark)] hover:bg-[var(--bbf-surface-black-elevated)]',
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
