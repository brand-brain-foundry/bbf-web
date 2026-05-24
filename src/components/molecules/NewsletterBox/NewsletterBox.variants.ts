/**
 * BBF NewsletterBox variants — CVA mínimo (Wave 11.6-C)
 *
 * 0 variants reales en consumers (Footer pasa solo copy + className).
 * CVA mínimo wrapper per D-145 §3.6: base class holder para consistencia canon.
 * Success state DOM = elemento distinto (inline en NewsletterBox.tsx — no variant).
 */

import { cva } from 'class-variance-authority';

export const newsletterBoxVariants = cva(['flex flex-col gap-4']);
