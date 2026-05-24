/**
 * BBF Design System — Heading atom
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-80 (asChild), D-BBF-WEB-82 (AI-readable)
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { headingVariants, type HeadingVariants } from './Heading.variants';

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>, HeadingVariants {
  /**
   * Semantic HTML element a renderear (h1-h6).
   * Si NO se especifica, infiere desde level (display-xl→h1, h1→h1, etc).
   */
  as?: HeadingElement;
  /**
   * Render as different element via Slot.
   */
  asChild?: boolean;
}

/**
 * Map level variant → HTML element.
 */
function inferElement(level: HeadingVariants['level']): HeadingElement {
  if (level === 'display-1' || level === 'display-2') return 'h1';
  return (level ?? 'h1') as HeadingElement;
}

/**
 * BBF Heading atom — Atomic Design canon
 *
 * @description
 * Heading semantic + visual styling decoupled. Use 'as' prop para HTML
 * semantic correcto (h1-h6), use 'level' para visual styling.
 *
 * @example Basic h1
 * ```tsx
 * <Heading level="display-1" weight="bold">
 *   we build brand brains.
 * </Heading>
 * ```
 *
 * @example H2 con display visual
 * ```tsx
 * <Heading as="h2" level="display-2">
 *   Section title (h2 semantically, display visually)
 * </Heading>
 * ```
 *
 * @example asChild polymorphism
 * ```tsx
 * <Heading asChild level="h1">
 *   <Link href="/about">About us (renders as a)</Link>
 * </Heading>
 * ```
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, weight, color, align, as, asChild = false, children, ...props }, ref) => {
    const Element = asChild ? Slot : (as ?? inferElement(level));

    return (
      <Element
        ref={ref}
        data-component="bbf-heading"
        data-level={level}
        className={cn(headingVariants({ level, weight, color, align }), className)}
        {...props}
      >
        {children}
      </Element>
    );
  },
);

Heading.displayName = 'Heading';
