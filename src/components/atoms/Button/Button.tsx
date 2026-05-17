/**
 * BBF Design System — Button atom
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisiones: D-BBF-WEB-80 (Slot asChild), D-BBF-WEB-82 (AI-readable)
 */

'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { buttonVariants, type ButtonVariants } from './Button.variants';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  /**
   * Render as different element via Radix Slot pattern.
   * Cuando true, hereda props y comportamiento al children.
   */
  asChild?: boolean;
}

/**
 * BBF Button atom — Atomic Design canon
 *
 * @description
 * Button atom canon BBF. Receives semantic tokens via CVA variants.
 * Surface-aware via prop o data-surface ancestor.
 * Polymorphic via Slot (asChild pattern Radix).
 *
 * @example Basic usage
 * ```tsx
 * <Button intent="primary" size="md">Submit</Button>
 * ```
 *
 * @example asChild (polymorphism)
 * ```tsx
 * <Button asChild intent="ghost">
 *   <a href="/contact">Contact us</a>
 * </Button>
 * ```
 *
 * @example Surface-aware
 * ```tsx
 * <section data-surface="dark">
 *   <Button intent="ghost">Auto-adapts to dark</Button>
 * </section>
 * ```
 *
 * @example Loading state
 * ```tsx
 * <Button loading={isSubmitting}>
 *   {isSubmitting ? 'Submitting...' : 'Submit'}
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, surface, loading, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        data-component="bbf-button"
        data-loading={loading || undefined}
        className={cn(buttonVariants({ intent, size, surface, loading }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
