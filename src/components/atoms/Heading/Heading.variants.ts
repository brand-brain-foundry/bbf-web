/**
 * BBF Design System — Heading atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-82 (AI-readable), D-BBF-KB-105 (golden ratio scale)
 *
 * TD-M5-D4-CRIT-01 fix: text-[var(--token)] → [font-size:var(--token)]
 * L-BBF-92: Tailwind v4 arbitrary value text-[var()] defaultea a color:.
 * Usar siempre [font-size:var(--token)] para font-size tokens.
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
        // === Golden ratio scale (D-BBF-KB-105) ===
        'display-1': [
          '[font-size:var(--bbf-text-display-1)]',
          'leading-[var(--bbf-leading-tight)]',
          'tracking-[var(--bbf-tracking-tighter)]',
          'font-[var(--bbf-weight-semibold)]',
        ].join(' '),
        'display-2': [
          '[font-size:var(--bbf-text-display-2)]',
          'leading-[var(--bbf-leading-tight)]',
          'tracking-[var(--bbf-tracking-tighter)]',
          'font-[var(--bbf-weight-semibold)]',
        ].join(' '),
        h1: [
          '[font-size:var(--bbf-text-h1)]',
          'leading-[var(--bbf-leading-snug)]',
          'tracking-[var(--bbf-tracking-tight)]',
          'font-[var(--bbf-weight-bold)]',
        ].join(' '),
        h2: [
          '[font-size:var(--bbf-text-h2)]',
          'leading-[var(--bbf-leading-snug)]',
          'tracking-[var(--bbf-tracking-tight)]',
          'font-[var(--bbf-weight-bold)]',
        ].join(' '),
        h3: [
          '[font-size:var(--bbf-text-lg)]',
          'leading-[var(--bbf-leading-snug)]',
          'tracking-[var(--bbf-tracking-tight)]',
          'font-[var(--bbf-weight-semibold)]',
        ].join(' '),
        h4: '[font-size:var(--bbf-text-base)] leading-[var(--bbf-leading-snug)]',
        h5: '[font-size:var(--bbf-text-sm)] leading-[var(--bbf-leading-snug)]',
        h6: '[font-size:var(--bbf-text-xs)] leading-[var(--bbf-leading-snug)]',

        // === Legacy fluid scale (Major Third — compatibilidad) ===
        'display-xl': '[font-size:var(--bbf-text-display-xl)]',
        'display-lg': '[font-size:var(--bbf-text-display-lg)]',
        'display-md': '[font-size:var(--bbf-text-display-md)]',
      },
      weight: {
        regular: 'font-[var(--bbf-weight-regular)]',
        medium: 'font-[var(--bbf-weight-medium)]',
        semibold: 'font-[var(--bbf-weight-semibold)]',
        bold: 'font-[var(--bbf-weight-bold)]',
        extrabold: 'font-[var(--bbf-weight-extrabold)]',
        black: 'font-[var(--bbf-weight-black)]',
      },
      // tone: semántico Wave 5 (D-BBF-KB-104)
      tone: {
        default: 'text-[var(--bbf-text-on-sand)]',
        muted: 'text-[var(--bbf-text-on-sand-muted)]',
        accent: 'text-[var(--bbf-accent-red)]',
        'on-black': 'text-[var(--bbf-text-on-black)]',
      },
      // color: legacy alias (mantener compat)
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
