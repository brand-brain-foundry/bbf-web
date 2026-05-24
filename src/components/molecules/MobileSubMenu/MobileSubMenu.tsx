'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SubLinkMedia = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
};

type SubLink = {
  label: string;
  href: string;
  description?: string | null;
  mediaType?: 'none' | 'image' | 'video';
  media?: SubLinkMedia | null;
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
 * BBF MobileSubMenu — Wave 8.4 (D-BBF-KB-115)
 *
 * Accordion vertical mobile.
 * Cada sub-link:
 *   - Solo label: row simple con chevron
 *   - Con media: imagen CUADRADA 64x64 izquierda + label/description derecha
 *
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
    <div className="border-b border-[var(--bbf-border-on-sand)]/40">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        tabIndex={tabIndex}
        className={cn(
          'group w-full',
          'flex items-center justify-between',
          'min-h-[44px] px-2 py-4',
          'text-lg font-medium text-[var(--bbf-text-on-sand)]',
          'transition-all duration-200 ease-out',
          '[@media(hover:hover)]:hover:text-[var(--bbf-accent-red)]',
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
          isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="flex flex-col gap-1 pb-3 pl-2">
          <Link
            href={`${localePrefix}${href}`}
            onClick={onLinkClick}
            tabIndex={isOpen ? 0 : -1}
            className={cn(
              'block min-h-[44px] px-2 py-3',
              'text-sm font-medium text-[var(--bbf-text-on-sand-muted)]',
              'border-b border-[var(--bbf-border-on-sand)]/30',
              'transition-colors duration-150 ease-out',
              '[@media(hover:hover)]:hover:text-[var(--bbf-accent-red)]',
              'focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
            )}
          >
            ↗ {label} (general)
          </Link>

          {subLinks.map((sub, idx) => {
            const hasMedia =
              (sub.mediaType === 'image' || sub.mediaType === 'video') && sub.media?.url;

            return (
              <Link
                key={`${sub.href}-${idx}`}
                href={`${localePrefix}${sub.href}`}
                onClick={onLinkClick}
                tabIndex={isOpen ? 0 : -1}
                className={cn(
                  'group flex items-center gap-3',
                  'min-h-[44px] px-2 py-3',
                  'rounded-xl',
                  'transition-all duration-150 ease-out',
                  '[@media(hover:hover)]:hover:bg-[var(--bbf-surface-hover-subtle-on-sand)]',
                  'focus-visible:bg-[var(--bbf-surface-hover-subtle-on-sand)] focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-1 focus-visible:outline-none',
                )}
              >
                {hasMedia && sub.mediaType === 'image' && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--bbf-surface-hover-on-sand)]">
                    <Image
                      src={sub.media!.url!}
                      alt={sub.media!.alt ?? sub.label}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-105"
                    />
                  </div>
                )}
                {hasMedia && sub.mediaType === 'video' && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--bbf-surface-hover-on-sand)]">
                    <video
                      src={sub.media!.url!}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                  <span
                    className={cn(
                      'text-base font-medium',
                      'text-[var(--bbf-text-on-sand)]',
                      'transition-colors duration-150 ease-out',
                      'group-focus-visible:text-[var(--bbf-accent-red)] [@media(hover:hover)]:group-hover:text-[var(--bbf-accent-red)]',
                      sub.description ? 'mb-0.5' : '',
                    )}
                  >
                    {sub.label}
                  </span>
                  {sub.description && (
                    <span className="text-xs leading-[var(--bbf-leading-snug)] text-[var(--bbf-text-on-sand-muted)]">
                      {sub.description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
