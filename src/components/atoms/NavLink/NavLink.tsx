'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinkBaseVariants, navLinkUnderlineVariants } from './NavLink.variants';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  hasSubMenu?: boolean;
  isOpen?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
};

/**
 * BBF NavLink atom — Wave 8 (D-BBF-KB-112)
 *
 * hasSubMenu=false → <Link> next con active state via usePathname
 * hasSubMenu=true  → <button> trigger mega-menu con chevron animado
 */
export const NavLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, NavLinkProps>(
  function NavLink(
    {
      href,
      children,
      hasSubMenu = false,
      isOpen = false,
      onClick,
      onMouseEnter,
      onMouseLeave,
      className,
      ariaControls,
      ariaExpanded,
    },
    ref,
  ) {
    const pathname = usePathname();
    const isActive =
      pathname === href || pathname === `/en${href}` || (href !== '/' && pathname.startsWith(href));

    const baseClasses = cn(navLinkBaseVariants({ active: isActive }), className);

    const underline = (
      <span
        aria-hidden="true"
        style={{ bottom: 'calc(-1 * var(--bbf-nav-underline-offset))' }}
        className={navLinkUnderlineVariants({ active: isActive })}
      />
    );

    if (hasSubMenu) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          aria-haspopup="true"
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          data-component="bbf-nav-link"
          className={baseClasses}
        >
          <span>{children}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'h-3.5 w-3.5 transition-transform [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
              isOpen && 'rotate-180',
            )}
          />
          {underline}
        </button>
      );
    }

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-component="bbf-nav-link"
        className={baseClasses}
      >
        {children}
        {underline}
      </Link>
    );
  },
);
