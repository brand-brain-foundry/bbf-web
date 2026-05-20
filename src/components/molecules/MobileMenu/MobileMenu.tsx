'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MenuIcon } from '@/components/atoms/MenuIcon';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

type MobileMenuLink = {
  label: string;
  href: string;
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
 *
 * Hamburger 3-líneas → X transform → drawer slide-in desde derecha
 * A11y: focus trap básico, ESC close, click-outside close, aria-modal
 * UX: scroll lock body, focus return al trigger, tabIndex dinámico
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

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
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
      {/* Trigger — visible solo mobile */}
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
          'hover:bg-[var(--bbf-color-black-100)]',
          'active:scale-95',
          'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
        )}
      >
        <MenuIcon open={isOpen} />
      </button>

      {/* Overlay + panel — siempre en DOM para animar entrada/salida */}
      <div
        className={cn(
          'fixed inset-0 z-[100] lg:hidden',
          'transition-opacity duration-[280ms] ease-out',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menú móvil"
        aria-hidden={!isOpen}
      >
        {/* Backdrop — click cierra */}
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={close}
          tabIndex={isOpen ? 0 : -1}
          className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
        />

        {/* Panel right-side */}
        <div
          ref={panelRef}
          id="bbf-mobile-menu-panel"
          className={cn(
            'absolute top-0 right-0 h-full w-[85vw] max-w-[380px]',
            'bg-[var(--bbf-surface-sand)]',
            'border-l border-[var(--bbf-border-on-sand)]',
            'shadow-2xl',
            'flex flex-col overflow-y-auto',
            'transition-transform duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
            isOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          {/* Panel header: site name + close */}
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
                'hover:bg-[var(--bbf-color-black-100)]',
                'active:scale-95',
                'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              <MenuIcon open={true} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col gap-1 px-6 py-6" aria-label="Mobile navigation">
            {links.map((link, idx) => (
              <Link
                key={`${link.href}-${idx}`}
                href={`${localePrefix}${link.href}`}
                onClick={close}
                tabIndex={isOpen ? 0 : -1}
                className={cn(
                  'group block px-2 py-4',
                  'text-lg font-medium text-[var(--bbf-text-on-sand)]',
                  'border-b border-[var(--bbf-border-on-sand)]/40',
                  'transition-all duration-150 ease-out',
                  'hover:translate-x-1 hover:text-[var(--bbf-accent-red)]',
                  'focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
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
            ))}
          </nav>

          {/* CTA al pie */}
          {cta && (
            <div className="px-6 pb-8">
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
      </div>
    </>
  );
}
