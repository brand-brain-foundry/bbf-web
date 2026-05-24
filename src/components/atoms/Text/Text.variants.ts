/**
 * BBF Design System — Text atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-91 (tagline canon), D-BBF-WEB-92 (Tailwind v4),
 *             D-BBF-KB-105 (golden ratio scale)
 *
 * TD-M5-D4-CRIT-02 fix: text-[var(--token)] → [font-size:var(--token)]
 * L-BBF-92: Tailwind v4 arbitrary value text-[var()] defaultea a color:.
 *
 * TD-M5-D4-LATENTE-01 fix (M5-D6): compoundVariants para overline/tagline.
 * CVA procesa variants en orden de declaración; weight=regular default
 * sobreescribía font-bold de overline/tagline via tailwind-merge.
 * compoundVariants se aplican DESPUÉS → bold gana. ✓
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const textVariants = cva(
  ['font-[var(--bbf-font-body)]', 'leading-[var(--bbf-leading-base)]'],
  {
    variants: {
      // === variant: semántico existente (MANTENER — usado en homepage + hero) ===
      variant: {
        // Tier 2 cascade activated — Wave 11.4-C1
        'body-lg': [
          '[font-size:var(--bbf-typography-body-lg-size)]',
          'leading-[var(--bbf-typography-body-lg-line)]',
          'tracking-[var(--bbf-typography-body-lg-tracking)]',
          'font-[var(--bbf-typography-body-lg-weight)]',
          'font-[var(--bbf-typography-body-lg-font)]',
        ].join(' '),
        'body-md': [
          '[font-size:var(--bbf-typography-body-size)]',
          'leading-[var(--bbf-typography-body-line)]',
          'tracking-[var(--bbf-typography-body-tracking)]',
          'font-[var(--bbf-typography-body-weight)]',
          'font-[var(--bbf-typography-body-font)]',
        ].join(' '),
        'body-sm': [
          '[font-size:var(--bbf-typography-body-sm-size)]',
          'leading-[var(--bbf-typography-body-sm-line)]',
          'tracking-[var(--bbf-typography-body-sm-tracking)]',
          'font-[var(--bbf-typography-body-sm-weight)]',
          'font-[var(--bbf-typography-body-sm-font)]',
        ].join(' '),
        // NOTE: leading 1.15→1.45 (snug-small more appropriate for caption), gains weight-medium
        caption: [
          '[font-size:var(--bbf-typography-caption-size)]',
          'leading-[var(--bbf-typography-caption-line)]',
          'tracking-[var(--bbf-typography-caption-tracking)]',
          'font-[var(--bbf-typography-caption-weight)]',
          'font-[var(--bbf-typography-caption-font)]',
        ].join(' '),
        // overline: no Tier 2 group — Wave 11.4-C2 handles
        overline:
          '[font-size:var(--bbf-text-overline)] uppercase tracking-[var(--bbf-tracking-wider)]',
        // NOTE: leading 1.55→1.15 (appropriate for short tagline), tracking now via token
        tagline: [
          '[font-size:var(--bbf-typography-tagline-size)]',
          'uppercase',
          'tracking-[var(--bbf-typography-tagline-tracking)]',
          'font-[var(--bbf-typography-tagline-weight)]',
          'font-[var(--bbf-typography-tagline-font)]',
        ].join(' '),
      },
      // === size: Wave 5 golden ratio scale (D-BBF-KB-105) ===
      size: {
        lead: '[font-size:var(--bbf-text-lg)] leading-[var(--bbf-leading-base)]',
        base: '[font-size:var(--bbf-text-base)] leading-[var(--bbf-leading-base)]',
        small: '[font-size:var(--bbf-text-sm)] leading-[var(--bbf-leading-snug-small)]',
        micro:
          '[font-size:var(--bbf-text-micro)] leading-[var(--bbf-leading-snug-small)] tracking-[var(--bbf-tracking-wide)]',
      },
      // === tone: Wave 5 semantic colors (D-BBF-KB-104) ===
      tone: {
        default: 'text-[var(--bbf-text-on-sand)]',
        muted: 'text-[var(--bbf-text-on-sand-muted)]',
        subtle: 'text-[var(--bbf-text-on-sand-subtle)]',
        accent: 'text-[var(--bbf-accent-red)]',
        'on-black': 'text-[var(--bbf-text-on-black)]',
        'on-black-muted': 'text-[var(--bbf-text-on-black-muted)]',
      },
      // === color: legacy (mantener compat existente) ===
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
