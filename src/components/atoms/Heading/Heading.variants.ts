/**
 * BBF Design System — Heading atom variants
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-82 (AI-readable), D-BBF-KB-105 (golden ratio scale)
 *
 * TD-M5-D4-CRIT-01 fix: text-[var(--token)] → [font-size:var(--token)]
 * TD-11-30 fix: font-[var(--weight-token)] → [font-weight:var(--token)]
 *               font-[var(--font-token)] → [font-family:var(--token)]
 * L-BBF-92: Tailwind v4 arbitrary value text-[var()] defaultea a color:.
 * L-BBF-AA: Tailwind v4 font-[var()] defaultea a font-family: — usar prop explícita.
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const headingVariants = cva(
  [
    '[font-family:var(--bbf-font-display)]',
    'leading-[var(--bbf-leading-tight)]',
    'tracking-[var(--bbf-tracking-tighter)]',
  ],
  {
    variants: {
      level: {
        // === Display Hero — extension Major Third canon (D-FASE2-03 Op-A, Hero Home H1) ===
        'display-hero': [
          '[font-size:var(--bbf-typography-display-hero-size)]',
          'leading-[var(--bbf-typography-display-hero-leading)]',
          'tracking-[var(--bbf-typography-display-hero-tracking)]',
          '[font-weight:var(--bbf-typography-display-hero-weight)]',
          '[font-family:var(--bbf-font-display)]',
        ].join(' '),
        // === Golden ratio scale (D-BBF-KB-105) — Tier 2 cascade (Wave 11.4-C1) ===
        'display-1': [
          '[font-size:var(--bbf-typography-display-1-size)]',
          'leading-[var(--bbf-typography-display-1-line)]',
          'tracking-[var(--bbf-typography-display-1-tracking)]',
          '[font-weight:var(--bbf-typography-display-1-weight)]',
          '[font-family:var(--bbf-typography-display-1-font)]',
        ].join(' '),
        'display-2': [
          '[font-size:var(--bbf-typography-display-2-size)]',
          'leading-[var(--bbf-typography-display-2-line)]',
          'tracking-[var(--bbf-typography-display-2-tracking)]',
          '[font-weight:var(--bbf-typography-display-2-weight)]',
          '[font-family:var(--bbf-typography-display-2-font)]',
        ].join(' '),
        'display-section-h2': [
          '[font-size:var(--bbf-typography-display-section-h2-size)]',
          'leading-[var(--bbf-typography-display-section-h2-line)]',
          'tracking-[var(--bbf-typography-display-section-h2-tracking)]',
          '[font-weight:var(--bbf-typography-display-section-h2-weight)]',
          '[font-family:var(--bbf-typography-display-section-h2-font)]',
        ].join(' '),
        'display-step-title': [
          '[font-size:var(--bbf-typography-display-step-title-size)]',
          'leading-[var(--bbf-typography-display-step-title-line)]',
          'tracking-[var(--bbf-typography-display-step-title-tracking)]',
          '[font-weight:var(--bbf-typography-display-step-title-weight)]',
          '[font-family:var(--bbf-typography-display-step-title-font)]',
        ].join(' '),
        'display-card-title': [
          '[font-size:var(--bbf-typography-display-card-title-size)]',
          'leading-[var(--bbf-typography-display-card-title-line)]',
          'tracking-[var(--bbf-typography-display-card-title-tracking)]',
          '[font-weight:var(--bbf-typography-display-card-title-weight)]',
          '[font-family:var(--bbf-typography-display-card-title-font)]',
        ].join(' '),
        h1: [
          '[font-size:var(--bbf-typography-h1-size)]',
          'leading-[var(--bbf-typography-h1-line)]',
          'tracking-[var(--bbf-typography-h1-tracking)]',
          '[font-weight:var(--bbf-typography-h1-weight)]',
          '[font-family:var(--bbf-typography-h1-font)]',
        ].join(' '),
        h2: [
          '[font-size:var(--bbf-typography-h2-size)]',
          'leading-[var(--bbf-typography-h2-line)]',
          'tracking-[var(--bbf-typography-h2-tracking)]',
          '[font-weight:var(--bbf-typography-h2-weight)]',
          '[font-family:var(--bbf-typography-h2-font)]',
        ].join(' '),
        // FIX TD-11-48: was text-lg (18px) → typography-h3 (20px) via Tier 2
        h3: [
          '[font-size:var(--bbf-typography-h3-size)]',
          'leading-[var(--bbf-typography-h3-line)]',
          'tracking-[var(--bbf-typography-h3-tracking)]',
          '[font-weight:var(--bbf-typography-h3-weight)]',
          '[font-family:var(--bbf-typography-h3-font)]',
        ].join(' '),
        // NOTE: was text-base (16px) → typography-h4 (18px) via Tier 2 — implicit bug fix
        h4: [
          '[font-size:var(--bbf-typography-h4-size)]',
          'leading-[var(--bbf-typography-h4-line)]',
          'tracking-[var(--bbf-typography-h4-tracking)]',
          '[font-weight:var(--bbf-typography-h4-weight)]',
          '[font-family:var(--bbf-typography-h4-font)]',
        ].join(' '),
      },
      weight: {
        regular: '[font-weight:var(--bbf-weight-regular)]',
        medium: '[font-weight:var(--bbf-weight-medium)]',
        semibold: '[font-weight:var(--bbf-weight-semibold)]',
        bold: '[font-weight:var(--bbf-weight-bold)]',
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
