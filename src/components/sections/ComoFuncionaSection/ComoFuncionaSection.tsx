/**
 * ComoFuncionaSection — D-89 section compound, Server Component
 * Root + Header + Flow + Steps + Step sub-components via Object.assign.
 *
 * L-BBF-216 SAFE: no 'use client'. Lissajous is a Client leaf (pre-existing).
 * Sticky: CSS-driven (position:sticky top:96px en .bbf-hiw-section__head-l).
 *         Consumer MUST use Reveal variant="fade" on <Header>, NOT "up" (L-BBF-216).
 *
 * Refs: D-89 (compound pattern), L-BBF-216 (transform breaks sticky)
 */
import type { ReactNode } from 'react';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Lissajous } from '@/components/atoms/Lissajous';
import { comoFuncionaSectionVariants } from './ComoFuncionaSection.variants';
import type { ComoFuncionaSectionVariants } from './ComoFuncionaSection.variants';

// ── Root ──────────────────────────────────────────────────────

interface RootProps extends ComoFuncionaSectionVariants {
  children: ReactNode;
  className?: string;
}

function Root({ children, surface, className }: RootProps) {
  return (
    <section
      data-component="bbf-como-funciona-section"
      data-surface={surface ?? 'sand'}
      className={comoFuncionaSectionVariants({ surface, className } as Parameters<
        typeof comoFuncionaSectionVariants
      >[0])}
    >
      <div className="bbf-hiw-section__wrap">{children}</div>
    </section>
  );
}

// ── Header ────────────────────────────────────────────────────

interface HeaderProps {
  eyebrow?: string | null;
  h2Line1: string;
  h2Line2Soft: string;
}

function Header({ eyebrow, h2Line1, h2Line2Soft }: HeaderProps) {
  return (
    <header className="bbf-hiw-section__head">
      {/* Left column: sticky eyebrow + Lissajous deco — consumer uses Reveal variant="fade" (L-BBF-216) */}
      <div className="bbf-hiw-section__head-l">
        <span className="bbf-hiw-section__eyebrow">{eyebrow ?? '§3 · Cómo funciona'}</span>
        <div className="bbf-hiw-section__deco">
          <Lissajous name="process-2d" animation="point-center" className="h-full w-full" />
        </div>
      </div>

      {/* Right column: H2 dual-line */}
      <Heading level="display-section-h2" as="h2">
        {h2Line1} <span style={{ color: 'var(--bbf-text-on-sand-muted)' }}>{h2Line2Soft}</span>
      </Heading>
    </header>
  );
}

// ── Flow ─────────────────────────────────────────────────────

interface FlowStep {
  label: string;
  meta?: string | null;
}

interface FlowProps {
  steps: FlowStep[];
}

function Flow({ steps }: FlowProps) {
  return (
    <div className="bbf-hiw-flow">
      <svg
        className="bbf-hiw-flow__svg"
        viewBox="0 0 100 28"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hiw-track" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* track line */}
        <line x1="6" y1="14" x2="94" y2="14" stroke="url(#hiw-track)" strokeWidth="0.4" />
        <line
          x1="6"
          y1="14"
          x2="94"
          y2="14"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="0.6 0.8"
          strokeOpacity="0.25"
        />

        {/* 3 stations */}
        {([17, 50, 83] as const).map((cx, i) => (
          <g key={`station-${i}`}>
            <circle
              cx={cx}
              cy="14"
              r="3.2"
              fill="var(--bbf-surface-sand)"
              stroke="currentColor"
              strokeWidth="0.4"
            />
            <circle cx={cx} cy="14" r="1.4" fill="currentColor" />
          </g>
        ))}

        {/* traveling packets — hidden by @media (prefers-reduced-motion: reduce) via CSS */}
        <g className="bbf-hiw-flow__packets" aria-hidden="true">
          {([0, 1, 2] as const).map((i) => (
            <circle key={`packet-${i}`} cx="6" cy="14" r="0.7" fill="currentColor">
              <animate
                attributeName="cx"
                from="6"
                to="94"
                dur="4.8s"
                begin={`${i * 1.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur="4.8s"
                begin={`${i * 1.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>

      <div className="bbf-hiw-flow__labels">
        {steps.map((step, i) => (
          <div key={`flow-label-${i}`} className="bbf-hiw-flow__label">
            <span className="bbf-hiw-flow__label-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="bbf-hiw-flow__label-k">{step.label}</span>
            {step.meta && <span className="bbf-hiw-flow__label-meta">{step.meta}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────

function Steps({ children }: { children: ReactNode }) {
  return <ol className="bbf-hiw-steps">{children}</ol>;
}

// ── Step ──────────────────────────────────────────────────────

interface SideItem {
  text: string;
}

interface StepProps {
  index: number;
  label: string;
  title: string;
  body: string;
  side?: SideItem[] | null;
}

function Step({ index, label, title, body, side }: StepProps) {
  return (
    <li className="bbf-hiw-step">
      <header className="bbf-hiw-step__head">
        <span className="bbf-hiw-step__num">{String(index).padStart(2, '0')}</span>
        <span className="bbf-hiw-step__lbl">paso</span>
        <span className="bbf-hiw-step__line" aria-hidden="true" />
        <span className="bbf-hiw-step__name">{label}</span>
      </header>
      <Heading level="display-step-title" as="h3" className="bbf-hiw-step__title">
        {title}
      </Heading>
      <p className="bbf-hiw-step__body">{body}</p>
      {side && side.length > 0 && (
        <ul className="bbf-hiw-step__side">
          {side.map((item, i) => (
            <li key={`side-${i}`} className="bbf-hiw-step__side-item">
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// ── Compound export ───────────────────────────────────────────

const ComoFuncionaSection = Object.assign(Root, {
  Header,
  Flow,
  Steps,
  Step,
});

export { ComoFuncionaSection };
export type { FlowStep, StepProps, SideItem };
