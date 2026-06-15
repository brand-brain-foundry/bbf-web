/**
 * BBF Design System — Text atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-91 (tagline canon), D-BBF-WEB-92 (Tailwind v4),
 *             D-BBF-KB-105 (golden ratio scale)
 *
 * TD-M5-D4-CRIT-02 fix: text-[var(--token)] → [font-size:var(--token)]
 * TD-11-30 fix: font-[var(--weight-token)] → [font-weight:var(--token)]
 *               font-[var(--font-token)] → [font-family:var(--token)]
 * L-BBF-92: Tailwind v4 arbitrary value text-[var()] defaultea a color:.
 * L-BBF-AA: Tailwind v4 font-[var()] defaultea a font-family: — usar prop explícita.
 *
 * TD-M5-D4-LATENTE-01 fix (M5-D6): compoundVariant para tagline.
 * CVA procesa variants en orden; weight=regular default sobreescribía
 * font-bold de tagline via tailwind-merge. compoundVariant DESPUÉS → bold gana. ✓
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const textVariants = cva(
  ['[font-family:var(--bbf-font-body)]', 'leading-[var(--bbf-leading-base)]'],
  {
    variants: {
      // === variant: semántico existente (MANTENER — usado en homepage + hero) ===
      variant: {
        // Tier 2 cascade activated — Wave 11.4-C1
        'body-lg': [
          '[font-size:var(--bbf-typography-body-lg-size)]',
          'leading-[var(--bbf-typography-body-lg-line)]',
          'tracking-[var(--bbf-typography-body-lg-tracking)]',
          '[font-weight:var(--bbf-typography-body-lg-weight)]',
          '[font-family:var(--bbf-typography-body-lg-font)]',
        ].join(' '),
        'body-md': [
          '[font-size:var(--bbf-typography-body-size)]',
          'leading-[var(--bbf-typography-body-line)]',
          'tracking-[var(--bbf-typography-body-tracking)]',
          '[font-weight:var(--bbf-typography-body-weight)]',
          '[font-family:var(--bbf-typography-body-font)]',
        ].join(' '),
        'body-sm': [
          '[font-size:var(--bbf-typography-body-sm-size)]',
          'leading-[var(--bbf-typography-body-sm-line)]',
          'tracking-[var(--bbf-typography-body-sm-tracking)]',
          '[font-weight:var(--bbf-typography-body-sm-weight)]',
          '[font-family:var(--bbf-typography-body-sm-font)]',
        ].join(' '),
        caption: [
          '[font-size:var(--bbf-typography-caption-size)]',
          'leading-[var(--bbf-typography-caption-line)]',
          'tracking-[var(--bbf-typography-caption-tracking)]',
          '[font-weight:var(--bbf-typography-caption-weight)]',
          '[font-family:var(--bbf-typography-caption-font)]',
        ].join(' '),
        tagline: [
          '[font-size:var(--bbf-typography-tagline-size)]',
          'uppercase',
          'tracking-[var(--bbf-typography-tagline-tracking)]',
          '[font-weight:var(--bbf-typography-tagline-weight)]',
          '[font-family:var(--bbf-typography-tagline-font)]',
        ].join(' '),
        /* ── EYEBROW: una intención, familia como variante ──────────
         *  eyebrow         → font-display (footer nav groups, default)
         *  eyebrow-mono    → font-mono    (SectionHeader §N — migra al llegar)
         *  Ambas: xs + tracking-wider + uppercase + bold (rol invariante).
         *  Consumer actual: Footer group title (eyebrow display).
         *  Future: SectionHeader usará eyebrow-mono al migrar. */
        eyebrow: [
          '[font-family:var(--bbf-font-display)]',
          '[font-size:var(--bbf-text-xs)]',
          'tracking-[var(--bbf-tracking-wider)]',
          'uppercase',
          '[font-weight:var(--bbf-weight-bold)]',
        ].join(' '),
        'eyebrow-mono': [
          '[font-family:var(--bbf-font-mono)]',
          '[font-size:var(--bbf-text-xs)]',
          'tracking-[var(--bbf-tracking-wider)]',
          'uppercase',
          '[font-weight:var(--bbf-weight-bold)]',
        ].join(' '),
      },
      // === tone: Wave 5 semantic colors (D-BBF-KB-104) ===
      tone: {
        default: 'text-[var(--bbf-text-on-sand)]',
        muted: 'text-[var(--bbf-text-on-sand-muted)]',
        subtle: 'text-[var(--bbf-text-on-sand-subtle)]',
        accent: 'text-[var(--bbf-accent-blue)]',
        'on-black': 'text-[var(--bbf-text-on-black)]',
        'on-black-muted': 'text-[var(--bbf-text-on-black-muted)]',
      },
      // === color: legacy (mantener compat existente) ===
      color: {
        primary: 'text-[var(--bbf-text-on-light)]',
        secondary: 'text-[var(--bbf-text-on-light-secondary)]',
        muted: 'text-[var(--bbf-text-on-light-muted)]',
        inverse: 'text-[var(--bbf-text-on-dark)]',
        accent: 'text-[var(--bbf-accent-blue)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      weight: {
        regular: '[font-weight:var(--bbf-weight-regular)]',
        medium: '[font-weight:var(--bbf-weight-medium)]',
        semibold: '[font-weight:var(--bbf-weight-semibold)]',
        bold: '[font-weight:var(--bbf-weight-bold)]',
      },
    },
    compoundVariants: [
      {
        variant: 'tagline',
        weight: 'regular',
        class: '[font-weight:var(--bbf-weight-bold)]',
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
