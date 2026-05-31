import React from 'react';
import { Lissajous } from './home-capabilities';

export function CaseStudy() {
  const phases = [
    {
      k: 'Situación',
      n: '00',
      body: 'Sivar Films producía marcas con identidad fuerte pero cada canal vivía en silo. WhatsApp respondía una cosa. Instagram decía otra. La web tenía datos viejos. El equipo gastaba 3-4 horas diarias respondiendo lo mismo en cinco lugares.',
      tag: 'Antes',
    },
    {
      k: 'Construcción',
      n: '01',
      body: 'En 12 semanas montamos su cerebro: ingestamos catálogo, voz, políticas, historia. Conectamos WhatsApp Business, Instagram, web. Activamos generación de contenido desde brief. Configuramos workflows de reservas y pedidos.',
      tag: '12 semanas',
    },
    {
      k: 'Operación',
      n: '02',
      body: 'Hoy el cerebro atiende clientes los siete días, genera el contenido semanal de redes, registra reservas en sistema sin intervención humana. Sivar Films opera el cliente final. BBF mantiene y evoluciona el sistema.',
      tag: 'Hoy',
    },
  ];

  return (
    <section className="section" id="caso">
      <div className="wrap">
        <div className="section__head reveal">
          <div className="section__head-l">
            <div className="eyebrow">§4 · Caso</div>
            <Lissajous a={3} b={4} delta={Math.PI / 3} duration={11} />
          </div>
          <div>
            <h2 className="h-display h2">
              El cerebro <br />
              <span style={{ color: 'var(--ink-muted)' }}>en producción.</span>
            </h2>
            <p className="lead" style={{ marginTop: 28, maxWidth: '52ch' }}>
              <strong style={{ fontWeight: 500, color: 'var(--ink)' }}>Sivar Brains</strong> es el
              primer cerebro de marca construido por Brand Brain Foundry. Joint venture con Sivar
              Films en El Salvador. Operando hoy.
            </p>
          </div>
        </div>

        <div className="case__media reveal">
          <div className="case__media-head">
            <div className="case__media-chip">
              <span className="case__media-dot" />
              <span className="mono-xs">SIVAR-BRAINS · WhatsApp Business · live</span>
            </div>
            <span className="mono-xs" style={{ color: 'var(--ink-muted)' }}>
              captura · 23:04 viernes
            </span>
          </div>
          <div className="case__media-body">
            {/* Opción B: div placeholder — mismas dimensiones que el image-slot original */}
            <div
              style={
                {
                  width: '100%',
                  aspectRatio: '16 / 9',
                  background: 'var(--bg-elev)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--ink-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                } as React.CSSProperties
              }
            >
              Captura de WhatsApp real / video corto del cerebro respondiendo
            </div>
          </div>
        </div>

        <div className="case__phases">
          {phases.map((p, i) => (
            <article
              key={p.k}
              className="case__phase reveal"
              style={{ '--reveal-delay': `${i * 100}ms` } as React.CSSProperties}
            >
              <div className="case__phase-head">
                <span className="mono case__phase-n">{p.n}</span>
                <span className="case__phase-line" />
                <span className="mono-xs case__phase-tag">{p.tag}</span>
              </div>
              <h3 className="h-display h4 case__phase-title">{p.k}.</h3>
              <p className="case__phase-body">{p.body}</p>
            </article>
          ))}
        </div>

        <figure className="case__quote reveal">
          <svg
            className="case__quote-mark"
            width="48"
            height="36"
            viewBox="0 0 48 36"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 36V20C0 8.95 8.95 0 20 0V8C13.37 8 8 13.37 8 20H20V36H0ZM28 36V20C28 8.95 36.95 0 48 0V8C41.37 8 36 13.37 36 20H48V36H28Z"
              fill="currentColor"
            />
          </svg>
          <blockquote>
            <p>
              Un viernes a las 11pm, un cliente abre WhatsApp y pregunta qué vino marida bien con la
              entraña. La marca responde — con voz, con criterio, con el conocimiento aprobado.
            </p>
            <p>Ese mismo conocimiento alimenta el contenido que se publica en redes el sábado.</p>
          </blockquote>
          <figcaption className="mono-xs">— Equipo BBF · Sivar Brains, en operación</figcaption>
        </figure>

        <div className="case__cta reveal">
          <a href="#" className="link-arrow">
            Leer el caso completo <span>→</span>
          </a>
        </div>
      </div>

      <style>{`
        .case__media { border: 1px solid var(--line); border-radius: 14px; overflow: hidden; background: var(--bg); margin-bottom: clamp(48px, 6vw, 80px); }
        .case__media-head { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid var(--line); background: var(--bg); }
        .case__media-chip { display: inline-flex; align-items: center; gap: 8px; }
        .case__media-dot { width: 7px; height: 7px; border-radius: 50%; background: #16a34a; animation: pulse-g 2s ease-out infinite; }
        @keyframes pulse-g { 0% { box-shadow: 0 0 0 0 rgba(22,163,74,0.4); } 70% { box-shadow: 0 0 0 8px rgba(22,163,74,0); } }
        .case__media-body { background: var(--bg-elev); }
        .case__phases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; margin-bottom: clamp(48px, 6vw, 80px); }
        @media (max-width: 880px) { .case__phases { grid-template-columns: 1fr; } }
        .case__phase { background: var(--bg); padding: clamp(24px, 3vw, 40px); }
        .case__phase-head { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .case__phase-n { color: var(--ink); }
        .case__phase-line { flex: 1; height: 1px; background: var(--line); }
        .case__phase-tag { color: var(--ink-muted); }
        .case__phase-title { margin: 0 0 14px; }
        .case__phase-body { color: var(--ink-muted); margin: 0; max-width: 32ch; line-height: 1.55; }
        .case__quote { margin: 0 0 32px; padding: clamp(40px, 6vw, 72px) clamp(32px, 6vw, 80px); border: 1px solid var(--line); background: var(--bg-elev); border-radius: 14px; position: relative; max-width: 920px; }
        .case__quote-mark { color: var(--ink-faint); margin-bottom: 18px; }
        .case__quote blockquote { margin: 0; font-family: var(--font-display); font-size: clamp(20px, 2.4vw, 30px); line-height: 1.3; letter-spacing: -0.02em; color: var(--ink); font-weight: 400; }
        .case__quote blockquote p { margin: 0 0 18px; text-wrap: balance; }
        .case__quote blockquote p:last-child { margin-bottom: 24px; color: var(--ink-muted); }
        .case__quote figcaption { color: var(--ink-muted); }
        .case__cta { display: flex; justify-content: flex-start; }
      `}</style>
    </section>
  );
}
