/**
 * BBF ContactForm variants — CVA canon (Wave 11.6-C)
 *
 * 2 exports:
 *   contactFormVariants — container wrapper (base only, className override)
 *   contactFormFeedbackVariants — feedback div state (success: true/false — variant real)
 *
 * Consumer (contacto/page.tsx) pasa solo locale — sin variant props de container.
 * Feedback div usa state.success boolean → variante visual real (D-145 §3.6 aplica).
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const contactFormVariants = cva(['w-full']);

export const contactFormFeedbackVariants = cva(['rounded-2xl p-6', 'transition-all duration-300'], {
  variants: {
    success: {
      true: 'bg-[var(--bbf-color-success-bg)] text-[var(--bbf-color-success-text)]',
      false: 'bg-[var(--bbf-color-error-bg)] text-[var(--bbf-color-error-text)]',
    },
  },
  defaultVariants: { success: false },
});

export type ContactFormFeedbackVariants = VariantProps<typeof contactFormFeedbackVariants>;
