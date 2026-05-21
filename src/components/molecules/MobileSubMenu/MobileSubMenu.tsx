'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SubLink = {
  label: string;
  href: string;
};

type MobileSubMenuProps = {
  label: string;
  href: string;
  subLinks: SubLink[];
  localePrefix: string;
  onLinkClick: () => void;
  tabIndex?: number;
};

/**
 * BBF MobileSubMenu — accordion mobile canon Wave 8 (D-BBF-KB-113)
 *
 * Tap parent → expande sub-links inline (acordeón).
 * Chevron rotate + smooth height transition.
 * Touch targets ≥ 44px (WCAG AA).
 */
export function MobileSubMenu({
  label,
  href,
  subLinks,
  localePrefix,
  onLinkClick,
  tabIndex = 0,
}: MobileSubMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      data-component="bbf-mobile-sub-menu"
      className="border-b border-[var(--bbf-border-on-sand)]/40"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        tabIndex={tabIndex}
        className={cn(
          'group flex min-h-[44px] w-full items-center justify-between',
          'px-2 py-4',
          'text-lg font-medium text-[var(--bbf-text-on-sand)]',
          'transition-all duration-200 ease-out',
          'hover:text-[var(--bbf-accent-red)]',
          'focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
        )}
      >
        <span>{label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-4 w-4 transition-transform duration-200 ease-out',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="flex flex-col pb-3 pl-6">
          <Link
            href={`${localePrefix}${href}`}
            onClick={onLinkClick}
            tabIndex={isOpen ? 0 : -1}
            className={cn(
              'block min-h-[44px] px-2 py-3',
              'text-sm font-medium text-[var(--bbf-text-on-sand-muted)]',
              'transition-colors duration-150 ease-out',
              'hover:text-[var(--bbf-accent-red)]',
              'focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
            )}
          >
            ↗ {label} (general)
          </Link>

          {subLinks.map((sub, idx) => (
            <Link
              key={`${sub.href}-${idx}`}
              href={`${localePrefix}${sub.href}`}
              onClick={onLinkClick}
              tabIndex={isOpen ? 0 : -1}
              className={cn(
                'block min-h-[44px] px-2 py-3',
                'text-base font-medium text-[var(--bbf-text-on-sand)]',
                'transition-all duration-150 ease-out',
                'hover:translate-x-1 hover:text-[var(--bbf-accent-red)]',
                'focus-visible:translate-x-1 focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
              )}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
