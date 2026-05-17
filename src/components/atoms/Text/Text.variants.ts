/**
 * BBF Design System — Text atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 *
 * TD-M5-D4-CRIT-02 fix: text-[var(--token)] → [font-size:var(--token)]
 * Tailwind v4 arbitrary value text-[var()] sin type hint defaultea a color:.
 * L-BBF-92: usar arbitrary property explícita [font-size:var(--token)].
 *
 * TD-M5-D4-LATENTE-01 fix (M5-D6): compoundVariants para overline/tagline.
 * CVA procesa variants en orden de declaración; weight={regular} default
 * sobreescribía font-bold de overline/tagline via tailwind-merge.
 * compoundVariants se aplican DESPUÉS del weight default → bold gana. ✓
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const textVariants = cva(
  ['font-[var(--bbf-font-body)]', 'leading-[var(--bbf-leading-body)]'],
  {
    variants: {
      variant: {
        'body-lg': '[font-size:var(--bbf-text-body-lg)]',
        'body-md': '[font-size:var(--bbf-text-body-md)]',
        'body-sm': '[font-size:var(--bbf-text-body-sm)]',
        caption: '[font-size:var(--bbf-text-caption)] leading-[var(--bbf-leading-snug)]',
        overline:
          '[font-size:var(--bbf-text-overline)] uppercase tracking-[var(--bbf-tracking-overline)]',
        tagline: '[font-size:var(--bbf-text-base)] uppercase tracking-[0.15em]',
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
    compoundVariants: [
      {
        variant: 'overline',
        weight: 'regular',
        class: 'font-[var(--bbf-weight-bold)]',
      },
      {
        variant: 'tagline',
        weight: 'regular',
        class: 'font-[var(--bbf-weight-bold)]',
      },
    ],
    defaultVariants: {
      variant: 'body-md',
      color: 'primary',
      align: 'left',
      weight: 'regular',
    },
  },
);

export type TextVariants = VariantProps<typeof textVariants>;
