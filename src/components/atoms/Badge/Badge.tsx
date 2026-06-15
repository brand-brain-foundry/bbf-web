import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { badgeVariants, type BadgeVariants } from './Badge.variants';

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  BadgeVariants & {
    children: React.ReactNode;
  };

/**
 * BBF Badge atom — canon Vercel-style flag (D-BBF-KB-118)
 *
 * Variants:
 *   - default: neutral border + muted text
 *   - accent:  red border + red text (canon brand)
 *   - success: green border + green text
 *   - beta:    blue border + blue text
 *
 * Sizes:
 *   - xs: micro (10px) px-1 py-[2px]
 *   - sm: text-xs (12px) px-1.5 py-0.5
 *   - md: text-sm (14px) px-2 py-1
 *
 * Border 1px, radius-pill, uppercase tracking-wider.
 * Decorativo — sin hover state (label/flag indicator).
 */
export function Badge({ intent, size, className, children, ...rest }: BadgeProps) {
  return (
    <span
      data-component="bbf-badge"
      data-intent={intent ?? 'default'}
      className={cn(badgeVariants({ intent, size }), className)}
      {...rest}
    >
      {children}
    </span>
  );
}
