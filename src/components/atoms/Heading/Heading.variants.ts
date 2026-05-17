/**
 * BBF Design System — Heading atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisión: D-BBF-WEB-82 (AI-readable)
 *
 * TD-M5-D4-CRIT-01 fix: text-[var(--token)] → [font-size:var(--token)]
 * Tailwind v4 arbitrary value text-[var()] sin type hint defaultea a color:.
 * L-BBF-92: usar arbitrary property explícita [font-size:var(--token)].
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const headingVariants = cva(
  [
    'font-[var(--bbf-font-display)]',
    'leading-[var(--bbf-leading-display)]',
    'tracking-[var(--bbf-tracking-display)]',
  ],
  {
    variants: {
      level: {
        'display-xl': '[font-size:var(--bbf-text-display-xl)]',
        'display-lg': '[font-size:var(--bbf-text-display-lg)]',
        'display-md': '[font-size:var(--bbf-text-display-md)]',
        h1: '[font-size:var(--bbf-text-h1)] leading-[var(--bbf-leading-heading)] tracking-[var(--bbf-tracking-heading)]',
        h2: '[font-size:var(--bbf-text-h2)] leading-[var(--bbf-leading-heading)] tracking-[var(--bbf-tracking-heading)]',
        h3: '[font-size:var(--bbf-text-h3)] leading-[var(--bbf-leading-heading)] tracking-[var(--bbf-tracking-heading)]',
        h4: '[font-size:var(--bbf-text-h4)] leading-[var(--bbf-leading-heading)]',
        h5: '[font-size:var(--bbf-text-h5)] leading-[var(--bbf-leading-heading)]',
        h6: '[font-size:var(--bbf-text-h6)] leading-[var(--bbf-leading-heading)]',
      },
      weight: {
        regular: 'font-[var(--bbf-weight-regular)]',
        medium: 'font-[var(--bbf-weight-medium)]',
        semibold: 'font-[var(--bbf-weight-semibold)]',
        bold: 'font-[var(--bbf-weight-bold)]',
        extrabold: 'font-[var(--bbf-weight-extrabold)]',
        black: 'font-[var(--bbf-weight-black)]',
      },
      color: {
        primary: 'text-[var(--bbf-text-on-light)]',
        secondary: 'text-[var(--bbf-text-on-light-secondary)]',
        inverse: 'text-[var(--bbf-text-on-dark)]',
        accent: 'text-[var(--bbf-accent-red)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      level: 'h1',
      weight: 'bold',
      color: 'primary',
      align: 'left',
    },
  },
);

export type HeadingVariants = VariantProps<typeof headingVariants>;
