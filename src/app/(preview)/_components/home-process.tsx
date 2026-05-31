import React from 'react';
import { Lissajous } from './home-capabilities';

const STEPS = [
  {
    id: '01',
    label: 'Aprende',
    title: 'El cerebro absorbe lo que tu empresa sabe operativamente.',
    body: 'Productos, voz, políticas, decisiones, historia. Una sola fuente de verdad, estructurada para que el sistema pueda usarla sin improvisar.',
    side: [
      'Catálogo + fichas',
      'Voz y tono',
      'Políticas y SLAs',
      'Decisiones pasadas',
      'Historia y contexto',
    ],
  },
  {
    id: '02',
    label: 'Decide',
    title: 'Cuando alguien lo consulta, recupera lo relevante y razona con criterio.',
    body: 'Si no sabe algo, lo declara. No inventa. Cada respuesta es trazable hasta su fuente — auditable, corregible, mejorable.',
    side: [
      'Recuperación dirigida',
      'Razonamiento con voz',
      'Trazabilidad por fuente',
      'Declara incertidumbre',
      'Escala a humano',
    ],
  },
  {
    id: '03',
    label: 'Ejecuta',
    title: 'La respuesta sale con tu voz exacta — en el canal que toque.',
    body: 'En WhatsApp, en una ficha de producto, en un email comercial, en una propuesta. Mismo conocimiento, todos tus canales.',
    side: ['WhatsApp · Instagram', 'Web · App', 'Email · Voz', 'CRM · ERP', 'Slack · Notion'],
  },
];

function StepsFlow() {
  return (
    <div className="flow" aria-hidden="true">
      <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="flow__svg">
        <defs>
          <linearGradient id="flow-track" x1="0" x2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.05" />
            <stop offset="0.5" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <line x1="6" y1="14" x2="94" y2="14" stroke="url(#flow-track)" strokeWidth="0.4" />
        <line
          x1="6"
          y1="14"
          x2="94"
          y2="14"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="0.2"
          strokeDasharray="0.6 0.8"
        />
        {[17, 50, 83].map((x, i) => (
          <g key={i}>
            <circle
              cx={x}
              cy="14"
              r="3.2"
              fill="var(--bg)"
              stroke="currentColor"
              strokeWidth="0.4"
            />
            <circle cx={x} cy="14" r="1.4" fill="currentColor" />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={'p' + i} r="0.7" fill="currentColor">
            <animate
              attributeName="cx"
              from="6"
              to="94"
              dur="5s"
              begin={`${i * 1.6}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="14;13;14"
              dur="5s"
              begin={`${i * 1.6}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0"
              keyTimes="0;0.05;0.95;1"
              dur="5s"
              begin={`${i * 1.6}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
      <div className="flow__labels">
        {[
          { n: '01', k: 'Aprende', meta: 'INGESTA · MEMORIA' },
          { n: '02', k: 'Decide', meta: 'RECUPERA · RAZONA' },
          { n: '03', k: 'Ejecuta', meta: 'CANAL · VOZ' },
        ].map((l) => (
          <div key={l.n} className="flow__label">
            <div className="mono-xs flow__label-num">{l.n}</div>
            <div className="flow__label-k">{l.k}</div>
            <div className="mono-xs flow__label-meta">{l.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="section" id="proceso">
      <div className="wrap">
        <div className="section__head reveal">
          <div className="section__head-l">
            <div className="eyebrow">§3 · Cómo funciona</div>
            <Lissajous a={5} b={4} delta={Math.PI / 4} duration={14} />
          </div>
          <div>
            <h2 className="h-display h2">
              Tres pasos. <br />
              <span style={{ color: 'var(--ink-muted)' }}>Una sola memoria al centro.</span>
            </h2>
          </div>
        </div>

        <div className="hiw reveal">
          <StepsFlow />
        </div>

        <ol className="hiw__steps">
          {STEPS.map((s, i) => (
            <li
              key={s.id}
              className="hiw__step reveal"
              style={{ '--reveal-delay': `${i * 120}ms` } as React.CSSProperties}
            >
              <div className="hiw__step-head">
                <span className="mono hiw__step-num">{s.id}</span>
                <span className="mono-xs hiw__step-lbl">paso</span>
                <span className="hiw__step-line" />
                <h3 className="h-display h6 hiw__step-name">{s.label}</h3>
              </div>
              <h4 className="h-display h5 hiw__step-title">{s.title}</h4>
              <p className="hiw__step-body">{s.body}</p>
              <ul className="hiw__step-side">
                {s.side.map((t) => (
                  <li key={t}>
                    <span className="mono-xs">{t}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <style>{`
        .hiw { margin: 0 auto clamp(56px, 8vw, 96px); max-width: 960px; }
        .flow { position: relative; color: var(--ink); padding: 24px 0 0; }
        .flow__svg { width: 100%; height: 56px; display: block; }
        .flow__labels { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 20px; }
        .flow__label { text-align: center; padding: 0 12px; }
        .flow__label:first-child { text-align: left; }
        .flow__label:last-child { text-align: right; }
        .flow__label-num { color: var(--ink-faint); margin-bottom: 6px; }
        .flow__label-k { font-family: var(--font-display); font-weight: 500; font-size: clamp(20px, 2.2vw, 28px); letter-spacing: -0.02em; color: var(--ink); line-height: 1; }
        .flow__label-meta { color: var(--ink-muted); margin-top: 8px; }
        @media (max-width: 640px) {
          .flow__svg { display: none; }
          .flow__labels { grid-template-columns: 1fr; gap: 16px; text-align: left; }
          .flow__label, .flow__label:first-child, .flow__label:last-child { text-align: left; padding: 0; border-left: 2px solid var(--ink); padding-left: 14px; }
        }
        .hiw__steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
        @media (max-width: 880px) { .hiw__steps { grid-template-columns: 1fr; } }
        .hiw__step { background: var(--bg); padding: clamp(24px, 3vw, 40px); display: flex; flex-direction: column; }
        .hiw__step-head { display: flex; align-items: center; gap: 12px; padding-bottom: 24px; }
        .hiw__step-num { font-size: 14px; color: var(--ink); font-weight: 500; }
        .hiw__step-lbl { color: var(--ink-muted); }
        .hiw__step-line { flex: 1; height: 1px; background: var(--line); }
        .hiw__step-name { text-transform: uppercase; letter-spacing: 0.06em; font-size: 12px; font-family: var(--font-mono); color: var(--ink); font-weight: 500; }
        .hiw__step-title { margin: 4px 0 16px; max-width: 22ch; }
        .hiw__step-body { color: var(--ink-muted); margin: 0 0 24px; flex: 1; font-size: var(--fs-body); line-height: 1.55; }
        .hiw__step-side { list-style: none; padding: 16px 0 0; margin: 0; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 6px; }
        .hiw__step-side .mono-xs { color: var(--ink-muted); }
      `}</style>
    </section>
  );
}
