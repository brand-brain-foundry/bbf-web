'use client';

/**
 * TimelineScroller — Client Component (D-99 split)
 * Parte 3: interactividad del §4·B Timeline.
 *
 * Renderiza: controls (attribution + arrows) + scroller (cards + rail) + footer (progress + CTA).
 * Lógica: scroll animado (setInterval, NO rAF), arrows disabled en extremos,
 *         keyboard ←/→, progress dinámico, detección de card activa.
 *
 * setInterval (no rAF): rAF se pausa en tabs ocultos/headless — setInterval no.
 * Refs: D-99, D-TIMELINE-01, B-BBF-WEB-TIMELINE Parte 3
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { Icon, Icons, type IconCanon } from '@/components/atoms/Icon';
import type { TimelineMilestone } from './Timeline';

/* ── Constantes de scroll ─────────────────────────────────────── */

const SCROLL_BASE_MS = 240;
const SCROLL_CAP_MS = 620;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/* ── Props ────────────────────────────────────────────────────── */

interface TimelineScrollerProps {
  milestones: TimelineMilestone[];
  attribution?: string | null;
  ctaHref: string;
  ctaLabel: string;
}

/* ── Component ────────────────────────────────────────────────── */

export function TimelineScroller({
  milestones,
  attribution,
  ctaHref,
  ctaLabel,
}: TimelineScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedMotionRef = useRef(false);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = milestones.length;

  /* Detectar prefers-reduced-motion en mount (browser-only) */
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /* measure — lee estado del scroll y actualiza UI */
  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    setAtStart(scrollLeft <= 2);
    setAtEnd(maxScroll <= 0 || scrollLeft >= maxScroll - 2);
    setProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);

    /* Card activa = la más cercana al borde izquierdo del scroller */
    const cards = el.querySelectorAll<HTMLElement>('.bbf-timeline__card');
    const scrollerLeft = el.getBoundingClientRect().left;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - scrollerLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  /* Adjuntar listener de scroll + medición inicial */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    return () => {
      el.removeEventListener('scroll', measure);
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [measure]);

  /* animateTo — easeOutCubic via setInterval (no rAF) */
  const animateTo = useCallback((target: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }

    if (reducedMotionRef.current) {
      el.scrollLeft = target;
      return;
    }

    const start = el.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) return;

    const duration = Math.min(SCROLL_CAP_MS, SCROLL_BASE_MS + Math.abs(distance) * 0.3);
    const startTime = Date.now();

    animationRef.current = setInterval(() => {
      const t = Math.min((Date.now() - startTime) / duration, 1);
      el.scrollLeft = start + distance * easeOutCubic(t);
      if (t >= 1) {
        clearInterval(animationRef.current!);
        animationRef.current = null;
      }
    }, 16);
  }, []);

  /* step — un card en la dirección dada, clamped a los límites */
  const step = useCallback(
    (dir: 1 | -1) => {
      const el = scrollerRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>('.bbf-timeline__card');
      const cardWidth = card?.offsetWidth ?? 272;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const target = Math.max(0, Math.min(el.scrollLeft + dir * cardWidth, maxScroll));
      animateTo(target);
    },
    [animateTo],
  );

  /* Keyboard ←/→ sobre el scroller (tabIndex={0}) */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      }
    };
    el.addEventListener('keydown', handleKey);
    return () => el.removeEventListener('keydown', handleKey);
  }, [step]);

  return (
    <>
      {/* Controls: attribution pill + arrows */}
      <div className="bbf-timeline__controls">
        {attribution ? (
          <div className="bbf-timeline__attribution">
            <span className="bbf-timeline__live-dot" aria-hidden="true" />
            <span>{attribution}</span>
          </div>
        ) : (
          <div aria-hidden="true" />
        )}
        <div className="bbf-timeline__arrows">
          <button
            className="bbf-timeline__arrow"
            aria-label="Hito anterior"
            type="button"
            disabled={atStart}
            onClick={() => step(-1)}
          >
            <Icon icon={Icons.chevronLeft} size="sm" aria-hidden />
          </button>
          <button
            className="bbf-timeline__arrow"
            aria-label="Hito siguiente"
            type="button"
            disabled={atEnd}
            onClick={() => step(1)}
          >
            <Icon icon={Icons.chevronRight} size="sm" aria-hidden />
          </button>
        </div>
      </div>

      {/* Scroller: track de cards con rail embebido */}
      <div
        ref={scrollerRef}
        className="bbf-timeline__scroller"
        role="region"
        aria-label="Hitos de trayectoria"
        tabIndex={0}
      >
        <div className="bbf-timeline__track" role="list">
          {milestones.map((m, i) => (
            <article
              key={m.id ?? String(i)}
              className={`bbf-timeline__card bbf-timeline__card--${m.status}`}
              role="listitem"
            >
              <div className="bbf-timeline__card-inner">
                <div className="bbf-timeline__card-head">
                  <span className="bbf-timeline__num">{String(i + 1).padStart(2, '0')} · hito</span>
                  <div className={`bbf-timeline__badge bbf-timeline__badge--${m.status}`}>
                    <span className="bbf-timeline__badge-dot" aria-hidden="true" />
                    <span className="bbf-timeline__badge-label">{m.statusLabel}</span>
                  </div>
                </div>
                <div className="bbf-timeline__card-body">
                  {m.icon && m.icon in Icons && (
                    <Icon
                      icon={Icons[m.icon as IconCanon]}
                      size="md"
                      aria-hidden
                      className="bbf-timeline__icon"
                    />
                  )}
                  <h3 className="bbf-timeline__title">{m.title}</h3>
                  <p className="bbf-timeline__note">{m.note}</p>
                </div>
              </div>

              {/* Rail: [connector-left][stop][connector-right] */}
              <div className="bbf-timeline__stop-area" aria-hidden="true">
                <div className="bbf-timeline__connector-left" />
                <div className={`bbf-timeline__stop bbf-timeline__stop--${m.status}`}>
                  {m.status === 'active' && <Icon icon={Icons.check} size="xs" aria-hidden />}
                </div>
                <div className="bbf-timeline__connector-right" />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer: label + progress bar + CTA */}
      <div className="bbf-timeline__footer">
        <div className="bbf-timeline__progress-wrap">
          <span className="bbf-timeline__progress-label" aria-live="polite" aria-atomic="true">
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div className="bbf-timeline__progress" aria-hidden="true">
            <div
              className="bbf-timeline__progress-fill"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
        <a href={ctaHref} className="bbf-cta-link">
          {ctaLabel}
          <Icon icon={Icons.arrowRight} size="sm" aria-hidden />
        </a>
      </div>
    </>
  );
}
