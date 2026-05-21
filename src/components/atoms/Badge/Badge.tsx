import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type BadgeIntent = 'default' | 'accent' | 'success' | 'beta';
type BadgeSize = 'sm' | 'md';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  intent?: BadgeIntent;
  size?: BadgeSize;
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
 *   - sm: text-xs (12px) px-1.5 py-0.5
 *   - md: text-sm (14px) px-2 py-1
 *
 * Border 1px, rounded-md (8px), uppercase tracking-wider.
 * Decorativo — sin hover state (label/flag indicator).
 */
export function Badge({
  intent = 'default',
  size = 'sm',
  className,
  children,
  ...rest
}: BadgeProps) {
  const intentClasses: Record<BadgeIntent, string> = {
    default: 'border-[var(--bbf-border-on-sand)] text-[var(--bbf-text-on-sand-muted)]',
    accent: 'border-[var(--bbf-color-red-500)] text-[var(--bbf-color-red-600)]',
    success: 'border-[oklch(70%_0.12_145)] text-[oklch(40%_0.12_145)]',
    beta: 'border-[var(--bbf-color-blue-500)] text-[var(--bbf-color-blue-600)]',
  };

  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'text-[length:var(--bbf-text-xs)] px-1.5 py-0.5',
    md: 'text-[length:var(--bbf-text-sm)] px-2 py-1',
  };

  return (
    <span
      data-component="bbf-badge"
      data-intent={intent}
      className={cn(
        'inline-flex items-center justify-center',
        'border border-solid',
        'rounded-md',
        'font-[var(--bbf-weight-medium)]',
        'tracking-wider uppercase',
        'leading-none',
        'whitespace-nowrap',
        intentClasses[intent],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
