'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink } from '@/components/atoms/NavLink';
import { MegaMenuPanel } from '@/components/molecules/MegaMenuPanel';
import { cn } from '@/lib/utils';

type SubLink = {
  label: string;
  href: string;
  description?: string | null;
  icon?: string | null;
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
  className?: string;
};

/**
 * BBF HeaderDesktopNav — Wave 8.1 hotfix (B-2 fix)
 *
 * Panel hoisted: MegaMenuPanel se renderiza UNA SOLA VEZ al final del nav,
 * posicionado absolute relativo al nav (que ocupa flex-1 del header card).
 * Esto hace que el panel tenga el ancho del nav, no del item parent.
 *
 * onMouseLeave en el nav completo (no por item) evita cierre accidental.
 */
export function HeaderDesktopNav({ links, className }: HeaderDesktopNavProps) {
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

  const activeLink = openIndex !== null ? links[openIndex] : null;
  const hasActiveSubMenu = Boolean(
    activeLink?.hasSubMenu && activeLink?.subLinks && activeLink.subLinks.length > 0,
  );

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      data-component="bbf-header-desktop-nav"
      className={cn('relative items-center gap-6', className)}
      onMouseLeave={scheduleClose}
    >
      {links.map((link, idx) => {
        const hasSub = Boolean(link.hasSubMenu && link.subLinks && link.subLinks.length > 0);
        const isOpen = openIndex === idx;
        const panelId = `bbf-mega-menu-${idx}`;

        return (
          <div
            key={`${link.href}-${idx}`}
            onMouseEnter={() => {
              cancelClose();
              setOpenIndex(hasSub ? idx : null);
            }}
          >
            <NavLink
              href={link.href}
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
          </div>
        );
      })}

      {/* Mega-menu panel — siempre montada, morphing Stripe (Wave 11.8-C2) */}
      <MegaMenuPanel
        id={`bbf-mega-menu-${openIndex ?? -1}`}
        isOpen={hasActiveSubMenu}
        activeKey={String(openIndex ?? -1)}
        subLinks={activeLink?.subLinks ?? []}
        onClose={closeAll}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      />
    </nav>
  );
}
