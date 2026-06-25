/**
 * HubDiagram — D-85 monolítica, Server Component
 * Hub-and-spoke diagram: 5 canon-locked spokes, SVG animations, aria-hidden.
 * Spokes editable via Payload SiteHomepage.capabilities.hubSpokes (Fix 3).
 * Hub center label from i18n (capabilities.ui.hubCenter).
 *
 * B-BBF-WEB-HUB-DIAGRAM-BUILD:
 * - Responsive: tipo por |cosA|>|sinA| (D-S456-07) — 3 tipos, 5 nodos derivan
 * - Líneas 3D: radialGradient mask (offset 15%→90%) en <g mask>, partículas fuera
 * - Surface-aware: nodos→--bbf-on-surface-bg, texto→--bbf-text-on-gradient-blue, stops→Tier 2
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

const HUB_R = 10;
const SPOKE_R = 38;
const CX = 50;
const CY = 50;
const SONAR_DELAYS = [0, 0.8, 1.6];
const NODE_R = 1.6; // radio visual del nodo SVG (sync con r="1.6" en el render)
const LABEL_NODE_GAP = NODE_R; // 1.6u ≈ 9.2px — gap texto↔nodo = un radio de nodo (linaje: madre NODE_R)
const CLEARANCE = NODE_R + LABEL_NODE_GAP; // 3.2u — distancia centro-nodo → inicio texto (linaje: NODE_R madre)

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

          {/* D-REBRAND-01: blue gradient animado via stop-offset cycling */}
          <linearGradient id="bbf-hub-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="21%" style={{ stopColor: 'var(--bbf-color-blue-accent)' }}>
              <animate
                attributeName="offset"
                values="0%;30%;0%"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" style={{ stopColor: 'var(--bbf-color-blue-accent-deep)' }}>
              <animate
                attributeName="offset"
                values="100%;70%;100%"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          {/* Spoke fade mask — opaque near hub (15%), transparent at node (90%) */}
          <radialGradient id="bbf-spoke-fade" cx="50%" cy="50%" r="50%">
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="90%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="bbf-spoke-mask">
            <circle cx={CX} cy={CY} r="45" fill="url(#bbf-spoke-fade)" />
          </mask>
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

        {/* Sonar waves — SVG native animate, prefers-reduced-motion via CSS (.bbf-hub-sonar) */}
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

        {/* Spoke lines — wrapped in fade mask for 3D depth effect */}
        <g mask="url(#bbf-spoke-mask)">
          {spokesToRender.map((s) => {
            const rad = ((s.angle - 90) * Math.PI) / 180;
            const x = (CX + Math.cos(rad) * SPOKE_R).toFixed(2);
            const y = (CY + Math.sin(rad) * SPOKE_R).toFixed(2);
            return (
              <line
                key={`line-${s.name}`}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.5"
                strokeWidth="0.5"
              />
            );
          })}
        </g>

        {/* Animated particles — outside mask, untouched */}
        {spokesToRender.map((s, i) => {
          const rad = ((s.angle - 90) * Math.PI) / 180;
          const x = (CX + Math.cos(rad) * SPOKE_R).toFixed(2);
          const y = (CY + Math.sin(rad) * SPOKE_R).toFixed(2);
          const path = `M ${CX} ${CY} L ${x} ${y}`;
          return (
            <circle key={`particle-${s.name}`} r="0.6" fill="currentColor" opacity="0.7">
              <animateMotion dur="3s" repeatCount="indefinite" begin={`${i * 0.6}s`} path={path} />
              <animate
                attributeName="opacity"
                from="0.9"
                to="0"
                dur="3s"
                repeatCount="indefinite"
                begin={`${i * 0.6}s`}
              />
            </circle>
          );
        })}

        {/* Spoke end nodes — surface-aware fill */}
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
              fill="var(--bbf-on-surface-bg)"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Hub center — D-REBRAND-01: blue gradient (identidad marca, intacto) */}
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
          fill="var(--bbf-text-on-gradient-blue)"
          letterSpacing="0.05em"
        >
          {hubCenter}
        </text>
      </svg>

      {/* Spoke labels — HTML overlay, tipo derivado del ángulo (D-S456-07: |cosA|>|sinA|=lateral) */}
      {spokesToRender.map((s) => {
        const rad = ((s.angle - 90) * Math.PI) / 180;
        const cosA = Math.cos(rad);
        const sinA = Math.sin(rad);
        const nodeX = CX + cosA * SPOKE_R;
        const nodeY = CY + sinA * SPOKE_R;

        // D-S456-07: lateral si domina el eje horizontal; vertical si domina el vertical
        const isLateral = Math.abs(cosA) > Math.abs(sinA);

        let pos: 'lat-r' | 'lat-l' | 'v-sup' | 'v-inf';
        let left: number;
        let top: number;

        if (isLateral) {
          const side = cosA > 0 ? 1 : -1; // +1 derecha, -1 izquierda
          pos = side > 0 ? 'lat-r' : 'lat-l';
          left = nodeX + side * CLEARANCE; // borde-nodo + gap, crece outward
          top = nodeY; // centrado vertical con el nodo
        } else {
          const vside = sinA > 0 ? 1 : -1; // +1 abajo, -1 arriba
          pos = vside > 0 ? 'v-inf' : 'v-sup';
          left = nodeX; // centrado horizontal con el nodo
          top = nodeY + vside * CLEARANCE; // borde-nodo + gap, arriba/abajo
        }

        return (
          <div
            key={`label-${s.name}`}
            className="bbf-capabilities-hub__label"
            data-spoke-pos={pos}
            style={
              {
                '--hub-lx': `${left.toFixed(1)}%`,
                '--hub-ly': `${top.toFixed(1)}%`,
                '--hub-nx': `${nodeX.toFixed(1)}%`,
              } as CSSProperties
            }
          >
            <div className="bbf-capabilities-hub__label-name">{s.name}</div>
            <div className="bbf-capabilities-hub__label-meta">{s.meta}</div>
          </div>
        );
      })}
    </div>
  );
}
