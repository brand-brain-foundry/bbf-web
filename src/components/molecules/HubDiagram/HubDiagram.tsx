/**
 * HubDiagram — D-85 monolítica, Server Component
 * Hub-and-spoke diagram: 5 canon-locked spokes, SVG animations, aria-hidden.
 * Spokes editable via Payload SiteHomepage.capabilities.hubSpokes (Fix 3).
 * Hub center label from i18n (capabilities.ui.hubCenter).
 */
import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';

export interface HubSpoke {
  name: string;
  meta?: string | null;
}

const DEFAULT_SPOKES = [
  { angle: 0, name: 'Conversa', meta: 'WhatsApp · Web · Voz' },
  { angle: 72, name: 'Genera', meta: 'Copy · Assets · Plan' },
  { angle: 144, name: 'Automatiza', meta: 'CRM · ERP · Workflows' },
  { angle: 216, name: 'Integra', meta: 'Slack · Notion · Stack' },
  { angle: 288, name: 'Aprende', meta: 'Métricas · Feedback' },
];

const HUB_R = 10; // Fix 1: was 7 — text "MEMORIA" needs ~18px padding each side
const SPOKE_R = 38;
const CX = 50;
const CY = 50;
const SONAR_DELAYS = [0, 0.8, 1.6];

interface HubDiagramProps {
  spokes?: HubSpoke[];
}

export async function HubDiagram({ spokes }: HubDiagramProps = {}) {
  const t = await getTranslations('capabilities.ui');
  const hubCenter = t('hubCenter');

  const spokesToRender = DEFAULT_SPOKES.map((s, i) => ({
    ...s,
    name: spokes?.[i]?.name ?? s.name,
    meta: spokes?.[i]?.meta ?? s.meta,
  }));

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
          {/* D-REBRAND-01: blue gradient animado via stop-offset cycling (mirror red pattern) */}
          <linearGradient id="bbf-hub-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="21%" style={{ stopColor: 'var(--bbf-color-blue-500)' }}>
              <animate
                attributeName="offset"
                values="0%;30%;0%"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" style={{ stopColor: 'var(--bbf-color-blue-300)' }}>
              <animate
                attributeName="offset"
                values="100%;70%;100%"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        {/* Ambient glow */}
        <circle cx={CX} cy={CY} r="44" fill="url(#bbf-hub-glow)" />

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

        {/* Sonar waves — Fix 4: SVG native animate, prefers-reduced-motion via CSS (.bbf-hub-sonar) */}
        <g className="bbf-hub-sonar">
          {SONAR_DELAYS.map((delay) => (
            <circle
              key={delay}
              cx={CX}
              cy={CY}
              r={HUB_R}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              strokeOpacity="0"
            >
              <animate
                attributeName="r"
                from={`${HUB_R}`}
                to={`${SPOKE_R}`}
                dur="2.4s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                from="0.35"
                to="0"
                dur="2.4s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Spokes + animated particles */}
        {spokesToRender.map((s, i) => {
          const rad = ((s.angle - 90) * Math.PI) / 180;
          const x = (CX + Math.cos(rad) * SPOKE_R).toFixed(2);
          const y = (CY + Math.sin(rad) * SPOKE_R).toFixed(2);
          const path = `M ${CX} ${CY} L ${x} ${y}`;
          return (
            <g key={s.name}>
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
        {spokesToRender.map((s) => {
          const rad = ((s.angle - 90) * Math.PI) / 180;
          const x = (CX + Math.cos(rad) * SPOKE_R).toFixed(2);
          const y = (CY + Math.sin(rad) * SPOKE_R).toFixed(2);
          return (
            <circle
              key={`node-${s.name}`}
              cx={x}
              cy={y}
              r="1.6"
              fill="var(--bbf-surface-sand)"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Hub center — D-REBRAND-01: blue gradient (mirror red pattern) */}
        <circle cx={CX} cy={CY} r={HUB_R} fill="url(#bbf-hub-blue-gradient)" />
        <circle
          cx={CX}
          cy={CY}
          r={HUB_R + 2}
          fill="none"
          stroke="var(--bbf-accent-blue)"
          strokeOpacity="0.3"
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
      {spokesToRender.map((s) => {
        const rad = ((s.angle - 90) * Math.PI) / 180;
        const x = (CX + Math.cos(rad) * (SPOKE_R + 10)).toFixed(1);
        const y = (CY + Math.sin(rad) * (SPOKE_R + 10)).toFixed(1);
        return (
          <div
            key={`label-${s.name}`}
            className="bbf-capabilities-hub__label"
            style={{ left: `${x}%`, top: `${y}%` } as CSSProperties}
          >
            <div className="bbf-capabilities-hub__label-name">{s.name}</div>
            <div className="bbf-capabilities-hub__label-meta">{s.meta}</div>
          </div>
        );
      })}
    </div>
  );
}
