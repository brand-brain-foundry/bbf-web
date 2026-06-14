/**
 * BBF Button — pill canon (D-BBF-KB-108)
 *
 * Sigue 3+ señales perceptibles L-BBF-21 para hover:
 *   1. gradient position shift (Tailwindflex 2026 canon)
 *   2. translate-y(-1px) lift
 *   3. shadow-md elevation
 *
 * 2-ejes canon (D-STATE-04-2AXIS):
 *   fill:   solid | outline  (default: solid)
 *   intent: primary | black | secondary | red  (4 puros)
 * Casos especiales fuera del 2-ejes: ghost, outline-dark
 * Shape: rounded-full (pill canon)
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2',
    'font-semibold whitespace-nowrap',
    'rounded-full',
    'transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-60',
    'select-none cursor-pointer',
    'will-change-transform',
  ].join(' '),
  {
    variants: {
      /* ── Eje 1: fill (D-STATE-04-2AXIS) ──────────────────────────────────
         CSS class + shadow aplicados via compoundVariants.
         Vacíos aquí — el compound maneja todo. */
      fill: {
        solid: '',
        outline: '',
      },

      /* ── Eje 2: intent ────────────────────────────────────────────────────
         4 intents canónicos comparten lift + active + ring.
         shadow-sm/hover:shadow-md van en compoundVariants (outline×secondary
         es sobrio, sin shadow — no es posible "quitar" desde base).
         ghost y outline-dark: fuera del 2-ejes, sin compound fill×intent. */
      intent: {
        primary: [
          '[@media(hover:hover)]:hover:-translate-y-px',
          'active:scale-[0.97]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)]',
        ].join(' '),
        black: [
          '[@media(hover:hover)]:hover:-translate-y-px',
          'active:scale-[0.97]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)]',
        ].join(' '),
        secondary: [
          'text-[var(--bbf-text-on-sand)]' /* shared solid+outline; CSS ya lo setea en outline */,
          '[@media(hover:hover)]:hover:-translate-y-px',
          'active:scale-[0.97]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)]',
        ].join(' '),
        red: [
          '[@media(hover:hover)]:hover:-translate-y-px',
          'active:scale-[0.97]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)]',
        ].join(' '),
        /* ── Casos especiales — NO parte del 2-ejes matrix ───────────────── */
        ghost: [
          'text-[var(--bbf-text-on-sand)]',
          'bg-transparent',
          '[@media(hover:hover)]:hover:bg-[var(--bbf-color-black-100)] [@media(hover:hover)]:hover:-translate-y-px',
          'active:scale-[0.97]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)]',
        ].join(' '),
        /* D-S6-02 firmada: CTA outline sobre surface dark con hover border-gradient
           Diferido L-CASCADE — 1 consumer vivo (CierreSection.tsx) */
        'outline-dark': [
          'bbf-btn-outline-dark',
          'bg-transparent',
          'border-2 border-[var(--bbf-text-on-dark-surface)]',
          'text-[var(--bbf-text-on-dark-surface)]',
          'active:scale-[0.97]',
          'focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-[var(--bbf-surface-dark-base)]',
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
        /* D-DS-02: 'glass' diferido del Surface type canónico (0 consumers en producción).
         * Este variant es Button-local (backdrop-blur para LocaleSwitcher), NO es el
         * canonical Surface type de SurfaceContext. Son sistemas independientes. */
        glass: 'backdrop-blur-md',
      },
      loading: {
        true: 'pointer-events-none',
        false: '',
      },
    },
    compoundVariants: [
      /* ── SOLID × 4 intents ────────────────────────────────────────────────
         Cada uno: clase CSS + shadow-sm + hover:shadow-md (elevación on hover) */
      {
        fill: 'solid',
        intent: 'primary',
        class: [
          'bbf-btn-solid-primary' /* blue-grad normal → black-grad hover → blue-flat focus */,
          'shadow-sm',
          '[@media(hover:hover)]:hover:shadow-md',
        ].join(' '),
      },
      {
        fill: 'solid',
        intent: 'black',
        class: [
          'bbf-btn-solid-black' /* dark-grad normal → blue-grad hover → black-flat focus */,
          'shadow-sm',
          '[@media(hover:hover)]:hover:shadow-md',
        ].join(' '),
      },
      {
        fill: 'solid',
        intent: 'secondary',
        class: [
          'bbf-btn-solid-secondary' /* sand normal → sand-deep hover → white focus (sober) */,
          'shadow-sm',
          '[@media(hover:hover)]:hover:shadow-md',
        ].join(' '),
      },
      {
        fill: 'solid',
        intent: 'red',
        class: [
          'bbf-btn-solid-red' /* red-grad normal → blue-grad hover → red-flat focus */,
          'shadow-sm',
          '[@media(hover:hover)]:hover:shadow-md',
        ].join(' '),
      },

      /* ── OUTLINE × 4 intents ──────────────────────────────────────────────
         primary/black/red: shadow-sm + hover:shadow-md (igual que solid).
         secondary: sobrio — sin shadow (diseño intencional). */
      {
        fill: 'outline',
        intent: 'primary',
        class: [
          'bbf-btn-outline-primary' /* blue-grad border normal → dark-grad hover → ring focus */,
          'shadow-sm',
          '[@media(hover:hover)]:hover:shadow-md',
        ].join(' '),
      },
      {
        fill: 'outline',
        intent: 'black',
        class: [
          'bbf-btn-outline-black' /* dark-grad border normal → blue-grad hover */,
          'shadow-sm',
          '[@media(hover:hover)]:hover:shadow-md',
        ].join(' '),
      },
      {
        fill: 'outline',
        intent: 'secondary',
        class: 'bbf-btn-outline-secondary' /* sober — CSS border sand, sin shadow */,
      },
      {
        fill: 'outline',
        intent: 'red',
        class: [
          'bbf-btn-outline-red' /* dark/black-grad border 6s → blue-grad hover */,
          'shadow-sm',
          '[@media(hover:hover)]:hover:shadow-md',
        ].join(' '),
      },

      /* ── Surface interactions ─────────────────────────────────────────────
         ghost+dark/black: texto e hover ajustados a superficies oscuras.
         fill:outline × intent:primary × surface:dark: ring border + bg-hover (diferido L-CASCADE). */
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
        fill: 'outline',
        intent: 'primary',
        surface: 'dark',
        class:
          'border-[var(--bbf-border-on-dark)] text-[var(--bbf-text-on-dark)] [@media(hover:hover)]:hover:bg-[var(--bbf-surface-black-elevated)]',
      },
    ],
    defaultVariants: {
      fill: 'solid',
      intent: 'primary',
      size: 'md',
      surface: 'auto',
      loading: false,
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
