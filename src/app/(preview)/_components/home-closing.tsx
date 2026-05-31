import React from 'react';

export function Closing() {
  return (
    <section className="closing" id="cierre">
      <div className="wrap closing__wrap">
        <div className="closing__meta reveal">
          <span className="mono-xs">§7 · Cierre</span>
          <span className="closing__rule" />
          <span className="mono-xs">Brand Brain Foundry · 2026</span>
        </div>

        <h2 className="h-display closing__title reveal">
          Tu marca aprende una vez.
          <br />
          <span className="closing__title-em">Te representa en todos lados.</span>
        </h2>

        <div className="closing__cta reveal">
          <a href="#cierre" className="btn btn--primary closing__btn">
            Sentémonos a pensar <span className="btn__arrow">→</span>
          </a>
          <div className="mono-xs closing__note">
            Diagnóstico cerrado · 2-3 semanas · sin compromiso de continuar
          </div>
        </div>

        <div className="closing__signature reveal">
          <svg viewBox="0 0 32 32" width="22" height="22" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="31" height="31" rx="7" stroke="currentColor" />
            <circle cx="16" cy="16" r="5" fill="currentColor" />
            <circle cx="6" cy="6" r="1.4" fill="currentColor" />
            <circle cx="26" cy="6" r="1.4" fill="currentColor" />
            <circle cx="6" cy="26" r="1.4" fill="currentColor" />
            <circle cx="26" cy="26" r="1.4" fill="currentColor" />
            <path
              d="M10 10 L13 13 M22 10 L19 13 M10 22 L13 19 M22 22 L19 19"
              stroke="currentColor"
              strokeWidth="0.9"
            />
          </svg>
          <div>
            <div className="closing__sig-name">Brand Brain Foundry</div>
            <div className="mono-xs closing__sig-tag">No hay urgencia. Hay método.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { lbl: 'Foundry', items: ['Manifiesto', 'Método', 'Casos', 'Lab', 'Equipo'] },
    { lbl: 'Sistema', items: ['Capacidades', 'Integraciones', 'Seguridad', 'Documentación'] },
    {
      lbl: 'Contacto',
      items: ['hola@brandbrain.foundry', 'Agendar diagnóstico', 'WhatsApp directo', 'LinkedIn'],
    },
  ];
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft__grid">
          <div className="ft__brand">
            <div className="ft__brand-mark">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect x="0.5" y="0.5" width="31" height="31" rx="7" stroke="currentColor" />
                <circle cx="16" cy="16" r="5" fill="currentColor" />
                <circle cx="6" cy="6" r="1.4" fill="currentColor" />
                <circle cx="26" cy="6" r="1.4" fill="currentColor" />
                <circle cx="6" cy="26" r="1.4" fill="currentColor" />
                <circle cx="26" cy="26" r="1.4" fill="currentColor" />
                <path
                  d="M10 10 L13 13 M22 10 L19 13 M10 22 L13 19 M22 22 L19 19"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
              </svg>
              <div>
                <div className="ft__brand-name">Brand Brain Foundry</div>
                <div className="mono-xs ft__brand-sub">
                  Cerebros de marca · construidos a medida
                </div>
              </div>
            </div>
            <p className="ft__pitch">
              Construimos el cerebro operativo de marcas. Aprende una vez, responde en todos lados,
              con tu voz exacta.
            </p>
          </div>
          <div className="ft__cols">
            {cols.map((c) => (
              <div key={c.lbl} className="ft__col">
                <div className="mono-xs ft__col-lbl">{c.lbl}</div>
                <ul>
                  {c.items.map((item) => (
                    <li key={item}>
                      <a href="#">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="ft__bottom">
          <div className="mono-xs">
            © 2026 Brand Brain Foundry · Joint venture: Sivar Brains × Sivar Films · El Salvador
          </div>
          <div className="mono-xs ft__bottom-r">
            <span className="ft__live" /> Cerebros activos · 1<span className="ft__sep">·</span>
            v4.0 · Home
          </div>
        </div>
      </div>

      <style>{`
        .closing {
          padding: clamp(120px, 18vw, 220px) 0 clamp(96px, 12vw, 160px);
          border-top: 1px solid var(--line);
          position: relative;
          overflow: hidden;
        }
        .closing::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--ink) 6%, transparent) 0%, transparent 60%);
          pointer-events: none;
        }
        .closing__wrap {
          text-align: center;
          position: relative;
          display: flex; flex-direction: column; align-items: center; gap: clamp(48px, 7vw, 96px);
        }
        .closing__meta {
          display: flex; align-items: center; gap: 16px;
          color: var(--ink-muted);
        }
        .closing__rule { width: 80px; height: 1px; background: var(--line); }
        .closing__title {
          font-size: clamp(48px, 8vw, 112px);
          letter-spacing: -0.045em;
          line-height: 0.98;
          font-weight: 500;
          margin: 0;
          max-width: 16ch;
          text-wrap: balance;
        }
        .closing__title-em { color: var(--ink-muted); }
        .closing__cta { display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .closing__btn { padding: 18px 30px; font-size: 16px; }
        .closing__note { color: var(--ink-muted); }
        .closing__signature {
          display: inline-flex; align-items: center; gap: 14px;
          padding: 16px 22px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: var(--bg);
        }
        .closing__sig-name { font-family: var(--font-display); font-weight: 500; font-size: 14px; letter-spacing: -0.01em; }
        .closing__sig-tag { color: var(--ink-muted); font-style: italic; }

        .ft {
          background: var(--bg-elev);
          border-top: 1px solid var(--line);
          padding: clamp(64px, 8vw, 96px) 0 32px;
        }
        .ft__grid {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: clamp(40px, 6vw, 80px);
          padding-bottom: 64px;
          border-bottom: 1px solid var(--line);
        }
        @media (max-width: 880px) { .ft__grid { grid-template-columns: 1fr; } }
        .ft__brand-mark { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .ft__brand-name { font-family: var(--font-display); font-weight: 500; font-size: 16px; letter-spacing: -0.01em; }
        .ft__brand-sub { color: var(--ink-muted); margin-top: 2px; }
        .ft__pitch { color: var(--ink-muted); max-width: 36ch; font-size: 15px; line-height: 1.55; margin: 0; }
        .ft__cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        @media (max-width: 600px) { .ft__cols { grid-template-columns: 1fr 1fr; } }
        .ft__col-lbl { color: var(--ink-faint); margin-bottom: 16px; }
        .ft__col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .ft__col a { color: var(--ink-soft); font-size: 14px; transition: color 0.2s; }
        .ft__col a:hover { color: var(--ink); }
        .ft__bottom {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 24px;
          color: var(--ink-muted);
          flex-wrap: wrap; gap: 12px;
        }
        .ft__bottom-r { display: inline-flex; align-items: center; gap: 8px; }
        .ft__live {
          width: 6px; height: 6px; border-radius: 50%;
          background: #16a34a;
          display: inline-block;
          animation: pulse-g 2s ease-out infinite;
        }
        .ft__sep { opacity: 0.4; padding: 0 4px; }
      `}</style>
    </footer>
  );
}
