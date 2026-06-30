'use client';

/**
 * IntegracionesPlayer — Client leaf (D-99).
 * Lista de conectores del Cerebro con animación secuencial.
 * OFF → Conectando (520ms) → Conectado (360ms) por ítem, auto-scroll centra la fila activa.
 * IntersectionObserver (0.3) + loopActive guard + prefers-reduced-motion.
 */

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Icon, Icons } from '@/components/atoms/Icon';

interface IntItem {
  id?: string;
  iconUrl: string;
  iconAlt: string;
  name: string;
  category: string;
}

export interface IntegracionesUI {
  appTitle: string;
  backAriaLabel: string;
  allDoneTitle: string;
  sourcesOf: string;
  sourcesActive: string;
  statusConnectedPrefix: string;
  statusConnecting: string;
}

interface IntegracionesPlayerProps {
  logoNode: ReactNode;
  summaryTitle: string;
  items: IntItem[];
  ui: IntegracionesUI;
}

type ItemState = 'off' | 'connecting' | 'on';

export function IntegracionesPlayer({
  logoNode,
  summaryTitle,
  items,
  ui,
}: IntegracionesPlayerProps) {
  const [done, setDone] = useState(0);
  const [connecting, setConnecting] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const runId = useRef(0);
  const loopActive = useRef(false);

  const total = items.length;
  const pct = total > 0 ? (done / total) * 100 : 0;
  const allDone = done === total && total > 0;

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(items.length);
      setConnecting(null);
      return;
    }

    const scrollToRow = (index: number) => {
      const row = rowRefs.current[index];
      const list = listRef.current;
      if (row && list) {
        const target = row.offsetTop - list.offsetHeight / 2 + row.offsetHeight / 2;
        list.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
      }
    };

    const startLoop = () => {
      if (loopActive.current) return;
      loopActive.current = true;
      const myRun = ++runId.current;
      const alive = () => runId.current === myRun;
      const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

      async function run() {
        while (true) {
          setDone(0);
          setConnecting(null);
          if (listRef.current) listRef.current.scrollTop = 0;
          await sleep(800);

          for (let i = 0; i < items.length; i++) {
            if (!alive()) return;
            setConnecting(i);
            scrollToRow(i);
            await sleep(520);
            if (!alive()) return;
            setDone(i + 1);
            setConnecting(null);
            await sleep(360);
          }

          await sleep(2600);
          if (!alive()) return;
        }
      }

      run().finally(() => {
        loopActive.current = false;
      });
    };

    const stopLoop = () => {
      loopActive.current = false;
      runId.current++;
      setDone(0);
      setConnecting(null);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0.3 },
    );
    obs.observe(el);

    return () => {
      runId.current++;
      obs.disconnect();
    };
  }, [items]);

  const getItemState = (i: number): ItemState => {
    if (i < done) return 'on';
    if (i === connecting) return 'connecting';
    return 'off';
  };

  return (
    <div
      className="bbf-app-screen bbf-app-integraciones"
      ref={wrapperRef}
      data-component="bbf-app-integraciones"
    >
      <div className="bbf-app-phone">
        <div className="bbf-app-phone__screen">
          {/* Android status bar — same chrome as app-screen */}
          <div className="bbf-app-sb">
            <div className="bbf-app-sb__l">
              <span>2:47</span>
              <span className="bbf-app-sb__pill">
                <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="1" y="1" width="10" height="10" rx="2" />
                </svg>
                Brain App
              </span>
            </div>
            <div className="bbf-app-sb__r" aria-hidden="true">
              <svg width="14" height="11" viewBox="0 0 16 12" fill="currentColor">
                <path
                  d="M8 2.5C5.5 2.5 3.3 3.4 1.7 4.9L0.5 3.6C2.4 1.7 5 0.5 8 0.5S13.6 1.7 15.5 3.6L14.3 4.9C12.7 3.4 10.5 2.5 8 2.5z"
                  opacity="0.5"
                />
                <path d="M8 5.5C6.6 5.5 5.3 6 4.3 6.9L3.1 5.6C4.4 4.4 6.1 3.7 8 3.7s3.6 0.7 4.9 1.9L11.7 6.9C10.7 6 9.4 5.5 8 5.5z" />
                <path d="M8 8.4c0.7 0 1.3 0.3 1.8 0.8L8 11l-1.8-1.8C6.7 8.7 7.3 8.4 8 8.4z" />
              </svg>
              <svg width="15" height="11" viewBox="0 0 18 12" fill="currentColor">
                <rect x="0" y="6" width="3" height="5" rx="0.5" />
                <rect x="4.5" y="4" width="3" height="7" rx="0.5" />
                <rect x="9" y="2" width="3" height="9" rx="0.5" />
                <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
              </svg>
              <span className="bbf-app-sb__batt">73</span>
            </div>
          </div>

          {/* App bar */}
          <div className="bbf-app-appbar">
            <button className="bbf-app-appbar__back" aria-label={ui.backAriaLabel}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="bbf-app-appbar__logo">{logoNode}</span>
            <span className="bbf-app-appbar__title">{ui.appTitle}</span>
            <span className="bbf-app-appbar__right" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </span>
          </div>

          {/* Sticky summary: logo + dynamic title + subtitle + counter + progress bar */}
          <div className="bbf-app-int-summary">
            <div className="bbf-app-int-summary__head">
              <div className="bbf-app-int-summary__logo" aria-hidden="true">
                <Icon icon={Icons.settings} size="md" />
              </div>
              <div className="bbf-app-int-summary__info">
                <div className="bbf-app-int-summary__title">
                  {allDone ? ui.allDoneTitle : summaryTitle}
                </div>
                <div className="bbf-app-int-summary__sub">
                  {done} {ui.sourcesOf} {total} {ui.sourcesActive}
                </div>
              </div>
              <div className="bbf-app-int-summary__count">
                {String(done).padStart(2, '0')}
                <span>/{total}</span>
              </div>
            </div>
            <div className="bbf-app-int-summary__bar">
              <div
                className="bbf-app-int-summary__fill"
                style={{ width: `${pct}%` } as CSSProperties}
              />
            </div>
          </div>

          {/* Scrollable list body */}
          <div className="bbf-app-screen-body" ref={listRef}>
            <div className="bbf-app-int-list">
              {items.map((item, i) => {
                const state = getItemState(i);
                return (
                  <div
                    key={item.id ?? i}
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    className={`bbf-app-int-row bbf-app-int-row--${state}`}
                  >
                    {/* Icon */}
                    <div className="bbf-app-int-icon">
                      {item.iconUrl ? (
                        <Image
                          src={item.iconUrl}
                          alt={item.iconAlt || item.name}
                          fill
                          sizes="42px"
                          style={{ objectFit: 'contain' }}
                        />
                      ) : (
                        <span className="bbf-app-int-icon-placeholder" aria-hidden="true">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Name + status */}
                    <div className="bbf-app-int-meta">
                      <div className="bbf-app-int-name">{item.name}</div>
                      <div className={`bbf-app-int-status bbf-app-int-status--${state}`}>
                        {state === 'on' && (
                          <>
                            <span className="bbf-app-int-status__dot" aria-hidden="true" />
                            {ui.statusConnectedPrefix}
                            {item.category}
                          </>
                        )}
                        {state === 'connecting' && (
                          <>
                            <span className="bbf-app-int-spin" aria-hidden="true" />
                            {ui.statusConnecting}
                          </>
                        )}
                        {state === 'off' && item.category}
                      </div>
                    </div>

                    {/* Toggle switch */}
                    <div
                      className={state === 'on' ? 'bbf-app-int-sw is-on' : 'bbf-app-int-sw'}
                      aria-hidden="true"
                    >
                      <div className="bbf-app-int-sw__knob" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Android navbar */}
          <div className="bbf-app-navbar" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 5v14M10 5v14M14 5v14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 5l-7 7 7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
