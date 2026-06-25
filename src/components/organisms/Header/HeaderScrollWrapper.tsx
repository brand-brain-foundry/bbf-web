'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { BBF_DURATION_BASE_S, BBF_EASE_OUT_QUART } from '@/lib/motion/constants';

type HeaderScrollWrapperProps = {
  children: ReactNode;
  className?: string;
};

/**
 * BBF HeaderScrollWrapper — D-NAV-SCROLL-01/02/03
 *
 * Dos comportamientos independientes:
 *   1. Scroll skin (D-NAV-SCROLL-02): data-surface "sand" ↔ "sand-elevated" (#ebe3d4).
 *      Umbral derivado de --bbf-header-height via probe element (P-3 linaje).
 *   2. Footer hide (D-NAV-SCROLL-03): IntersectionObserver sobre [data-component="bbf-footer"].
 *      Nav sube con motion y desaparece; vuelve cuando el footer sale del viewport.
 *      A11y: aria-hidden + inert cuando oculto; reduced-motion = transición instantánea.
 */
export function HeaderScrollWrapper({ children, className }: HeaderScrollWrapperProps) {
  const [scrolled, setScrolled] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const thresholdRef = useRef<number>(80);
  const prefersReducedMotion = useReducedMotion();

  // ── Scroll skin (OLA 1-REV) — deriv umbral de --bbf-header-height ──────────
  useEffect(() => {
    const probe = document.createElement('div');
    probe.style.cssText =
      'position:fixed;height:var(--bbf-header-height);pointer-events:none;visibility:hidden;top:-9999px;left:0';
    document.body.appendChild(probe);
    thresholdRef.current = probe.offsetHeight || 80;
    document.body.removeChild(probe);

    const handleScroll = () => {
      setScrolled(window.scrollY > thresholdRef.current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Footer hide (OLA 2) — observer sobre [data-component="bbf-footer"] ─────
  useEffect(() => {
    const footer = document.querySelector('[data-component="bbf-footer"]');
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      data-surface={scrolled ? 'sand-elevated' : 'sand'}
      data-scrolled={scrolled ? 'true' : 'false'}
      data-footer-visible={footerVisible ? 'true' : 'false'}
      className={cn('bbf-header-card', className)}
      animate={{
        y: footerVisible ? '-100%' : '0%',
        opacity: footerVisible ? 0 : 1,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : BBF_DURATION_BASE_S,
        ease: BBF_EASE_OUT_QUART,
      }}
      aria-hidden={footerVisible || undefined}
      inert={footerVisible || undefined}
    >
      {children}
    </motion.div>
  );
}
