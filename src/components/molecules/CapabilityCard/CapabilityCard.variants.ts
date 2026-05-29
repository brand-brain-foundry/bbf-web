/**
 * CapabilityCard variants — CVA
 * D-86 compound: align prop (Q3 FASE 2 firmada)
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const capabilityCardVariants = cva('bbf-capability-card', {
  variants: {
    align: {
      l: 'bbf-capability-card--l',
      r: 'bbf-capability-card--r',
    },
  },
  defaultVariants: {
    align: 'l',
  },
});

export type CapabilityCardVariants = VariantProps<typeof capabilityCardVariants>;
