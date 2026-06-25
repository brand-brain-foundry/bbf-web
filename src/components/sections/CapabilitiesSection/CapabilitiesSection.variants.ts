/**
 * CapabilitiesSection variants — CVA
 * D-89 section compound. Surface defaults to 'sand' per Q6 FASE 1.
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const capabilitiesSectionVariants = cva('bbf-capabilities-section', {
  variants: {
    surface: {
      // Background via --bbf-on-surface-bg cascade in capabilities.css. CVA must NOT set bg.
      sand: '',
      warm: '',
      dark: '',
      auto: '',
    },
  },
  defaultVariants: {
    surface: 'sand',
  },
});

export type CapabilitiesSectionVariants = VariantProps<typeof capabilitiesSectionVariants>;
