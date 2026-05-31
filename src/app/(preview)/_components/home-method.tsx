import React from 'react';
import { Lissajous } from './home-capabilities';

const SERVICES = [
  {
    id: '01',
    name: 'Diagnóstico',
    range: '2 – 3 semanas',
    commit: 'Alcance cerrado · sin recurrencia',
    body: 'Auditamos qué sabe tu empresa, dónde vive ese conocimiento, qué canales operan hoy, qué se puede construir y qué no.',
    deliverables: [
      'Blueprint del cerebro',
      'Roadmap de construcción',
      'Propuesta cerrada de Build',
      'Si no es viable, lo decimos',
    ],
  },
  {
    id: '02',
    name: 'Build',
    range: '8 – 24 semanas',
    commit: 'Según alcance · sistema propietario',
    body: 'Construimos el cerebro: ingestamos conocimiento, configuramos voz, integramos canales, activamos capacidades, probamos en staging, lanzamos progresivamente.',
    deliverables: [
      'Ingesta de conocimiento operativo',
      'Voz, políticas, criterio configurados',
      'Integraciones de canales y stack',
      'Documentación + transferencia operativa',
    ],
  },
  {
    id: '03',
    name: 'Retainer',
    range: 'Mensual · renovable',
    commit: 'Sin lock-in · cancelable en cualquier momento',
    body: 'Mantenimiento, evolución y mejora continua del cerebro construido. Nuevos casos de uso, nuevos canales, nuevas capacidades según evoluciona el negocio.',
    deliverables: [
      'Mejora continua del cerebro',
      'Nuevos casos de uso',
      'Nuevos canales y capacidades',
      'El cerebro mejora mes a mes',
    ],
  },
];

export function Method() {
  return (
    <section className="section" id="metodo">
      <div className="wrap">
        <div className="section__head reveal">
          <div className="section__head-l">
            <div className="eyebrow">§6 · Método</div>
            <Lissajous a={2} b={3} delta={Math.PI / 2} duration={10} />
          </div>
          <div>
            <h2 className="h-display h2">
              Tres servicios coordinados. <br />
              <span style={{ color: 'var(--ink-muted)' }}>Sin sorpresas.</span>
            </h2>
          </div>
        </div>

        <div className="mth__bar reveal" aria-hidden="true">
          {SERVICES.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="mth__bar-node">
                <span className="mth__bar-dot" />
                <span className="mono-xs">
                  {s.id} · {s.name}
                </span>
              </div>
              {i < SERVICES.length - 1 && <div className="mth__bar-line" />}
            </React.Fragment>
          ))}
        </div>

        <div className="mth__cards">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              className="mth__card reveal"
              style={{ '--reveal-delay': `${i * 100}ms` } as React.CSSProperties}
            >
              <div className="mth__card-head">
                <span className="mono mth__card-num">{s.id}</span>
                <h3 className="h-display h4 mth__card-name">{s.name}</h3>
              </div>
              <div className="mth__card-meta">
                <div>
                  <div className="mono-xs mth__card-lbl">Duración</div>
                  <div className="mth__card-val">{s.range}</div>
                </div>
                <div>
                  <div className="mono-xs mth__card-lbl">Compromiso</div>
                  <div className="mth__card-val">{s.commit}</div>
                </div>
              </div>
              <p className="mth__card-body">{s.body}</p>
              <ul className="mth__card-list">
                {s.deliverables.map((d) => (
                  <li key={d}>
                    <span className="mth__check" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 10 10">
                        <path
                          d="M1 5 L4 8 L9 1.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          fill="none"
                        />
                      </svg>
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <figure className="mth__quote reveal">
          <blockquote className="h-display h2">
            No hay urgencia.
            <br />
            <span style={{ color: 'var(--ink-muted)' }}>Hay método.</span>
          </blockquote>
          <figcaption className="mono-xs">Canon BBF · 01</figcaption>
        </figure>

        <div className="mth__cta reveal">
          <a href="#" className="link-arrow">
            Conocer el método completo <span>→</span>
          </a>
        </div>
      </div>

      <style>{`
        .mth__bar { display: flex; align-items: center; gap: 16px; margin-bottom: clamp(40px, 5vw, 64px); padding: 20px 24px; border: 1px solid var(--line); border-radius: 999px; background: var(--bg); }
        .mth__bar-node { display: flex; align-items: center; gap: 10px; color: var(--ink); }
        .mth__bar-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ink); }
        .mth__bar-line { flex: 1; height: 1px; background: var(--ink); opacity: 0.3; background-image: linear-gradient(90deg, var(--ink) 50%, transparent 50%); background-size: 6px 1px; background-repeat: repeat-x; }
        @media (max-width: 720px) { .mth__bar { flex-direction: column; align-items: stretch; border-radius: 14px; gap: 12px; } .mth__bar-line { height: 16px; width: 1px; align-self: center; background-image: linear-gradient(0deg, var(--ink) 50%, transparent 50%); background-size: 1px 6px; } }
        .mth__cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; margin-bottom: clamp(80px, 10vw, 140px); }
        @media (max-width: 880px) { .mth__cards { grid-template-columns: 1fr; } }
        .mth__card { background: var(--bg); padding: clamp(28px, 3.5vw, 44px); display: flex; flex-direction: column; }
        .mth__card-head { display: flex; align-items: baseline; gap: 14px; padding-bottom: 24px; border-bottom: 1px solid var(--line); margin-bottom: 24px; }
        .mth__card-num { color: var(--ink-muted); }
        .mth__card-name { margin: 0; }
        .mth__card-meta { display: grid; grid-template-columns: 1fr; gap: 14px; margin-bottom: 24px; }
        .mth__card-lbl { color: var(--ink-faint); margin-bottom: 4px; }
        .mth__card-val { color: var(--ink); font-weight: 500; font-size: 15px; letter-spacing: -0.005em; }
        .mth__card-body { color: var(--ink-muted); font-size: var(--fs-body-lg); line-height: 1.55; margin: 0 0 24px; flex: 1; }
        .mth__card-list { list-style: none; padding: 20px 0 0; margin: 0; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 10px; }
        .mth__card-list li { display: grid; grid-template-columns: 18px 1fr; gap: 10px; font-size: 14px; color: var(--ink-soft); }
        .mth__check { color: var(--ink); margin-top: 4px; }
        .mth__quote { margin: 0 0 48px; padding: clamp(48px, 8vw, 96px) clamp(32px, 6vw, 80px); border: 1px solid var(--line); background: var(--bg-elev); border-radius: 16px; text-align: center; }
        .mth__quote blockquote { margin: 0; }
        .mth__quote figcaption { margin-top: 32px; color: var(--ink-muted); letter-spacing: 0.08em; }
        .mth__cta { display: flex; justify-content: flex-start; }
      `}</style>
    </section>
  );
}
