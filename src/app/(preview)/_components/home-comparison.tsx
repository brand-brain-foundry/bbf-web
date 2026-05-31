import React from 'react';
import { Lissajous } from './home-capabilities';

const COLS = [
  { id: 'agencia', name: 'Agencia', sub: 'Encargos por proyecto' },
  { id: 'consultora', name: 'Consultora', sub: 'Diagnósticos, deliverables' },
  { id: 'saas', name: 'SaaS', sub: 'Producto compartido' },
  { id: 'cerebro', name: 'Cerebro de marca', sub: 'Sistema propio', highlight: true },
];

const ROWS = [
  { k: 'Qué entrega', vals: ['Campañas', 'PowerPoints', 'Software', 'Sistema propio'] },
  { k: 'Quién lo opera', vals: ['Su equipo', 'Tú, después', 'Su plataforma', 'Tu marca, sola'] },
  {
    k: 'Aprende tu empresa',
    vals: [
      { state: 'no', text: 'No' },
      { state: 'mid', text: 'Solo durante el proyecto' },
      { state: 'no', text: 'No, es genérico' },
      { state: 'yes', text: 'Sí, una vez — y para siempre' },
    ],
  },
  {
    k: 'Trabaja 24/7',
    vals: [
      { state: 'no', text: 'No' },
      { state: 'no', text: 'No' },
      { state: 'yes', text: 'Sí' },
      { state: 'yes', text: 'Sí' },
    ],
  },
  {
    k: 'Voz consistente',
    vals: [
      { state: 'mid', text: 'Depende' },
      { state: 'no', text: 'No aplica' },
      { state: 'no', text: 'No' },
      { state: 'yes', text: 'Exacta, siempre' },
    ],
  },
  { k: 'Propiedad del entregable', vals: ['Suyo', 'Suyo', 'Suyo', { state: 'yes', text: 'Tuyo' }] },
  {
    k: 'Sin lock-in',
    vals: [
      { state: 'yes', text: 'Sí (te vas)' },
      { state: 'yes', text: 'Sí (te vas)' },
      { state: 'no', text: 'No' },
      { state: 'yes', text: 'Sí (es tuyo)' },
    ],
  },
  {
    k: 'Escala sin contratar',
    vals: [
      { state: 'no', text: 'No' },
      { state: 'no', text: 'No' },
      { state: 'yes', text: 'Sí' },
      { state: 'yes', text: 'Sí' },
    ],
  },
];

type CellVal = string | { state: string; text: string };

