/**
 * BBF LanguageSwitcher variants — CVA canon (Wave 11.6-C)
 *
 * 2 exports: container (pending state) + button (active state).
 * Hover D-BBF-WEB-ZZ canonical: [@media(hover:hover)]:hover:
 * Sin surface variant — glass context implícito del Header.
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const languageSwitcherVariants = cva(
  ['inline-flex items-center gap-1', 'text-sm', 'transition-opacity duration-150 ease-out'],
  {
    variants: {
      pending: {
        true: 'opacity-60',
        false: '',
      },
    },
    defaultVariants: { pending: false },
  },
);

export const languageSwitcherButtonVariants = cva(
  ['px-1 py-1', 'transition-opacity duration-150 ease-out'],
  {
    variants: {
      active: {
        true: 'cursor-default font-semibold text-[var(--bbf-text-on-light)]',
        false: [
          'text-[var(--bbf-text-on-light)] opacity-60',
          '[@media(hover:hover)]:hover:opacity-100',
          'focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 focus-visible:opacity-100 focus-visible:outline-none',
        ].join(' '),
      },
    },
    defaultVariants: { active: false },
  },
);

export type LanguageSwitcherVariants = VariantProps<typeof languageSwitcherVariants>;
export type LanguageSwitcherButtonVariants = VariantProps<typeof languageSwitcherButtonVariants>;
