/**
 * HubDiagram — D-85 monolítica, Server Component
 * Hub-and-spoke diagram: 5 canon-locked spokes, SVG animations, aria-hidden.
 * Labels + meta hardcoded per Q4 FASE 1 (visual marca, no editorial).
 * Hub center label from i18n (capabilities.ui.hubCenter).
 */
import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';

const SPOKES = [
  { angle: 0, label: 'Conversa', meta: 'WhatsApp · Web · Voz' },
  { angle: 72, label: 'Genera', meta: 'Copy · Assets · Plan' },
  { angle: 144, label: 'Automatiza', meta: 'CRM · ERP · Workflows' },
  { angle: 216, label: 'Integra', meta: 'Slack · Notion · Stack' },
  { angle: 288, label: 'Aprende', meta: 'Métricas · Feedback' },
] as const;

const R = 38;
const CX = 50;
const CY = 50;

export async function HubDiagram() {
  const t = await getTranslations('capabilities.ui');
  const hubCenter = t('hubCenter');

  return (
    <div data-component="bbf-hub-diagram" className="bbf-capabilities-hub" aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        className="bbf-capabilities-hub__svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="bbf-hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.10" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient glow */}
        <circle cx={CX} cy={CY} r="42" fill="url(#bbf-hub-glow)" />

        {/* Concentric rings */}
        {[14, 24, 34, 44].map((r) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="0.2"
            strokeDasharray="0.6 0.8"
          />
        ))}

        {/* Spokes + animated particles */}
        {SPOKES.map((s, i) => {
          const rad = ((s.angle - 90) * Math.PI) / 180;
          const x = (CX + Math.cos(rad) * R).toFixed(2);
          const y = (CY + Math.sin(rad) * R).toFixed(2);
          const path = `M ${CX} ${CY} L ${x} ${y}`;
          return (
            <g key={s.label}>
              <line
                x1={CX}
                y1={CY}
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
                  path={path}
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

        {/* Spoke end nodes */}
        {SPOKES.map((s) => {
          const rad = ((s.angle - 90) * Math.PI) / 180;
          const x = (CX + Math.cos(rad) * R).toFixed(2);
          const y = (CY + Math.sin(rad) * R).toFixed(2);
          return (
            <circle
              key={`node-${s.label}`}
              cx={x}
              cy={y}
              r="1.6"
              fill="var(--bbf-surface-sand)"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Hub center */}
        <circle cx={CX} cy={CY} r="7" fill="var(--bbf-text-on-sand)" />
        <circle
          cx={CX}
          cy={CY}
          r="9"
          fill="none"
          stroke="var(--bbf-text-on-sand)"
          strokeOpacity="0.2"
          strokeWidth="0.3"
        />
        <text
          x={CX}
          y={CY + 1.5}
          textAnchor="middle"
          fontFamily="var(--bbf-font-mono)"
          fontSize="3"
          fill="var(--bbf-surface-sand)"
          letterSpacing="0.05em"
        >
          {hubCenter}
        </text>
      </svg>

      {/* Spoke labels — HTML overlay */}
      {SPOKES.map((s) => {
        const rad = ((s.angle - 90) * Math.PI) / 180;
        const x = (CX + Math.cos(rad) * (R + 10)).toFixed(1);
        const y = (CY + Math.sin(rad) * (R + 10)).toFixed(1);
        return (
          <div
            key={`label-${s.label}`}
            className="bbf-capabilities-hub__label"
            style={{ left: `${x}%`, top: `${y}%` } as CSSProperties}
          >
            <div className="bbf-capabilities-hub__label-name">{s.label}</div>
            <div className="bbf-capabilities-hub__label-meta">{s.meta}</div>
          </div>
        );
      })}
    </div>
  );
}