function Cell({ v, highlight }: { v: CellVal; highlight?: boolean }) {
  if (typeof v === 'string') {
    return <div className={`cmp__cell${highlight ? 'is-hl' : ''}`}>{v}</div>;
  }
  const icon: Record<string, React.ReactNode> = {
    yes: (
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path
          d="M2 7.5 L6 11 L12 3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    no: (
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path
          d="M3 3 L11 11 M11 3 L3 11"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
    mid: (
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M2 7 H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  };
  return (
    <div className={`cmp__cell cmp__cell--${v.state}${highlight ? 'is-hl' : ''}`}>
      <span className="cmp__cell-icon" aria-hidden="true">
        {icon[v.state]}
      </span>
      <span>{v.text}</span>
    </div>
  );
}

export function Comparison() {
  return (
    <section className="section section--shade" id="por-que">
      <div className="wrap">
        <div className="section__head reveal">
          <div className="section__head-l">
            <div className="eyebrow">§5 · Por qué</div>
            <Lissajous a={5} b={6} delta={Math.PI / 6} duration={16} />
          </div>
          <div>
            <h2 className="h-display h2">
              Tu marca ya no necesita <br />
              <span style={{ color: 'var(--ink-muted)' }}>
                más agencias, ni más SaaS, ni más consultoras.
              </span>
            </h2>
            <p className="lead" style={{ marginTop: 28, maxWidth: '54ch' }}>
              Una comparación honesta. No reemplazamos a tu equipo — le devolvemos las horas que hoy
              gasta respondiendo lo mismo en cinco lugares.
            </p>
          </div>
        </div>

        <div className="cmp reveal">
          <div
            className="cmp__grid"
            role="table"
            aria-label="Comparación entre agencia, consultora, SaaS y cerebro de marca"
          >
            <div className="cmp__row cmp__row--head" role="row">
              <div className="cmp__rowhead cmp__cell--head" role="columnheader">
                <span className="mono-xs">Dimensión</span>
              </div>
              {COLS.map((c) => (
                <div
                  key={c.id}
                  className={`cmp__cell--head${c.highlight ? 'is-hl' : ''}`}
                  role="columnheader"
                >
                  {c.highlight && <span className="cmp__crown mono-xs">▼ BBF</span>}
                  <div className="cmp__col-name">{c.name}</div>
                  <div className="mono-xs cmp__col-sub">{c.sub}</div>
                </div>
              ))}
            </div>
            {ROWS.map((r, ri) => (
              <div key={r.k} className="cmp__row" role="row">
                <div className="cmp__rowhead" role="rowheader">
                  <span className="mono cmp__rowhead-num">{String(ri + 1).padStart(2, '0')}</span>
                  <span>{r.k}</span>
                </div>
                {r.vals.map((v, ci) => (
                  <Cell key={ci} v={v} highlight={COLS[ci].highlight} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="cmp__epilogue reveal">
          <div className="cmp__epilogue-l">
            <h3 className="h-display h4">La diferencia operativa</h3>
          </div>
          <div className="cmp__epilogue-r">
            <p>
              Una agencia te entrega campañas hasta que terminás el contrato. Una consultora te
              entrega documentos y se va. Un SaaS te da acceso a un producto que también usan tus
              competidores.
            </p>
            <p>
              <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>
                Un cerebro de marca es tuyo
              </strong>
              , vive en tu infraestructura, y opera con tu voz exacta en cada canal donde tu marca
              aparece.
            </p>
            <p style={{ color: 'var(--ink)' }}>
              No reemplazamos a tu equipo. Le devolvemos las horas que hoy gasta respondiendo lo
              mismo en cinco lugares.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .section--shade { background: var(--bg-elev); }
        .cmp { border: 1px solid var(--line); border-radius: 16px; overflow: hidden; background: var(--bg); position: relative; }
        .cmp__grid { display: grid; grid-template-columns: minmax(180px, 1.2fr) repeat(4, 1fr); }
        @media (max-width: 920px) { .cmp__grid { grid-template-columns: minmax(140px, 1fr) repeat(4, minmax(0, 1fr)); font-size: 13px; } }
        @media (max-width: 640px) { .cmp__grid { overflow-x: auto; display: block; } .cmp__row { display: grid; grid-template-columns: minmax(120px,1fr) repeat(4, minmax(0,1fr)); min-width: 720px; } }
        .cmp__row { display: contents; }
        .cmp__row > * { padding: 18px 20px; border-top: 1px solid var(--line); display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--ink-soft); background: var(--bg); min-height: 64px; }
        @media (max-width: 920px) { .cmp__row > * { padding: 14px 12px; } }
        .cmp__row--head > * { border-top: 0; }
        .cmp__rowhead { background: var(--bg-elev); color: var(--ink); font-weight: 500; letter-spacing: -0.005em; font-family: var(--font-body); }
        .cmp__rowhead-num { color: var(--ink-faint); font-size: 11px; margin-right: 4px; }
        .cmp__cell--head { background: var(--bg-elev); flex-direction: column; align-items: flex-start; gap: 4px; position: relative; padding-top: 26px !important; padding-bottom: 22px !important; }
        .cmp__col-name { font-family: var(--font-display); font-weight: 500; font-size: 18px; letter-spacing: -0.015em; color: var(--ink); }
        .cmp__col-sub { color: var(--ink-muted); }
        .cmp__cell--head.is-hl, .cmp__cell.is-hl { background: var(--highlight); color: var(--ink); position: relative; }
        .cmp__cell--head.is-hl::before { content: ''; position: absolute; inset: 0; border-left: 1px solid var(--ink); border-right: 1px solid var(--ink); pointer-events: none; }
        .cmp__cell.is-hl { border-left: 1px solid var(--ink-faint); border-right: 1px solid var(--ink-faint); font-weight: 500; }
        .cmp__row:last-child .cmp__cell.is-hl { border-bottom: 1px solid var(--ink); }
        .cmp__crown { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--bg); padding: 4px 12px; border-radius: 999px; font-size: 10px; letter-spacing: 0.08em; }
        .cmp__cell--head.is-hl::after { content: ''; position: absolute; inset: 0 0 auto 0; height: 2px; background: var(--ink); }
        .cmp__cell { display: flex; align-items: center; gap: 8px; }
        .cmp__cell-icon { flex-shrink: 0; width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--bg-elev); color: var(--ink-muted); }
        .cmp__cell--yes .cmp__cell-icon { background: var(--ink); color: var(--bg); }
        .cmp__cell--no .cmp__cell-icon { background: var(--bg-elev); color: var(--ink-faint); }
        .cmp__cell--mid .cmp__cell-icon { background: var(--bg-elev); color: var(--ink-muted); }
        .cmp__cell--no { color: var(--ink-muted); }
        .cmp__epilogue { margin-top: clamp(48px, 6vw, 80px); display: grid; grid-template-columns: 1fr 1.4fr; gap: clamp(24px, 5vw, 64px); padding-top: 48px; border-top: 1px solid var(--line); }
        @media (max-width: 760px) { .cmp__epilogue { grid-template-columns: 1fr; } }
        .cmp__epilogue-l h3 { margin: 0; max-width: 18ch; }
        .cmp__epilogue-r p { color: var(--ink-muted); font-size: var(--fs-body-lg); line-height: 1.55; max-width: 56ch; margin: 0 0 18px; }
      `}</style>
    </section>
  );
}
