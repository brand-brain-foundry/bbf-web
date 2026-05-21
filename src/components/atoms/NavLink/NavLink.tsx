'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    const baseClasses = cn(
      'group relative inline-flex items-center gap-1',
      'text-sm font-medium',
      'text-[var(--bbf-text-on-sand)]',
      'transition-all duration-200 ease-out',
      'hover:text-[var(--bbf-accent-red)]',
      'focus-visible:outline-none focus-visible:text-[var(--bbf-accent-red)]',
      isActive && 'text-[var(--bbf-accent-red)]',
      className,
    );

    const underline = (
      <span
        aria-hidden="true"
        className={cn(
          'absolute -bottom-1 left-0 h-px',
          'bg-[var(--bbf-accent-red)]',
          'transition-all duration-300 ease-out',
          isActive ? 'w-full' : 'w-0 group-hover:w-full group-focus-visible:w-full',
        )}
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
              'h-3.5 w-3.5 transition-transform duration-200 ease-out',
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
