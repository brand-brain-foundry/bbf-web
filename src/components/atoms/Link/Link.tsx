import * as React from 'react';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';

type LinkVariant = 'default' | 'subtle' | 'underline';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: LinkVariant;
  external?: boolean;
}

const focusVisibleClasses =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:rounded-sm';

const variants: Record<LinkVariant, string> = {
  default: [
    'text-[var(--bbf-text-on-light)] hover:text-[var(--bbf-accent-red)] hover:underline underline-offset-4',
    'active:opacity-70',
    focusVisibleClasses,
  ].join(' '),
  subtle: [
    'text-[var(--bbf-text-on-light-secondary)] hover:text-[var(--bbf-text-on-light)]',
    'active:opacity-70',
    focusVisibleClasses,
  ].join(' '),
  underline: [
    'underline underline-offset-4 text-[var(--bbf-text-on-light)] hover:text-[var(--bbf-accent-red)]',
    'active:opacity-70',
    focusVisibleClasses,
  ].join(' '),
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, external, variant = 'default', ...props }, ref) => {
    const classes = cn('transition-colors duration-150', variants[variant], className);

    if (external || href.startsWith('http')) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-component="bbf-link"
          data-external="true"
          className={classes}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink ref={ref} href={href} data-component="bbf-link" className={classes} {...props}>
        {children}
      </NextLink>
    );
  },
);

Link.displayName = 'Link';
