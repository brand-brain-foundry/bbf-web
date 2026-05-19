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
