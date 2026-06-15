/**
 * BBF FormField variants — agnóstico surface sand (D-BBF-WEB-BB Opción A, Wave 11.6-B)
 *
 * FormField asume surface sand context actual.
 * Wave 12+ si aparece consumer ink/dark: agregar surface variant CON consumer real (YAGNI).
 *
 * Tokens explícitos --bbf-*-on-sand (no contextuales) — decisión D-BBF-WEB-BB Opción A.
 * Hover T-B-1 canónico: [@media(hover:hover)]:hover: — D-BBF-WEB-CC Opción B.
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const formFieldLabelVariants = cva([
  'mb-2 block',
  'text-[length:var(--bbf-text-body-sm)]',
  '[font-weight:var(--bbf-weight-medium)]',
  'text-[var(--bbf-text-on-sand)]',
]);

export const formFieldBorderVariants = cva('', {
  variants: {
    error: {
      true: ['border-[var(--bbf-color-error)]', 'focus:border-[var(--bbf-color-error)]'],
      false: [
        'border-[var(--bbf-border-on-light-strong)]',
        'focus:border-[var(--bbf-accent-blue)]',
      ],
    },
    disabled: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      error: false,
      disabled: false,
      class: '[@media(hover:hover)]:hover:border-[var(--bbf-text-on-sand)]',
    },
  ],
  defaultVariants: { error: false, disabled: false },
});

export const formFieldMessageVariants = cva(['mt-2', 'text-[length:var(--bbf-text-body-sm)]'], {
  variants: {
    type: {
      error: 'text-[var(--bbf-text-error)]',
      hint: 'text-[var(--bbf-text-on-sand-muted)]',
    },
  },
  defaultVariants: { type: 'error' },
});

export type FormFieldBorderVariants = VariantProps<typeof formFieldBorderVariants>;
