/**
 * BBF Link atom — wrapper sobre Next Link con variants BBF
 *
 * @description
 * Link atom que mantiene navegación Next.js + estilo canon BBF.
 * Links externos (prop external o href http*) renderizan con
 * target="_blank" + rel="noopener noreferrer" automáticamente.
 *
 * @example Default (link interno)
 * ```tsx
 * <Link href="/metodo">Conocer el método</Link>
 * ```
 *
 * @example Subtle variant
 * ```tsx
 * <Link href="/privacidad" variant="subtle">Privacidad</Link>
 * ```
 *
 * @example Underline variant
 * ```tsx
 * <Link href="/blog/articulo" variant="underline">Leer artículo</Link>
 * ```
 *
 * @example Link externo
 * ```tsx
 * <Link href="https://example.com" external>Recurso externo</Link>
 * ```
 *
 * @param variant - 'default' | 'subtle' | 'underline' (default: 'default')
 * @param external - si true, renderiza con target="_blank" + rel noopener
 * @param className - clases adicionales mergeadas con cn()
 */
import * as React from 'react';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';
import { linkVariants, type LinkVariants } from './Link.variants';

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>, LinkVariants {
  href: string;
  external?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, external, variant, ...props }, ref) => {
    const classes = cn(linkVariants({ variant }), className);

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
