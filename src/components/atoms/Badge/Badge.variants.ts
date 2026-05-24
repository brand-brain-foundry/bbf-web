/**
 * BBF Badge atom variants — CVA canon (TD-11-14)
 *
 * Decisiones: D-BBF-KB-118 (vercel-style flag)
 * Tokens: borde 1px + rounded-md + uppercase tracking-wider
 * Sin hover state — decorativo (label/flag indicator)
 * D-BBF-WEB-AA: [font-weight:var()] pattern aplicado
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  [
    'inline-flex items-center justify-center',
    'border border-solid',
    'rounded-md',
    '[font-weight:var(--bbf-weight-medium)]',
    'uppercase',
    'whitespace-nowrap',
  ],
  {
    variants: {
      intent: {
        default: 'border-[var(--bbf-border-on-sand)] text-[var(--bbf-text-on-sand-muted)]',
        accent: 'border-[var(--bbf-accent-red)] text-[var(--bbf-accent-red-hover)]',
        success: 'border-[var(--bbf-color-success-border)] text-[var(--bbf-color-success-text)]',
        beta: 'border-[var(--bbf-accent-blue)] text-[var(--bbf-accent-blue-active)]',
      },
      size: {
        xs: 'text-[9px] leading-none px-1 py-[2px] tracking-normal',
        sm: 'text-[length:var(--bbf-text-xs)] px-1.5 py-0.5 tracking-wider',
        md: 'text-[length:var(--bbf-text-sm)] px-2 py-1 tracking-wider',
      },
    },
    defaultVariants: {
      intent: 'default',
      size: 'sm',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
