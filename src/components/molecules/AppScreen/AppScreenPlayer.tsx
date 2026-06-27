'use client';

/**
 * AppScreenPlayer — Client leaf para animación app-screen (D-99).
 * Emula flujo Brain Content: brief → generación → diseño → publicación.
 * IntersectionObserver (0.3) arranca/detiene el loop.
 * prefers-reduced-motion: muestra Screen 3 estático.
 */

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface MetaRow {
  key: string;
  value: string;
}

interface TapState {
  x: number;
  y: number;
  show: boolean;
  press: boolean;
}

interface AppScreenPlayerProps {
  logoNode: ReactNode;
  briefText: string;
  chips: string[];
  metaRows: MetaRow[];
  rawImageUrl: string;
  rawImageAlt: string;
  renderImageUrl: string;
  renderImageAlt: string;
  caption: string;
  hashtags: string;
  publishMeta: string;
}

type Screen = 'brief' | 'detail' | 'render';

export function AppScreenPlayer({
  logoNode,
  briefText,
  chips,
  metaRows,
  rawImageUrl,
  rawImageAlt,
  renderImageUrl,
  renderImageAlt,
  caption,
  hashtags,
  publishMeta,
}: AppScreenPlayerProps) {
  const [screen, setScreen] = useState<Screen>('brief');
  const [typed, setTyped] = useState('');
  const [generating, setGenerating] = useState(false);
  const [designing, setDesigning] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [tap, setTap] = useState<TapState>({ x: 0, y: 0, show: false, press: false });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null); // phone screen — reference for tap coordinates
  const briefBtnRef = useRef<HTMLButtonElement>(null);
  const designBtnRef = useRef<HTMLButtonElement>(null);
  const publishBtnRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runId = useRef(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setScreen('render');
      setReveal(true);
      return;
    }

    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const after = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    // Convert screen-space coordinates to phone content-space coordinates.
    // screenRef content width ≈ 364px (380 - 2*8px padding). Scale changes visual size
    // but content space is unchanged — dividing by scale factor corrects for CSS transform.
    const tapAt = (ref: React.RefObject<HTMLButtonElement | null>, cb: () => void) => {
      const btnEl = ref.current;
      const scEl = screenRef.current;
      if (!btnEl || !scEl) {
        cb();
        return;
      }
      const r = btnEl.getBoundingClientRect();
      const p = scEl.getBoundingClientRect();
      const x = r.left + r.width / 2 - p.left;
      const y = r.top + r.height / 2 - p.top;
      setTap({ x, y, show: true, press: false });
      after(420, () => {
        setTap((t) => ({ ...t, press: true }));
        after(260, cb);
        after(640, () => setTap((t) => ({ ...t, show: false, press: false })));
      });
    };

    const startAnim = () => {
      const myRun = ++runId.current;
      const alive = () => runId.current === myRun;
      clearAll();

      setScreen('brief');
      setTyped('');
      setGenerating(false);
      setDesigning(false);
      setReveal(false);
      setPublishing(false);
      setPublished(false);
      setTap({ x: 0, y: 0, show: false, press: false });

      let i = 0;
      const typeNext = () => {
        if (!alive()) return;
        i += 1;
        setTyped(briefText.slice(0, i));
        if (i < briefText.length) after(28, typeNext);
        else after(700, () => tapAt(briefBtnRef, doGenerate));
      };
      after(800, typeNext);

      function doGenerate() {
        if (!alive()) return;
        setGenerating(true);
        after(1500, () => {
          if (!alive()) return;
          setGenerating(false);
          setScreen('detail');
          after(1300, () => tapAt(designBtnRef, doDesign));
        });
      }

      function doDesign() {
        if (!alive()) return;
        setDesigning(true);
        after(1500, () => {
          if (!alive()) return;
          setDesigning(false);
          setScreen('render');
          after(60, () => {
            if (alive()) setReveal(true);
          });
          after(1700, () => tapAt(publishBtnRef, doPublish));
        });
      }

      function doPublish() {
        if (!alive()) return;
        setPublishing(true);
        after(1400, () => {
          if (!alive()) return;
          setPublishing(false);
          setPublished(true);
          after(3200, startAnim); // loop
        });
      }
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnim();
        } else {
          runId.current++;
          clearAll();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);

    return () => {
      runId.current++;
      clearAll();
      obs.disconnect();
    };
  }, [briefText]);

  const briefFull = typed.length >= 10;

  return (
    <div className="bbf-app-screen" ref={wrapperRef} data-component="bbf-app-screen">
      <div className="bbf-app-phone">
        <div className="bbf-app-phone__screen" ref={screenRef}>
          {/* Android status bar */}
          <div className="bbf-app-sb">
            <div className="bbf-app-sb__l">
              <span>2:47</span>
              <span className="bbf-app-sb__pill">
                <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="1" y="1" width="10" height="10" rx="2" />
                </svg>
                Uber Eats
              </span>
              <span className="bbf-app-sb__pill">31</span>
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

          {/* App bar — D-PANTALLA-03-REV: logo solo-icono sin siteName */}
          <div className="bbf-app-appbar">
            <button className="bbf-app-appbar__back" aria-label="Atrás">
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
            <span className="bbf-app-appbar__title">
              {screen === 'brief' && 'Nuevo Brief'}
              {screen === 'detail' && 'Detail Post'}
              {screen === 'render' && 'Diseño Final'}
            </span>
            <span className="bbf-app-appbar__right" aria-hidden="true">
              {screen === 'brief' && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4v16M4 12h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {screen === 'detail' && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12a8 8 0 018-8c2.5 0 4.7 1.1 6.2 2.9M20 12a8 8 0 01-8 8c-2.5 0-4.7-1.1-6.2-2.9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 3v4h-4M6 21v-4h4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {screen === 'render' && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="5" cy="12" r="1.7" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.7" fill="currentColor" />
                  <circle cx="19" cy="12" r="1.7" fill="currentColor" />
                </svg>
              )}
            </span>
          </div>

          {/* Screen 1 — Brief */}
          {screen === 'brief' && (
            <>
              <div className="bbf-app-screen-body">
                <div className="bbf-app-brief">
                  <div className="bbf-app-brief__hint">
                    <span className="bbf-app-brief__hint-mark">📌</span>
                    <span>
                      Describe lo que necesitas. El cerebro genera el contenido con tu voz.
                    </span>
                  </div>
                  <div className="bbf-app-brief__label">Brief</div>
                  <div className={`bbf-app-brief__box ${briefFull ? 'is-full' : ''}`}>
                    <span className="bbf-app-brief__text">
                      {typed}
                      {!generating && <span className="bbf-app-brief__caret" />}
                    </span>
                  </div>
                  {chips.length > 0 && (
                    <div className="bbf-app-brief__chips">
                      {chips.map((chip, i) => (
                        <span
                          key={i}
                          className={`bbf-app-brief__chip ${typed.length > 12 + i * 10 ? 'is-on' : ''}`}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  {metaRows.length > 0 && (
                    <div className="bbf-app-brief__meta">
                      {metaRows.map((row, i) => (
                        <div key={i} className="bbf-app-brief__meta-row">
                          <span className="bbf-app-brief__meta-k">{row.key}</span>
                          <span className="bbf-app-brief__meta-v">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="bbf-app-brief__cta-wrap">
                <button
                  ref={briefBtnRef}
                  className={`bbf-app-brief__cta ${briefFull ? 'is-ready' : ''} ${generating ? 'is-loading' : ''}`}
                  disabled={!briefFull || generating}
                >
                  {generating ? (
                    <>
                      <span className="bbf-app-spin bbf-app-spin--white" aria-hidden="true" />{' '}
                      Generando…
                    </>
                  ) : (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 32 32"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                          const rad = (a * Math.PI) / 180;
                          return (
                            <circle
                              key={a}
                              cx={16 + Math.cos(rad) * 8.5}
                              cy={16 + Math.sin(rad) * 8.5}
                              r="3.4"
                            />
                          );
                        })}
                        <circle cx="16" cy="16" r="4.2" />
                      </svg>
                      Generar contenido
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Screen 2 — Detail Post */}
          {screen === 'detail' && (
            <>
              <div className="bbf-app-screen-body">
                <div className="bbf-app-detail">
                  {rawImageUrl && (
                    <div className="bbf-app-detail__media">
                      <Image
                        src={rawImageUrl}
                        alt={rawImageAlt}
                        fill
                        sizes="(max-width: 360px) 62vw, 224px"
                        style={{ objectFit: 'cover' }}
                      />
                      <span className="bbf-app-detail__badge">
                        <span className="bbf-app-detail__badge-dot" />
                        Asset generado
                      </span>
                    </div>
                  )}
                  <button
                    ref={designBtnRef}
                    className={`bbf-app-detail__design ${designing ? 'is-loading' : ''}`}
                    disabled={designing}
                  >
                    <span className="bbf-app-detail__design-circle">
                      {designing ? (
                        <span className="bbf-app-spin bbf-app-spin--white" aria-hidden="true" />
                      ) : (
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 17.5V21h3.5L17 10.5 13.5 7 3 17.5zM19.7 8.3a1.2 1.2 0 000-1.7l-2.3-2.3a1.2 1.2 0 00-1.7 0l-1.8 1.8 4 4 1.8-1.8z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="bbf-app-detail__design-label">
                      {designing ? 'Diseñando…' : 'Diseñar'}
                    </span>
                  </button>
                  {caption && (
                    <div className="bbf-app-detail__section">
                      <div className="bbf-app-detail__section-title">📌 Caption</div>
                      <p className="bbf-app-detail__caption">{caption}</p>
                    </div>
                  )}
                  {hashtags && (
                    <div className="bbf-app-detail__section">
                      <div className="bbf-app-detail__section-title">📌 Hashtags</div>
                      <p className="bbf-app-detail__hash">{hashtags}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Screen 3 — Render */}
          {screen === 'render' && (
            <>
              <div className="bbf-app-screen-body">
                <div className="bbf-app-render">
                  <div className="bbf-app-render__status">
                    <span className="bbf-app-render__status-dot" />
                    Diseño renderizado con tu plantilla de marca
                  </div>
                  {renderImageUrl && (
                    <div className={`bbf-app-render__media ${reveal ? 'is-revealed' : ''}`}>
                      <Image
                        src={renderImageUrl}
                        alt={renderImageAlt}
                        fill
                        sizes="(max-width: 360px) 64vw, 231px"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="bbf-app-render__shimmer" aria-hidden="true" />
                    </div>
                  )}
                  <div className="bbf-app-render__cta-wrap">
                    <button
                      ref={publishBtnRef}
                      className={`bbf-app-render__publish ${publishing ? 'is-loading' : ''}`}
                      disabled={publishing}
                    >
                      {publishing ? (
                        <>
                          <span className="bbf-app-spin bbf-app-spin--white" aria-hidden="true" />{' '}
                          Publicando…
                        </>
                      ) : (
                        <>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M3 11l18-8-8 18-2.5-7.5L3 11z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                            />
                          </svg>
                          Publicar historia
                        </>
                      )}
                    </button>
                    {publishMeta && <div className="bbf-app-render__meta">{publishMeta}</div>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bottom tabs */}
          <div className="bbf-app-tabs" aria-hidden="true">
            {[
              {
                id: 'assets',
                label: 'Assets',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="6"
                      width="18"
                      height="14"
                      rx="2.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M8 6l1.2-2h5.6L16 6"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                id: 'content',
                label: 'Content',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                  </svg>
                ),
              },
              {
                id: 'briefs',
                label: 'Briefs',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                      const rad = (a * Math.PI) / 180;
                      return (
                        <circle
                          key={a}
                          cx={16 + Math.cos(rad) * 8.5}
                          cy={16 + Math.sin(rad) * 8.5}
                          r="3.4"
                        />
                      );
                    })}
                    <circle cx="16" cy="16" r="4.2" />
                  </svg>
                ),
              },
            ].map((tab) => {
              const active = screen === 'brief' ? tab.id === 'briefs' : tab.id === 'content';
              return (
                <div key={tab.id} className={`bbf-app-tab ${active ? 'is-active' : ''}`}>
                  {tab.icon}
                  <span className="bbf-app-tab__label">{tab.label}</span>
                </div>
              );
            })}
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

          {/* Published overlay */}
          <div className={`bbf-app-published ${published ? 'is-show' : ''}`}>
            <div className="bbf-app-published__card">
              <div className="bbf-app-published__check">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="bbf-app-published__title">¡Publicado!</div>
              <div className="bbf-app-published__body">Tu historia ya está en vivo.</div>
              {publishMeta && (
                <div className="bbf-app-published__tag">
                  <span className="bbf-app-published__tag-dot" />
                  {publishMeta}
                </div>
              )}
            </div>
          </div>

          {/* Virtual tap cursor */}
          <span
            className={`bbf-app-tap ${tap.show ? 'is-show' : ''} ${tap.press ? 'is-press' : ''}`}
            style={{ left: tap.x, top: tap.y }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
