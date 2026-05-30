/**
 * MethodSection variants — CVA
 * D-89 section compound. Surface defaults to 'sand' (continuidad con Capabilities).
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const methodSectionVariants = cva('bbf-method-section', {
  variants: {
    surface: {
      sand: 'bg-[var(--bbf-surface-sand)]',
      auto: '',
    },
  },
  defaultVariants: {
    surface: 'sand',
  },
});

export type MethodSectionVariants = VariantProps<typeof methodSectionVariants>;
