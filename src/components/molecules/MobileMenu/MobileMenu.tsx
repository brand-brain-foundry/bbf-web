'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MenuIcon } from '@/components/atoms/MenuIcon';
import { Button } from '@/components/atoms/Button';
import { MobileSubMenu } from '@/components/molecules/MobileSubMenu';
import {
  mobileMenuIconButtonVariants,
  mobileMenuBackdropVariants,
  mobileMenuPanelVariants,
  mobileMenuItemVariants,
} from './MobileMenu.variants';

type MobileMenuLink = {
  label: string;
  href: string;
  hasSubMenu?: boolean;
  subLinks?: Array<{
    label: string;
    href: string;
    description?: string | null;
    mediaType?: 'none' | 'image' | 'video';
    media?: {
      url?: string;
      alt?: string;
      width?: number;
      height?: number;
      mimeType?: string;
    } | null;
  }>;
};

type MobileMenuCta = {
  label: string;
  href: string;
  fill?: 'solid' | 'outline';
  intent?: 'primary' | 'secondary' | 'black' | 'red';
};

type MobileMenuProps = {
  links: MobileMenuLink[];
  cta?: MobileMenuCta;
  siteName?: string;
};

/**
 * BBF MobileMenu — drawer right-side canon (D-BBF-KB-107)
 * Fix 6.1: isMounted SSR-safe, backdrop+panel hermanos, h-[100dvh], z-index split
 */
export function MobileMenu({ links, cta, siteName = 'BBF' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Scroll lock canon mobile: position fixed preserva scroll position
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      const first = panelRef.current.querySelector<HTMLElement>('a, button');
      first?.focus();
    }
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      {/* Trigger button — visible solo < lg */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="bbf-mobile-menu-panel"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        data-component="bbf-mobile-menu-trigger"
        className={mobileMenuIconButtonVariants({ size: 'trigger' })}
      >
        <MenuIcon open={isOpen} />
      </button>

      {/* Drawer — siempre montado, visibility via CSS (canon Radix Dialog 2026) */}
      <>
        {/* Backdrop: hermano del panel, z-90 */}
        <div
          onClick={close}
          aria-hidden="true"
          className={mobileMenuBackdropVariants({ open: isOpen })}
        />

        {/* Panel right-side: z-100, h-[100dvh] para mobile correcto */}
        <div
          ref={panelRef}
          id="bbf-mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menú móvil"
          aria-hidden={!isOpen}
          data-component="bbf-mobile-menu-panel"
          className={mobileMenuPanelVariants({ open: isOpen })}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-[var(--bbf-border-on-sand)] px-6 py-5">
            <span className="text-[length:var(--bbf-text-body-sm)] [font-weight:var(--bbf-weight-bold)] text-[var(--bbf-text-on-sand)]">
              {siteName}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              tabIndex={isOpen ? 0 : -1}
              className={mobileMenuIconButtonVariants({ size: 'close' })}
            >
              <MenuIcon open={true} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col px-6 py-6" aria-label="Mobile navigation">
            {links.map((link, idx) => {
              if (link.hasSubMenu && link.subLinks && link.subLinks.length > 0) {
                return (
                  <MobileSubMenu
                    key={`${link.href}-${idx}`}
                    label={link.label}
                    href={link.href}
                    subLinks={link.subLinks}
                    onLinkClick={close}
                    tabIndex={isOpen ? 0 : -1}
                  />
                );
              }

              return (
                <Link
                  key={`${link.href}-${idx}`}
                  href={link.href}
                  onClick={close}
                  tabIndex={isOpen ? 0 : -1}
                  className={mobileMenuItemVariants()}
                >
                  <span className="inline-flex items-center gap-3">
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className="-translate-x-2 opacity-0 transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)] [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100"
                    >
                      →
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* CTA al pie */}
          {cta && (
            <div className="px-6 pt-2 pb-8">
              <Button
                asChild
                fill={cta.fill ?? 'solid'}
                intent={cta.intent ?? 'primary'}
                size="lg"
                className="w-full"
              >
                <Link href={cta.href} onClick={close} tabIndex={isOpen ? 0 : -1}>
                  {cta.label}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </>
    </>
  );
}
