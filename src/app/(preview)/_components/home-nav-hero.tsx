'use client';

import React from 'react';

export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__inner wrap">
        <a href="#top" className="nav__brand" aria-label="Brand Brain Foundry">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="21" height="21" rx="5" stroke="currentColor" />
            <circle cx="11" cy="11" r="3" fill="currentColor" />
            <circle cx="4" cy="4" r="1" fill="currentColor" />
            <circle cx="18" cy="4" r="1" fill="currentColor" />
            <circle cx="4" cy="18" r="1" fill="currentColor" />
            <circle cx="18" cy="18" r="1" fill="currentColor" />
            <path
              d="M7.5 7.5 L10 10 M14.5 7.5 L12 10 M7.5 14.5 L10 12 M14.5 14.5 L12 12"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </svg>
          <span>Brand Brain Foundry</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#capacidades">Capacidades</a>
          <a href="#proceso">Cómo funciona</a>
          <a href="#caso">Caso</a>
          <a href="#metodo">Método</a>
        </nav>
        <div className="nav__cta">
          <a href="#hero-status" className="nav__status" aria-live="polite">
            <span className="nav__dot" /> Cerebro activo · Sivar Brains
          </a>
          <a href="#cierre" className="btn btn--primary nav__btn">
            Sentémonos a pensar <span className="btn__arrow">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__grid wrap">
        <div className="hero__head">
          <h1 className="hero__title h-display h1 reveal">
            Tú diriges. <br />
            <span className="hero__title-soft">Tu marca ejecuta.</span>
          </h1>

          <div
            className="hero__lede reveal"
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            <p className="lead">
              Construimos el cerebro de marca de tu empresa: responde a tus clientes, genera tu
              contenido, automatiza tus procesos, aprende con cada uso.
              <br />
              <span className="hero__lede-em">Con tu voz, en todos tus canales.</span>
            </p>
            <div className="hero__ctas">
              <a href="#proceso" className="btn btn--primary">
                Verlo funcionar <span className="btn__arrow">→</span>
              </a>
              <a href="#metodo" className="btn btn--ghost">
                Conocer el método <span className="btn__arrow">→</span>
              </a>
            </div>
          </div>
        </div>

        <div
          className="hero__media reveal"
          style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
        >
          <div className="hero__media-frame">
            <div className="hero__media-chrome">
              <span className="mono-xs">// brand-brain.foundry · live feed</span>
              <span className="mono-xs hero__rec">
                <span className="rec-dot" /> REC&nbsp;00:42
              </span>
            </div>
            <div className="hero__video-shell">
              <video
                className="hero__video"
                controls
                playsInline
                muted
                preload="metadata"
                poster=""
              ></video>
              <div className="hero__video-empty" aria-hidden="true">
                <div className="hero__video-empty-mark">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="11" r="10.5" stroke="currentColor" strokeOpacity="0.4" />
                    <path d="M8.5 7 L15 11 L8.5 15 Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="mono-xs hero__video-empty-msg">Video del cerebro en acción</div>
              </div>
            </div>
            <div className="hero__media-foot">
              <div>
                <div className="mono-xs" style={{ color: 'var(--ink-muted)' }}>
                  Demostración
                </div>
                <div className="mono" style={{ marginTop: 4 }}>
                  00 · Cerebro respondiendo en WhatsApp, generando un post de Instagram y agendando
                  una reserva — en tiempo real.
                </div>
              </div>
            </div>
          </div>

          <div className="hero__ticker" aria-hidden="true">
            <div className="hero__ticker-track">
              {[
                'WhatsApp Business · activo',
                'Instagram DM · activo',
                'CRM HubSpot · sync',
                'Memoria de marca · 2,143 nodos',
                'Última publicación · hace 14 min',
                'Voz · consistente 99.2%',
                'Decisiones hoy · 312',
                'Sin lock-in · contrato tuyo',
              ]
                .concat([
                  'WhatsApp Business · activo',
                  'Instagram DM · activo',
                  'CRM HubSpot · sync',
                  'Memoria de marca · 2,143 nodos',
                ])
                .map((t, i) => (
                  <span key={i} className="hero__ticker-item">
                    <span className="hero__ticker-dot" />
                    {t}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Hero ── */
        .hero {
          padding-top: clamp(96px, 11vw, 132px);
          padding-bottom: clamp(48px, 6vw, 96px);
          border-top: 0 !important;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, var(--line-soft) 1px, transparent 1px);
          background-size: calc(100% / 12) 100%;
          opacity: 0.4;
          pointer-events: none;
          mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
        }
        .hero__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(28px, 3.5vw, 48px);
          position: relative;
        }
        .hero__head {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: clamp(32px, 6vw, 96px);
          align-items: end;
        }
        @media (max-width: 920px) {
          .hero__head { grid-template-columns: 1fr; gap: 24px; align-items: start; }
        }
        .hero__title {
          font-size: clamp(48px, 7.4vw, 104px);
          font-weight: 500;
          line-height: 0.94;
          letter-spacing: -0.045em;
          margin: 0;
        }
        .hero__title-soft { color: var(--ink-muted); }
        .hero__lede {
          display: flex; flex-direction: column; gap: 20px;
          align-items: flex-start;
        }
        .hero__lede .lead { max-width: 38ch; font-size: clamp(16px, 1.4vw, 18px); }
        .hero__lede-em { color: var(--ink); font-weight: 500; }
        .hero__ctas {
          display: flex; gap: 10px; flex-wrap: wrap;
        }

        /* Media frame */
        .hero__media {
          margin-top: 24px;
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          background: var(--bg-elev);
        }
        .hero__media-frame { position: relative; }
        .hero__media-chrome {
          display: flex; justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--line);
          background: var(--bg);
          color: var(--ink-muted);
        }
        .hero__rec { color: var(--ink); display: inline-flex; align-items: center; gap: 6px; }
        .rec-dot {
          width: 6px; height: 6px; background: #ef4444; border-radius: 50%;
          animation: pulse-red 1.6s ease-in-out infinite;
        }
        .hero__media-foot {
          display: flex; justify-content: space-between; align-items: center; gap: 24px;
          padding: 16px 20px;
          border-top: 1px solid var(--line);
          background: var(--bg);
        }

        /* Video player */
        .hero__video-shell {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: var(--bg-deep);
          overflow: hidden;
        }
        .hero__video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          display: block;
          background: var(--bg-deep);
        }
        .hero__video:not([poster]):not(:focus-within) + .hero__video-empty,
        .hero__video[poster=""] + .hero__video-empty {
          opacity: 1;
        }
        .hero__video-empty {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px;
          padding: 24px;
          text-align: center;
          color: var(--ink-muted);
          pointer-events: none;
          background:
            radial-gradient(ellipse at 50% 40%, color-mix(in srgb, var(--ink) 6%, transparent), transparent 70%),
            repeating-linear-gradient(45deg, transparent 0 12px, color-mix(in srgb, var(--ink) 2%, transparent) 12px 13px);
          opacity: 1;
          transition: opacity 0.3s var(--ease-soft);
        }
        .hero__video-empty-mark {
          color: var(--ink);
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: var(--bg);
          display: inline-flex; align-items: center; justify-content: center;
        }
        .hero__video-empty-msg {
          max-width: 44ch;
          line-height: 1.5;
          letter-spacing: 0.02em;
        }
        .hero__video[src] ~ .hero__video-empty,
        .hero__video-shell:has(video > source) .hero__video-empty {
          display: none;
        }

        /* Ticker */
        .hero__ticker {
          overflow: hidden;
          border-top: 1px solid var(--line);
          padding-block: 12px;
          background: var(--bg);
        }
        .hero__ticker-track {
          display: flex; gap: 36px;
          animation: marquee 50s linear infinite;
          white-space: nowrap;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink-muted);
          letter-spacing: 0.02em;
        }
        .hero__ticker-item {
          display: inline-flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }
        .hero__ticker-dot {
          width: 4px; height: 4px; background: var(--ink); border-radius: 50%; opacity: 0.4;
        }
        @keyframes pulse-red {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
