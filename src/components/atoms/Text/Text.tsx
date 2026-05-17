/**
 * BBF Design System — Text atom
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { textVariants, type TextVariants } from './Text.variants';

type TextElement = 'p' | 'span' | 'div';

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>, TextVariants {
  /**
   * Semantic HTML element. Default: 'p' for body, 'span' for caption/overline.
   */
  as?: TextElement;
  /**
   * Render as different element via Slot.
   */
  asChild?: boolean;
}

function inferElement(variant: TextVariants['variant']): TextElement {
  if (variant === 'caption' || variant === 'overline') return 'span';
  return 'p';
}

/**
 * BBF Text atom — Atomic Design canon
 *
 * @description
 * Text body/caption/overline canon BBF.
 * Auto-inferir element (p for body, span for caption/overline).
 *
 * @example Body
 * ```tsx
 * <Text variant="body-md">Lorem ipsum dolor sit amet.</Text>
 * ```
 *
 * @example Overline (eyebrow)
 * ```tsx
 * <Text variant="overline">PRÓXIMAMENTE</Text>
 * ```
 *
 * @example Caption
 * ```tsx
 * <Text variant="caption" color="muted">Disclaimer text</Text>
 * ```
 */
export function Text({
  className,
  variant,
  color,
  align,
  weight,
  as,
  asChild = false,
  children,
  ...props
}: TextProps) {
  const sharedProps = {
    'data-component': 'bbf-text' as const,
    'data-variant': variant,
    className: cn(textVariants({ variant, color, align, weight }), className),
    ...props,
  };

  if (asChild) {
    return <Slot {...sharedProps}>{children}</Slot>;
  }

  const tag = as ?? inferElement(variant);
  return React.createElement(tag, sharedProps, children);
}

Text.displayName = 'Text';
