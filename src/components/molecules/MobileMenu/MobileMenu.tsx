'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MenuIcon } from '@/components/atoms/MenuIcon';
import { Button } from '@/components/atoms/Button';
import { MobileSubMenu } from '@/components/molecules/MobileSubMenu';
import { cn } from '@/lib/utils';

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
  intent?: 'primary' | 'secondary' | 'outline';
};

type MobileMenuProps = {
  links: MobileMenuLink[];
  cta?: MobileMenuCta;
  localePrefix: string;
  siteName?: string;
};

/**
 * BBF MobileMenu — drawer right-side canon (D-BBF-KB-107)
 * Fix 6.1: isMounted SSR-safe, backdrop+panel hermanos, h-[100dvh], z-index split
 */
export function MobileMenu({ links, cta, localePrefix, siteName = 'BBF' }: MobileMenuProps) {
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
        className={cn(
          'inline-flex items-center justify-center lg:hidden',
          'h-11 w-11 rounded-full',
          'text-[var(--bbf-text-on-sand)]',
          'transition-all duration-200 ease-out',
          'hover:bg-[var(--bbf-surface-hover-on-sand)]',
          'active:scale-95',
          'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
        )}
      >
        <MenuIcon open={isOpen} />
      </button>

      {/* Drawer — siempre montado, visibility via CSS (canon Radix Dialog 2026) */}
      <>
        {/* Backdrop: hermano del panel, z-90 */}
        <div
          onClick={close}
          aria-hidden="true"
          className={cn(
            'fixed inset-0 z-[var(--bbf-z-drawer)] lg:hidden',
            'bg-black/40 backdrop-blur-sm',
            'transition-opacity duration-[280ms] ease-out',
            isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
        />

        {/* Panel right-side: z-100, h-[100dvh] para mobile correcto */}
        <div
          ref={panelRef}
          id="bbf-mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menú móvil"
          aria-hidden={!isOpen}
          className={cn(
            'fixed top-0 right-0 z-[var(--bbf-z-drawer-panel)] lg:hidden',
            'h-[100dvh] w-[85vw] max-w-[380px]',
            'bg-[var(--bbf-surface-sand)]',
            'flex flex-col',
            'overflow-y-auto overscroll-contain',
            'transition-transform duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
            isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-[105%] shadow-none',
          )}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-[var(--bbf-border-on-sand)] px-6 py-5">
            <span className="text-sm font-bold text-[var(--bbf-text-on-sand)]">{siteName}</span>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              tabIndex={isOpen ? 0 : -1}
              className={cn(
                'inline-flex items-center justify-center',
                'h-9 w-9 rounded-full',
                'text-[var(--bbf-text-on-sand)]',
                'transition-all duration-200 ease-out',
                'hover:bg-[var(--bbf-surface-hover-on-sand)]',
                'active:scale-95',
                'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
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
                    localePrefix={localePrefix}
                    onLinkClick={close}
                    tabIndex={isOpen ? 0 : -1}
                  />
                );
              }

              return (
                <Link
                  key={`${link.href}-${idx}`}
                  href={`${localePrefix}${link.href}`}
                  onClick={close}
                  tabIndex={isOpen ? 0 : -1}
                  className={cn(
                    'group block min-h-[44px] border-b border-[var(--bbf-border-on-sand)]/40 px-2 py-4',
                    'text-lg font-medium text-[var(--bbf-text-on-sand)]',
                    'transition-all duration-150 ease-out',
                    'hover:translate-x-1 hover:text-[var(--bbf-accent-red)]',
                    'focus-visible:translate-x-1 focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
                  )}
                >
                  <span className="inline-flex items-center gap-3">
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className="-translate-x-2 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100"
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
              <Button asChild intent={cta.intent ?? 'primary'} size="lg" className="w-full">
                <Link
                  href={`${localePrefix}${cta.href}`}
                  onClick={close}
                  tabIndex={isOpen ? 0 : -1}
                >
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
