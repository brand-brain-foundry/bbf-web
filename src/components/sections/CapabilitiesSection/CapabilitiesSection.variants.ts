/**
 * CapabilitiesSection variants — CVA
 * D-89 section compound. Surface defaults to 'sand' per Q6 FASE 1.
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const capabilitiesSectionVariants = cva('bbf-capabilities-section', {
  variants: {
    surface: {
      sand: 'bg-[var(--bbf-surface-sand)]',
      warm: 'bg-[var(--bbf-surface-warm-base)]',
      auto: '',
    },
  },
  defaultVariants: {
    surface: 'sand',
  },
});

export type CapabilitiesSectionVariants = VariantProps<typeof capabilitiesSectionVariants>;
