import React from 'react';

// Lissajous — exported for use in all other sections
export function Lissajous({
  a = 3,
  b = 2,
  delta = Math.PI / 2,
  size = 96,
  duration = 12,
  dotR = 2.4,
}: {
  a?: number;
  b?: number;
  delta?: number;
  size?: number;
  duration?: number;
  dotR?: number;
}) {
  const N = 360;
  const pad = dotR + 1.5;
  const r = (size - pad * 2) / 2;
  const cx = size / 2,
    cy = size / 2;
  let d = '';
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2 * Math.PI;
    const x = (cx + Math.sin(a * t + delta) * r).toFixed(2);
    const y = (cy + Math.sin(b * t) * r).toFixed(2);
    d += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="liss"
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeOpacity="0.22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle r={dotR} fill="currentColor">
        <animateMotion dur={`${duration}s`} repeatCount="indefinite" path={d} />
      </circle>
    </svg>
  );
}

function HubDiagram() {
  const spokes = [
    { angle: 0, label: 'Conversa', meta: 'WhatsApp · Web · Voz' },
    { angle: 72, label: 'Genera', meta: 'Copy · Assets · Plan' },
    { angle: 144, label: 'Automatiza', meta: 'CRM · ERP · Workflows' },
    { angle: 216, label: 'Integra', meta: 'Slack · Notion · Stack' },
    { angle: 288, label: 'Aprende', meta: 'Métricas · Feedback' },
  ];
  const R = 38,
    cx = 50,
    cy = 50;
  return (
    <div className="hub" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="hub__svg">
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.10" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r="42" fill="url(#hub-glow)" />
        {[14, 24, 34, 44].map((r) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="0.2"
            strokeDasharray="0.6 0.8"
          />
        ))}
        {spokes.map((s, i) => {
          const rad = ((s.angle - 90) * Math.PI) / 180;
          const x = cx + Math.cos(rad) * R;
          const y = cy + Math.sin(rad) * R;
          return (
            <g key={s.label}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="0.25"
              />
              <circle r="0.6" fill="currentColor" opacity="0.7">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.6}s`}
                  path={`M ${cx} ${cy} L ${x} ${y}`}
                />
                <animate
                  attributeName="opacity"
                  from="0.9"
                  to="0"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.6}s`}
                />
              </circle>
            </g>
          );
        })}
        {spokes.map((s) => {
          const rad = ((s.angle - 90) * Math.PI) / 180;
          const x = cx + Math.cos(rad) * R;
          const y = cy + Math.sin(rad) * R;
          return (
            <circle
              key={'n' + s.label}
              cx={x}
              cy={y}
              r="1.6"
              fill="var(--bg)"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          );
        })}
        <circle cx={cx} cy={cy} r="7" fill="var(--ink)" />
        <circle
          cx={cx}
          cy={cy}
          r="9"
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.2"
          strokeWidth="0.3"
        />
        <text
          x={cx}
          y={cy + 1.5}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="3"
          fill="var(--bg)"
          letterSpacing="0.05em"
        >
          MEMORIA
        </text>
      </svg>
      {spokes.map((s) => {
        const rad = ((s.angle - 90) * Math.PI) / 180;
        const x = cx + Math.cos(rad) * (R + 8);
        const y = cy + Math.sin(rad) * (R + 8);
        return (
          <div key={'l' + s.label} className="hub__label" style={{ left: `${x}%`, top: `${y}%` }}>
            <div className="hub__label-name">{s.label}</div>
            <div className="mono-xs hub__label-meta">{s.meta}</div>
          </div>
        );
      })}
    </div>
  );
}

