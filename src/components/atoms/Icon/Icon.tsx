/**
 * BBF Design System — Icon atom (Lucide wrapper)
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 * Decisión: D-BBF-WEB-82 (AI-readable)
 */

import * as React from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';
import { iconVariants, type IconVariants } from './Icon.variants';

export interface IconProps extends Omit<LucideProps, 'size' | 'color'>, IconVariants {
  /**
   * Lucide icon component to render.
   *
   * @example
   * import { ArrowRight } from 'lucide-react';
   * <Icon icon={ArrowRight} />
   */
  icon: LucideIcon;
}

/**
 * BBF Icon atom — Lucide React wrapper canon
 *
 * @description
 * Wrapper canon BBF para íconos Lucide. Type-safe icon name.
 * Surface-aware via color variant.
 *
 * @example Basic
 * ```tsx
 * import { ArrowRight } from 'lucide-react';
 * <Icon icon={ArrowRight} size="md" />
 * ```
 *
 * @example Con color semantic
 * ```tsx
 * import { Mail } from 'lucide-react';
 * <Icon icon={Mail} color="accent" size="lg" />
 * ```
 *
 * @example Con surface dark
 * ```tsx
 * <section data-surface="dark">
 *   <Icon icon={Search} color="inverse" />
 * </section>
 * ```
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size, color, className, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        data-component="bbf-icon"
        className={cn(iconVariants({ size, color }), className)}
        {...props}
      />
    );
  },
);

Icon.displayName = 'Icon';
