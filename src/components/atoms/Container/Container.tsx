/**
 * BBF Container atom — wrapper de contenido con sizes canon
 *
 * @description
 * Container atom que controla max-width + padding horizontal canon.
 * Sizes: prose (65ch), narrow (40rem/640px), default (64rem/1024px),
 * wide (80rem/1280px), max (90rem/1440px), full (100%).
 * Consume utility classes bbf-container-* que referencian semantic tokens.
 *
 * @example Default (64rem)
 * ```tsx
 * <Container>
 *   <p>Contenido con max-width 1024px</p>
 * </Container>
 * ```
 *
 * @example Prose size (artículos largos)
 * ```tsx
 * <Container size="prose">
 *   <article>Texto optimizado para lectura</article>
 * </Container>
 * ```
 *
 * @example Custom element via `as`
 * ```tsx
 * <Container as="section" size="wide">
 *   <p>Renderiza como section en el DOM</p>
 * </Container>
 * ```
 *
 * @param size - 'prose' | 'narrow' | 'default' | 'wide' | 'max' | 'full' (default: 'default')
 * @param as - elemento HTML a renderizar (default: 'div')
 * @param className - clases adicionales mergeadas con cn()
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

type ContainerSize = 'prose' | 'narrow' | 'default' | 'wide' | 'max' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  size?: ContainerSize;
  as?: React.ElementType;
}

const containerClass: Record<ContainerSize, string> = {
  prose: 'bbf-container-prose',
  narrow: 'bbf-container-narrow',
  default: 'bbf-container-default',
  wide: 'bbf-container-wide',
  max: 'bbf-container-max',
  full: 'bbf-container-full',
};

export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, size = 'default', as: Tag = 'div', children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        data-component="bbf-container"
        data-size={size}
        className={cn('bbf-container-px mx-auto', containerClass[size], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

Container.displayName = 'Container';
