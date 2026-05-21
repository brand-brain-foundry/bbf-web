'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  mediaType: 'none' | 'image' | 'video';
  media?: SubLinkMedia | null;
};

type MegaMenuPanelProps = {
  id: string;
  isOpen: boolean;
  subLinks: SubLink[];
  localePrefix: string;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/**
 * BBF MegaMenuPanel — desktop mega-menu canon Wave 8 (D-BBF-KB-113)
 *
 * Grid responsive auto-fit según contenido (1/2/3 cols).
 * Cards con preview media image/video o solo label+description.
 * Animación fade+slide canon. A11y: role=menu, aria-hidden, ESC via parent.
 */
export function MegaMenuPanel({
  id,
  isOpen,
  subLinks,
  localePrefix,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuPanelProps) {
  const hasAnyMedia = subLinks.some((s) => s.mediaType !== 'none' && s.media);

  return (
    <div
      id={id}
      role="menu"
      aria-hidden={!isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-component="bbf-mega-menu-panel"
      className={cn(
        'absolute top-full right-0 left-0 mt-2',
        'z-[var(--bbf-z-mega-menu)]',
        'rounded-2xl',
        'bg-[var(--bbf-surface-sand)]',
        'border border-[var(--bbf-border-on-sand)]',
        '[box-shadow:var(--bbf-shadow-floating)]',
        'overflow-hidden',
        'transition-all duration-200 ease-out',
        isOpen
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0',
      )}
    >
      <div
        className={cn(
          'p-4 lg:p-6',
          'grid gap-3 lg:gap-4',
          hasAnyMedia ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2',
        )}
      >
        {subLinks.map((sub, idx) => (
          <Link
            key={`${sub.href}-${idx}`}
            href={`${localePrefix}${sub.href}`}
            onClick={onClose}
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
            className={cn(
              'group block p-4',
              'rounded-xl',
              'transition-all duration-200 ease-out',
              'hover:bg-[var(--bbf-color-black-50)]',
              'focus-visible:bg-[var(--bbf-color-black-50)] focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-1',
            )}
          >
            {sub.mediaType === 'image' && sub.media?.url && (
              <div className="mb-3 overflow-hidden rounded-lg bg-[var(--bbf-color-black-100)]">
                <Image
                  src={sub.media.url}
                  alt={sub.media.alt ?? sub.label}
                  width={sub.media.width ?? 320}
                  height={sub.media.height ?? 180}
                  className="aspect-[16/9] h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>
            )}

            {sub.mediaType === 'video' && sub.media?.url && (
              <div className="mb-3 overflow-hidden rounded-lg bg-[var(--bbf-color-black-100)]">
                <video
                  src={sub.media.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="aspect-[16/9] h-auto w-full object-cover"
                />
              </div>
            )}

            <p
              className={cn(
                'mb-1 text-sm font-semibold',
                'text-[var(--bbf-text-on-sand)]',
                'transition-colors duration-200 ease-out',
                'group-hover:text-[var(--bbf-accent-red)] group-focus-visible:text-[var(--bbf-accent-red)]',
              )}
            >
              {sub.label}
            </p>

            {sub.description && (
              <p className="text-xs leading-snug text-[var(--bbf-text-on-sand-muted)]">
                {sub.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
