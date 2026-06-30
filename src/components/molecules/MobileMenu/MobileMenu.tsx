'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MenuIcon } from '@/components/atoms/MenuIcon';
import { Button } from '@/components/atoms/Button';
import { Icon, Icons, type IconCanon } from '@/components/atoms/Icon';
import { BBF_DURATION_BASE_S, BBF_EASE_OUT_QUART } from '@/lib/motion/constants';
import {
  mobileMenuIconButtonVariants,
  mobileMenuBackdropVariants,
  mobileMenuPanelVariants,
  mobileMenuItemVariants,
  mobileMenuSubMenuTriggerVariants,
} from './MobileMenu.variants';

type SubLink = {
  label: string;
  href: string;
  description?: string | null;
  icon?: string | null;
  mediaType?: 'none' | 'image' | 'video';
  media?: {
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
    mimeType?: string;
  } | null;
};

type MobileMenuLink = {
  label: string;
  href: string;
  hasSubMenu?: boolean;
  subLinks?: SubLink[];
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
  /** Slot: logo icon para el header del drawer. Server Component pasado desde Header. Fallback: texto siteName. */
  logo?: ReactNode;
};

// Slide variants — direction-aware (1 = forward L1→L2, -1 = backward L2→L1)
// prefers-reduced-motion: opacity fade instantáneo, sin slide
function makeSlideVariants(reduced: boolean | null) {
  if (reduced) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  return {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
    center: { x: 0 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%' }),
  };
}

/**
 * BBF MobileMenu — drawer right-side canon (D-BBF-KB-107)
 * F3b: modelo drill-down iOS (reemplaza accordion MobileSubMenu).
 * V1 = lista cornerstones. V2 = subLinks de sección activa.
 * Slide x AnimatePresence, BBF motion tokens, reduced-motion fade, focus bidireccional.
 * H-2: backdrop + panel portaled a document.body — escapa backdrop-filter del Header inner card.
 */
export function MobileMenu({ links, cta, siteName = 'Sivar Brains', logo }: MobileMenuProps) {
  const t = useTranslations('Header');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  // H-2: mount guard — document.body no existe en SSR; portal activo solo tras hidratación
  const [mounted, setMounted] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const savedIdxRef = useRef<number | null>(null);

  const goTo = useCallback((idx: number) => {
    savedIdxRef.current = idx;
    setDirection(1);
    setActiveIdx(idx);
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setActiveIdx(null);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIdx(null);
    buttonRef.current?.focus();
  }, []);

  // Escape: cierra el drawer (del prototipo validado)
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, close]);

  // H-2: activa el portal después de hidratación (document.body disponible en cliente)
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Foco en primer elemento al abrir drawer
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const first = panelRef.current.querySelector<HTMLElement>('a, button');
      first?.focus();
    }
  }, [isOpen]);

  // Foco en "← Volver" al entrar vista 2
  useEffect(() => {
    if (activeIdx !== null) {
      const id = setTimeout(() => backRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [activeIdx]);

  // Foco en el trigger que abrió el drill-down al regresar a vista 1
  useEffect(() => {
    if (activeIdx === null && isOpen && savedIdxRef.current !== null) {
      const delay = Math.round(BBF_DURATION_BASE_S * 1000) + 60;
      const id = setTimeout(() => {
        itemRefs.current[savedIdxRef.current!]?.focus();
      }, delay);
      return () => clearTimeout(id);
    }
  }, [activeIdx, isOpen]);

  const slideVariants = makeSlideVariants(prefersReducedMotion);
  const slideTransition = {
    duration: prefersReducedMotion ? 0.01 : BBF_DURATION_BASE_S,
    ease: BBF_EASE_OUT_QUART,
  };

  const activeSection = activeIdx !== null ? links[activeIdx] : null;

  return (
    <>
      {/* Trigger button — visible solo < lg */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="bbf-mobile-menu-panel"
        aria-label={isOpen ? t('mobileMenu.close') : t('mobileMenu.open')}
        data-component="bbf-mobile-menu-trigger"
        className={mobileMenuIconButtonVariants({ size: 'trigger' })}
      >
        <MenuIcon open={isOpen} />
      </button>

      {/* Backdrop + Panel — portaled a document.body (H-2: escapa backdrop-filter del Header card) */}
      {mounted &&
        createPortal(
          <>
            {/* Backdrop: hermano del panel, z-90 */}
            <div
              onClick={close}
              aria-hidden="true"
              className={mobileMenuBackdropVariants({ open: isOpen })}
            />

            {/* Panel right-side: z-100, h-[100dvh], flex col sin overflow-y (cada vista lo controla) */}
            <div
              ref={panelRef}
              id="bbf-mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label={t('mobileMenu.panelLabel')}
              aria-hidden={!isOpen}
              data-component="bbf-mobile-menu-panel"
              data-surface="sand"
              className={mobileMenuPanelVariants({ open: isOpen })}
            >
              {/* Panel header — shrink-0, siempre visible */}
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--bbf-on-surface-border)] px-6 py-5">
                {logo ?? (
                  <span className="text-[length:var(--bbf-text-body-sm)] [font-weight:var(--bbf-weight-bold)] text-[var(--bbf-on-surface-title)]">
                    {siteName}
                  </span>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label={t('mobileMenu.close')}
                  tabIndex={isOpen ? 0 : -1}
                  className={mobileMenuIconButtonVariants({ size: 'close' })}
                >
                  <MenuIcon open={true} />
                </button>
              </div>

              {/* Views container — overflow-hidden clipa el slide horizontal entre V1 y V2 */}
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  {activeSection === null ? (
                    // ─── Vista 1 — lista de cornerstones ──────────────────
                    <motion.div
                      key="v1"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={slideTransition}
                      className="absolute inset-0 overflow-y-auto"
                    >
                      <nav
                        className="flex flex-col px-6 py-6"
                        aria-label={t('mobileMenu.navLabel')}
                      >
                        {links.map((link, idx) => {
                          const hasSub =
                            link.hasSubMenu && link.subLinks && link.subLinks.length > 0;

                          if (hasSub) {
                            return (
                              <button
                                key={`${link.href}-${idx}`}
                                ref={(el) => {
                                  itemRefs.current[idx] = el;
                                }}
                                type="button"
                                tabIndex={isOpen ? 0 : -1}
                                aria-haspopup="true"
                                aria-expanded="false"
                                onClick={() => goTo(idx)}
                                className={mobileMenuSubMenuTriggerVariants()}
                              >
                                <span>{link.label}</span>
                                <ChevronRight
                                  className="h-4 w-4 shrink-0 text-[var(--bbf-on-surface-body)] transition-transform [transition-duration:var(--bbf-motion-duration-fast)] [@media(hover:hover)]:group-hover:translate-x-0.5"
                                  aria-hidden
                                />
                              </button>
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
                    </motion.div>
                  ) : (
                    // ─── Vista 2 — subLinks de la sección activa ──────────
                    <motion.div
                      key={`v2-${activeIdx}`}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={slideTransition}
                      className="absolute inset-0 flex flex-col overflow-y-auto"
                    >
                      {/* Header V2: ← Volver + título de sección */}
                      <div className="flex shrink-0 items-center gap-2 border-b border-[var(--bbf-on-surface-border)]/40 px-3 py-3">
                        <button
                          ref={backRef}
                          type="button"
                          onClick={goBack}
                          tabIndex={isOpen ? 0 : -1}
                          aria-label={t('mobileMenu.back')}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center [border-radius:var(--bbf-radius-interactive)] text-[var(--bbf-on-surface-title)] transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)] focus-visible:ring-2 focus-visible:ring-[var(--bbf-on-surface-focus-ring)] focus-visible:outline-none [@media(hover:hover)]:hover:bg-[var(--bbf-on-surface-hover-bg)]"
                        >
                          <ChevronLeft className="h-5 w-5" aria-hidden />
                        </button>
                        <span className="text-[length:var(--bbf-text-body-md)] [font-weight:var(--bbf-weight-semibold)] text-[var(--bbf-on-surface-title)]">
                          {activeSection.label}
                        </span>
                      </div>

                      {/* ↗ Ver todo — link a la sección general (F1: label corregido) */}
                      <Link
                        href={activeSection.href}
                        onClick={close}
                        tabIndex={isOpen ? 0 : -1}
                        className="flex min-h-[44px] items-center border-b border-[var(--bbf-on-surface-border)]/30 px-6 py-3 text-[length:var(--bbf-text-body-sm)] [font-weight:var(--bbf-weight-medium)] text-[var(--bbf-on-surface-body)] transition-colors [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)] focus-visible:text-[var(--bbf-on-surface-link)] focus-visible:outline-none [@media(hover:hover)]:hover:text-[var(--bbf-on-surface-link)]"
                      >
                        {t('mobileMenu.viewAll')}
                      </Link>

                      {/* SubLinks — H-1: icon siempre visible (media no se renderiza en V2) */}
                      <div className="flex flex-col gap-1 px-4 py-3">
                        {(activeSection.subLinks ?? []).map((sub, sIdx) => {
                          return (
                            <Link
                              key={`${sub.href}-${sIdx}`}
                              href={sub.href}
                              onClick={close}
                              tabIndex={isOpen ? 0 : -1}
                              className="group flex min-h-[44px] items-center gap-3 [border-radius:var(--bbf-radius-card)] px-2 py-3 transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)] focus-visible:bg-[var(--bbf-on-surface-hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--bbf-on-surface-focus-ring)] focus-visible:ring-offset-1 focus-visible:outline-none [@media(hover:hover)]:hover:bg-[var(--bbf-on-surface-hover-bg)]"
                            >
                              {sub.icon && sub.icon in Icons && (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center [border-radius:var(--bbf-radius-interactive)] bg-[var(--bbf-on-surface-hover-bg)]">
                                  <Icon
                                    icon={Icons[sub.icon as IconCanon]}
                                    size="sm"
                                    aria-hidden
                                    className="text-[var(--bbf-on-surface-icon-accent)]"
                                  />
                                </div>
                              )}
                              <div className="flex min-w-0 flex-1 flex-col">
                                <span className="text-[length:var(--bbf-text-body-md)] [font-weight:var(--bbf-weight-medium)] text-[var(--bbf-on-surface-title)] transition-colors [transition-duration:var(--bbf-motion-duration-fast)] group-focus-visible:text-[var(--bbf-on-surface-link)] [@media(hover:hover)]:group-hover:text-[var(--bbf-on-surface-link)]">
                                  {sub.label}
                                </span>
                                {sub.description && (
                                  <span className="text-[length:var(--bbf-text-xs)] leading-[var(--bbf-leading-snug)] text-[var(--bbf-on-surface-muted)]">
                                    {sub.description}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA al pie — shrink-0, siempre visible independiente de la vista */}
              {cta && (
                <div className="shrink-0 px-6 pt-2 pb-8">
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
          </>,
          document.body,
        )}
    </>
  );
}
