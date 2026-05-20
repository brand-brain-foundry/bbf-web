/**
 * BBF Container atom — wrapper de contenido con sizes canon
 *
 * @description
 * Container atom que controla max-width + padding horizontal canon.
 * Sizes: sm (640px), md (768px), lg (1024px), xl (1280px, default),
 * 2xl (1440px), prose (70ch para artículos largos).
 *
 * @example Default (xl)
 * ```tsx
 * <Container>
 *   <p>Contenido con max-width 1280px</p>
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
 * <Container as="section" size="lg">
 *   <p>Renderiza como section en el DOM</p>
 * </Container>
 * ```
 *
 * @param size - 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'prose' (default: 'xl')
 * @param as - elemento HTML a renderizar (default: 'div')
 * @param className - clases adicionales mergeadas con cn()
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'prose';

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  size?: ContainerSize;
  as?: React.ElementType;
}

const sizeMap: Record<ContainerSize, string> = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1280px]',
  '2xl': 'max-w-[1440px]',
  prose: 'max-w-[70ch]',
};

export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, size = 'xl', as: Tag = 'div', children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        data-component="bbf-container"
        data-size={size}
        className={cn('mx-auto px-4 md:px-8', sizeMap[size], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

Container.displayName = 'Container';