const CAPABILITIES = [
  {
    id: '01',
    title: 'Conversa',
    lede: 'Tu marca atiende a tus clientes y a tu equipo, 24/7, con tu voz exacta.',
    body: 'Agentes que viven donde tu marca ya conversa — WhatsApp, web, redes, app, voz — y asistentes internos para tu equipo comercial, soporte y operaciones. No leen scripts. Recuperan de tu cerebro y responden con criterio.',
    bullets: [
      'Atención al cliente en cada canal (WhatsApp, web, redes, voz)',
      'Asistentes internos para ventas, soporte y operaciones del equipo',
      'Calificación de leads, recomendación de productos, agenda de demos',
      'Handoff al humano cuando la situación lo requiere',
    ],
    scene: {
      kind: 'chat',
      meta: 'WhatsApp · Viernes 23:04',
      messages: [
        { who: 'user', text: '¿Tienen mesa para sábado a las 8?' },
        {
          who: 'brain',
          text: 'Sí, queda una para 4 a las 20:15 y otra para 2 a las 20:45. ¿Cuál te sirve?',
        },
        { who: 'user', text: 'La de 4. Vamos a celebrar un cumple.' },
        {
          who: 'brain',
          text: 'Listo, reservada. Te paso recordatorio el viernes 18:00. Si querés, te dejo el menú degustación apartado.',
        },
      ],
      footer: '✓ Registrado en sistema · Recordatorio agendado',
    },
    example:
      'Un viernes a las 11pm, un cliente pregunta por WhatsApp si tienen mesa para sábado. La marca confirma, registra la reserva en el sistema, manda recordatorio el viernes a las 6pm.',
  },
  {
    id: '02',
    title: 'Genera contenido',
    lede: 'De un brief a una pieza lista para publicar — en horas, no en semanas.',
    body: 'Tu cerebro lee un brief, busca los assets aprobados, escribe el copy con tu voz, ajusta el diseño a cada formato, calendariza, publica, mide. Aprende qué funciona y qué no. La próxima vez, mejor.',
    bullets: [
      'Generación de copy y assets visuales desde brief',
      'Asset matching contra tu biblioteca aprobada (fotos, ilustraciones, video)',
      'Adaptación automática a cada formato (Instagram, LinkedIn, email, web)',
      'Calendarización, publicación multi-plataforma, métricas + aprendizaje',
    ],
    scene: {
      kind: 'pipeline',
      meta: 'Brief → Pieza · 03:14:22',
      steps: [
        {
          label: 'Brief recibido',
          detail: 'Campaña de Navidad · Reels + Story + email',
          state: 'done',
        },
        { label: 'Voz aplicada', detail: 'Tono cálido, irónico, sin emojis', state: 'done' },
        { label: 'Asset match', detail: '6 fotos aprobadas · 2 ilustraciones', state: 'done' },
        { label: 'Adaptación', detail: 'IG 9:16 · LI 1:1 · Email 600px', state: 'live' },
        { label: 'Calendario', detail: 'Pub. 21 Dic · 18:30', state: 'queue' },
      ],
      footer: 'Sin reuniones · sin handoff · sin tres agencias',
    },
    example:
      'De "necesito anuncio para campaña de Navidad" a la pieza publicada, calendarizada y midiéndose — sin reuniones, sin handoffs entre tres agencias.',
  },
  {
    id: '03',
    title: 'Automatiza procesos',
    lede: 'Las tareas operativas que tu equipo ya no debería hacer a mano.',
    body: 'Onboarding de clientes, gestión de incidencias, soporte L1, reclamos, sync con CRM y ERP. Workflows con criterio, no automatización ciega. Cuando algo requiere decisión humana, escala. Cuando no, ejecuta.',
    bullets: [
      'Onboarding de clientes nuevos sin tocar el sistema a mano',
      'Gestión de incidencias, reclamos, soporte de primer nivel',
      'Sync bidireccional con CRM, ERP, e-commerce, herramientas internas',
      'Workflows orquestados con escalamiento a humano cuando aplica',
    ],
    scene: {
      kind: 'workflow',
      meta: 'workflow · onboarding · v3',
      nodes: [
        { x: 8, y: 50, label: 'Lead', kind: 'in' },
        { x: 32, y: 30, label: 'Verifica', kind: 'step' },
        { x: 32, y: 70, label: 'Tag CRM', kind: 'step' },
        { x: 60, y: 50, label: 'Decide', kind: 'branch' },
        { x: 86, y: 28, label: 'Auto-flow', kind: 'auto' },
        { x: 86, y: 72, label: 'Humano', kind: 'human' },
      ],
      edges: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
        [3, 4],
        [3, 5],
      ],
      footer: '94% resuelto sin humano · 6% escalado con contexto',
    },
    example:
      'Un cliente nuevo se registra. El cerebro lo onboardea, le manda los recursos, lo agenda en CRM, avisa al equipo solo si el caso es atípico.',
  },
  {
    id: '04',
    title: 'Se integra a tu stack',
    lede: 'Tu cerebro vive donde tu marca ya opera — sin migrar nada.',
    body: 'No te pedimos cambiar de herramientas. El cerebro se conecta a las que ya usás — WhatsApp Business, Instagram, tu web, tu app, CRM, ERP, Metricool, Notion, Slack, lo que sea. Lee, escribe, decide. Tu equipo sigue trabajando en lo que ya conoce.',
    bullets: [
      'Canales: WhatsApp, Instagram, Facebook, X, web, app, voz',
      'Negocio: CRM (HubSpot, Salesforce, etc.), ERP, e-commerce, calendario',
      'Marketing: Metricool, Mailchimp, Buffer, CMS, DAM, herramientas de diseño',
      'Equipo: Slack, Notion, Google Workspace, Microsoft 365',
    ],
    scene: {
      kind: 'stack',
      meta: 'integraciones · activas',
      groups: [
        {
          label: 'Canales',
          items: ['WhatsApp', 'Instagram', 'Facebook', 'X', 'Web', 'App', 'Voz'],
        },
        { label: 'Negocio', items: ['HubSpot', 'Salesforce', 'ERP', 'Shopify', 'Calendar'] },
        { label: 'Marketing', items: ['Metricool', 'Mailchimp', 'Buffer', 'CMS', 'DAM'] },
        { label: 'Equipo', items: ['Slack', 'Notion', 'Google WS', 'Microsoft 365'] },
      ],
      footer: 'No moves nada. El cerebro vive donde tu equipo ya trabaja.',
    },
    example:
      'Si tu equipo ya trabaja en Slack y tu marca ya está en WhatsApp e Instagram, el cerebro vive ahí. No moves nada.',
  },
];

