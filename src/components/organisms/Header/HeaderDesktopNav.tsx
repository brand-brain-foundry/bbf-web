'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink } from '@/components/atoms/NavLink';
import { MegaMenuPanel } from '@/components/molecules/MegaMenuPanel';
import { cn } from '@/lib/utils';

type SubLink = {
  label: string;
  href: string;
  description?: string | null;
  mediaType: 'none' | 'image' | 'video';
  media?: {
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
    mimeType?: string;
  } | null;
};

type HeaderLink = {
  label: string;
  href: string;
  hasSubMenu?: boolean;
  subLinks?: SubLink[];
};

type HeaderDesktopNavProps = {
  links: HeaderLink[];
  localePrefix: string;
  className?: string;
};

/**
 * BBF HeaderDesktopNav — client component nav desktop con mega-menu.
 *
 * Hover sobre link con hasSubMenu abre MegaMenuPanel.
 * Solo un panel abierto a la vez. ESC + click-outside cierran.
 * 150ms delay-close evita cierre accidental al mover cursor al panel.
 */
export function HeaderDesktopNav({ links, localePrefix, className }: HeaderDesktopNavProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => setOpenIndex(null), 150);
  }, [cancelClose]);

  const closeAll = useCallback(() => {
    cancelClose();
    setOpenIndex(null);
  }, [cancelClose]);

  useEffect(() => {
    if (openIndex === null) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [openIndex, closeAll]);

  useEffect(() => {
    if (openIndex === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openIndex, closeAll]);

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      data-component="bbf-header-desktop-nav"
      className={cn('relative items-center gap-6', className)}
    >
      {links.map((link, idx) => {
        const hasSub = Boolean(link.hasSubMenu && link.subLinks && link.subLinks.length > 0);
        const isOpen = openIndex === idx;
        const panelId = `bbf-mega-menu-${idx}`;

        return (
          <div
            key={`${link.href}-${idx}`}
            className="relative"
            onMouseEnter={() => {
              if (hasSub) {
                cancelClose();
                setOpenIndex(idx);
              }
            }}
            onMouseLeave={() => {
              if (hasSub) scheduleClose();
            }}
          >
            <NavLink
              href={`${localePrefix}${link.href}`}
              hasSubMenu={hasSub}
              isOpen={isOpen}
              ariaControls={hasSub ? panelId : undefined}
              ariaExpanded={hasSub ? isOpen : undefined}
              onClick={(e) => {
                if (hasSub) {
                  e.preventDefault();
                  setOpenIndex(isOpen ? null : idx);
                }
              }}
            >
              {link.label}
            </NavLink>

            {hasSub && (
              <MegaMenuPanel
                id={panelId}
                isOpen={isOpen}
                subLinks={link.subLinks!}
                localePrefix={localePrefix}
                onClose={closeAll}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
