'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  mobileSubMenuToggleVariants,
  mobileSubMenuPanelVariants,
  mobileSubMenuGeneralItemVariants,
  mobileSubMenuCardVariants,
  mobileSubMenuTitleVariants,
} from './MobileSubMenu.variants';

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
        className={mobileSubMenuToggleVariants()}
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

      <div className={mobileSubMenuPanelVariants({ open: isOpen })}>
        <div className="flex flex-col gap-1 pb-3 pl-2">
          <Link
            href={href}
            onClick={onLinkClick}
            tabIndex={isOpen ? 0 : -1}
            className={mobileSubMenuGeneralItemVariants()}
          >
            ↗ {label} (general)
          </Link>

          {subLinks.map((sub, idx) => {
            const hasMedia =
              (sub.mediaType === 'image' || sub.mediaType === 'video') && sub.media?.url;

            return (
              <Link
                key={`${sub.href}-${idx}`}
                href={sub.href}
                onClick={onLinkClick}
                tabIndex={isOpen ? 0 : -1}
                className={mobileSubMenuCardVariants()}
              >
                {hasMedia && sub.mediaType === 'image' && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden [border-radius:var(--bbf-radius-media)] bg-[var(--bbf-surface-hover-on-sand)]">
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
                  <div className="h-16 w-16 shrink-0 overflow-hidden [border-radius:var(--bbf-radius-media)] bg-[var(--bbf-surface-hover-on-sand)]">
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
                    className={mobileSubMenuTitleVariants({
                      hasDescription: Boolean(sub.description),
                    })}
                  >
                    {sub.label}
                  </span>
                  {sub.description && (
                    <span className="text-[length:var(--bbf-text-xs)] leading-[var(--bbf-leading-snug)] text-[var(--bbf-text-on-sand-muted)]">
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