type Scene = (typeof CAPABILITIES)[0]['scene'];

function CapabilityScene({ scene }: { scene: Scene }) {
  if (scene.kind === 'chat' && 'messages' in scene) {
    return (
      <div className="cap-scene cap-chat">
        <div className="cap-scene__head">
          <span className="mono-xs">{scene.meta}</span>
        </div>
        <div className="cap-chat__body">
          {scene.messages.map((m, i) => (
            <div key={i} className={`cap-chat__msg cap-chat__msg--${m.who}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="cap-scene__foot mono-xs">{scene.footer}</div>
      </div>
    );
  }
  if (scene.kind === 'pipeline' && 'steps' in scene) {
    return (
      <div className="cap-scene cap-pipe">
        <div className="cap-scene__head">
          <span className="mono-xs">{scene.meta}</span>
        </div>
        <ol className="cap-pipe__list">
          {scene.steps.map((s, i) => (
            <li key={i} className={`cap-pipe__row cap-pipe__row--${s.state}`}>
              <span className="cap-pipe__bullet" aria-hidden="true" />
              <span className="cap-pipe__label">{s.label}</span>
              <span className="cap-pipe__detail mono">{s.detail}</span>
              <span className="cap-pipe__state mono-xs">
                {s.state === 'done' ? '✓ done' : s.state === 'live' ? '● live' : '○ queue'}
              </span>
            </li>
          ))}
        </ol>
        <div className="cap-scene__foot mono-xs">{scene.footer}</div>
      </div>
    );
  }
  if (scene.kind === 'workflow' && 'nodes' in scene) {
    const { nodes, edges } = scene;
    return (
      <div className="cap-scene cap-flow">
        <div className="cap-scene__head">
          <span className="mono-xs">{scene.meta}</span>
        </div>
        <svg
          className="cap-flow__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="0.25"
              strokeDasharray="0.6 0.6"
            />
          ))}
        </svg>
        {nodes.map((n, i) => (
          <div
            key={i}
            className={`cap-flow__node cap-flow__node--${n.kind}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span className="cap-flow__dot" />
            <span className="cap-flow__label">{n.label}</span>
          </div>
        ))}
        <div className="cap-scene__foot mono-xs">{scene.footer}</div>
      </div>
    );
  }
  if (scene.kind === 'stack' && 'groups' in scene) {
    return (
      <div className="cap-scene cap-stack">
        <div className="cap-scene__head">
          <span className="mono-xs">{scene.meta}</span>
        </div>
        <div className="cap-stack__grid">
          {scene.groups.map((g) => (
            <div className="cap-stack__group" key={g.label}>
              <div className="mono-xs cap-stack__title">{g.label}</div>
              <div className="cap-stack__items">
                {g.items.map((item) => (
                  <span key={item} className="cap-stack__chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="cap-scene__foot mono-xs">{scene.footer}</div>
      </div>
    );
  }
  return null;
}

export function Capabilities() {
  return (
    <section className="section" id="capacidades">
      <div className="wrap">
        <div className="section__head reveal">
          <div className="section__head-l">
            <div className="eyebrow">§2 · Capacidades</div>
            <Lissajous a={3} b={2} delta={Math.PI / 2} />
          </div>
          <div>
            <h2 className="h-display h2">
              Sobre el mismo cerebro <br />
              <span style={{ color: 'var(--ink-muted)' }}>operan cuatro capacidades.</span>
            </h2>
            <p className="lead" style={{ marginTop: 28, maxWidth: '52ch' }}>
              Una sola memoria. Cuatro superficies de salida. Misma voz, mismo criterio, mismo
              conocimiento en cada lugar donde tu marca aparece.
            </p>
          </div>
        </div>

        <div className="caps__hub reveal">
          <HubDiagram />
        </div>

        <div className="caps">
          {CAPABILITIES.map((c, i) => (
            <article key={c.id} className={`cap reveal cap--${i % 2 === 0 ? 'l' : 'r'}`}>
              <div className="cap__txt">
                <div className="cap__num mono">
                  <span>{c.id}</span>
                  <span className="cap__num-line" />
                  <span className="mono-xs" style={{ color: 'var(--ink-faint)' }}>
                    capacidad
                  </span>
                </div>
                <h3 className="h-display h3 cap__title">{c.title}</h3>
                <p className="lead cap__lede">{c.lede}</p>
                <p className="cap__body">{c.body}</p>
                <ul className="cap__bullets">
                  {c.bullets.map((b) => (
                    <li key={b}>
                      <span className="cap__bullet-mark" aria-hidden="true">
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <path
                            d="M1 5 L4 8 L9 1.5"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            fill="none"
                          />
                        </svg>
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <blockquote className="cap__example">
                  <span className="mono-xs cap__example-lbl">Ejemplo</span>
                  <p>{c.example}</p>
                </blockquote>
              </div>
              <div className="cap__viz">
                <CapabilityScene scene={c.scene} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .caps__hub { margin: 0 auto clamp(72px, 10vw, 140px); max-width: 640px; aspect-ratio: 1 / 1; }
        .hub { position: relative; width: 100%; height: 100%; color: var(--ink); }
        .hub__svg { width: 100%; height: 100%; display: block; }
        .hub__label { position: absolute; transform: translate(-50%, -50%); text-align: center; width: 140px; pointer-events: none; }
        .hub__label-name { font-family: var(--font-display); font-weight: 500; font-size: 15px; letter-spacing: -0.01em; color: var(--ink); }
        .hub__label-meta { color: var(--ink-muted); margin-top: 2px; }
        @media (max-width: 720px) { .hub__label { width: 100px; } .hub__label-name { font-size: 13px; } }
        .caps { display: flex; flex-direction: column; gap: clamp(80px, 10vw, 140px); }
        .cap { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
        .cap--r .cap__txt { order: 2; }
        @media (max-width: 920px) { .cap { grid-template-columns: 1fr; } .cap--r .cap__txt { order: 0; } }
        .cap__num { display: flex; align-items: center; gap: 12px; color: var(--ink-muted); font-size: 13px; }
        .cap__num-line { flex: 1; height: 1px; background: var(--line); max-width: 80px; }
        .cap__title { margin: 18px 0 18px; }
        .cap__lede { font-weight: 500; color: var(--ink); margin: 0 0 16px; max-width: 38ch; }
        .cap__body { color: var(--ink-muted); max-width: 50ch; margin: 0 0 28px; font-size: var(--fs-body-lg); line-height: 1.55; }
        .cap__bullets { list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 12px; border-top: 1px solid var(--line); padding-top: 20px; }
        .cap__bullets li { display: grid; grid-template-columns: 20px 1fr; gap: 10px; font-size: var(--fs-body); color: var(--ink-soft); line-height: 1.5; }
        .cap__bullet-mark { color: var(--ink); margin-top: 4px; }
        .cap__example { margin: 0; padding: 22px 24px; border-left: 2px solid var(--ink); background: var(--bg-elev); border-radius: 0 8px 8px 0; }
        .cap__example p { margin: 8px 0 0; color: var(--ink-soft); font-style: italic; max-width: 50ch; }
        .cap__example-lbl { color: var(--ink-muted); letter-spacing: 0.06em; }
        .cap__viz { position: sticky; top: 120px; }
        @media (max-width: 920px) { .cap__viz { position: static; } }
        .cap-scene { border: 1px solid var(--line); background: var(--bg-elev); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
        .cap-scene__head { padding: 12px 16px; border-bottom: 1px solid var(--line); color: var(--ink-muted); background: var(--bg); }
        .cap-scene__foot { padding: 12px 16px; border-top: 1px solid var(--line); color: var(--ink-muted); background: var(--bg); }
        .cap-chat__body { padding: 24px; display: flex; flex-direction: column; gap: 10px; min-height: 320px; }
        .cap-chat__msg { padding: 10px 14px; border-radius: 14px; max-width: 80%; font-size: 14px; line-height: 1.45; }
        .cap-chat__msg--user { align-self: flex-start; background: var(--bg); border: 1px solid var(--line); border-bottom-left-radius: 4px; color: var(--ink-soft); }
        .cap-chat__msg--brain { align-self: flex-end; background: var(--ink); color: var(--bg); border-bottom-right-radius: 4px; }
        .cap-pipe__list { list-style: none; margin: 0; padding: 16px 8px; }
        .cap-pipe__row { display: grid; grid-template-columns: 24px 1fr auto auto; gap: 16px; padding: 14px 16px; align-items: center; border-bottom: 1px dashed var(--line); font-size: 14px; }
        .cap-pipe__row:last-child { border-bottom: 0; }
        .cap-pipe__bullet { width: 10px; height: 10px; border-radius: 50%; background: var(--ink); }
        .cap-pipe__row--queue .cap-pipe__bullet { background: transparent; border: 1px solid var(--ink-faint); }
        .cap-pipe__row--live .cap-pipe__bullet { background: var(--ink); animation: livepulse 1.6s ease-out infinite; }
        @keyframes livepulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ink) 50%, transparent); } 100% { box-shadow: 0 0 0 10px color-mix(in srgb, var(--ink) 0%, transparent); } }
        .cap-pipe__label { font-weight: 500; }
        .cap-pipe__detail { color: var(--ink-muted); font-size: 12px; }
        .cap-pipe__state { color: var(--ink-muted); }
        .cap-pipe__row--done .cap-pipe__state { color: var(--ink); }
        @media (max-width: 520px) { .cap-pipe__row { grid-template-columns: 18px 1fr; } .cap-pipe__detail, .cap-pipe__state { grid-column: 2; } }
        .cap-flow { position: relative; min-height: 360px; color: var(--ink); }
        .cap-flow__svg { position: absolute; inset: 48px 0 48px 0; width: 100%; height: calc(100% - 96px); }
        .cap-flow__node { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .cap-flow__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--ink); box-shadow: 0 0 0 4px var(--bg-elev), 0 0 0 5px var(--line); }
        .cap-flow__node--branch .cap-flow__dot { background: var(--bg); border: 1.5px solid var(--ink); width: 12px; height: 12px; }
        .cap-flow__node--human .cap-flow__dot { background: var(--bg); border: 1.5px solid var(--ink); }
        .cap-flow__label { font-family: var(--font-mono); font-size: 10px; background: var(--bg); padding: 3px 8px; border: 1px solid var(--line); border-radius: 4px; color: var(--ink); white-space: nowrap; letter-spacing: 0.02em; }
        .cap-stack__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--line); }
        .cap-stack__group { background: var(--bg-elev); padding: 20px; min-height: 140px; }
        .cap-stack__title { color: var(--ink-muted); margin-bottom: 14px; }
        .cap-stack__items { display: flex; flex-wrap: wrap; gap: 6px; }
        .cap-stack__chip { font-family: var(--font-mono); font-size: 11px; background: var(--bg); border: 1px solid var(--line); padding: 4px 10px; border-radius: 999px; color: var(--ink-soft); letter-spacing: 0.01em; }
      `}</style>
    </section>
  );
}
