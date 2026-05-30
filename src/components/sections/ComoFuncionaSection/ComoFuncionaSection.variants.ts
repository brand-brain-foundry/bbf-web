/**
 * ComoFuncionaSection variants — CVA
 * D-89 section compound. Surface defaults to 'sand' (§3 Home design spec).
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const comoFuncionaSectionVariants = cva('bbf-hiw-section', {
  variants: {
    surface: {
      sand: 'bg-[var(--bbf-surface-sand)]',
      ink: 'bg-[var(--bbf-surface-ink)]',
      auto: '',
    },
  },
  defaultVariants: {
    surface: 'sand',
  },
});

export type ComoFuncionaSectionVariants = VariantProps<typeof comoFuncionaSectionVariants>;
