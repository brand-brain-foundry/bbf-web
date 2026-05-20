'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
};

export function MobileMenu({ links, cta, localePrefix }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  if (links.length === 0 && !cta) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-panel"
        aria-label="Abrir menú de navegación"
        className={cn(
          'inline-flex items-center justify-center lg:hidden',
          'h-10 w-10 rounded-md',
          'text-[var(--bbf-text-on-light)]',
          'transition-opacity duration-150 ease-out',
          'hover:opacity-70 active:opacity-50',
          'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
        )}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú móvil"
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={close}
            className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
          />

          <div
            id="mobile-menu-panel"
            className={cn(
              'absolute top-0 right-0 h-full w-80 max-w-[85vw]',
              'bg-[var(--bbf-surface-sand)]',
              'border-l border-[var(--bbf-border-on-light)]',
              'shadow-xl',
              'flex flex-col',
              'overflow-y-auto',
            )}
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar menú"
                className={cn(
                  'inline-flex items-center justify-center',
                  'h-10 w-10 rounded-md',
                  'text-[var(--bbf-text-on-light)]',
                  'transition-opacity duration-150 ease-out',
                  'hover:opacity-70 active:opacity-50',
                  'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
                )}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-4 pb-4" aria-label="Mobile navigation">
              {links.map((link, idx) => (
                <Link
                  key={`${link.href}-${idx}`}
                  href={`${localePrefix}${link.href}`}
                  onClick={close}
                  className={cn(
                    'block px-2 py-3 text-base',
                    'text-[var(--bbf-text-on-light)]',
                    'border-b border-[var(--bbf-border-on-light)]',
                    'transition-opacity duration-150 ease-out',
                    'hover:opacity-70 active:opacity-50',
                    'focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 focus-visible:opacity-100 focus-visible:outline-none',
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {cta && (
                <Link
                  href={`${localePrefix}${cta.href}`}
                  onClick={close}
                  className={cn(
                    'mt-6 block rounded-md px-4 py-3 text-center text-base font-medium',
                    'bg-[var(--bbf-text-on-light)] text-[var(--bbf-surface-sand)]',
                    'transition-opacity duration-150 ease-out',
                    'hover:opacity-90 active:opacity-80',
                    'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
                  )}
                >
                  {cta.label}
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
