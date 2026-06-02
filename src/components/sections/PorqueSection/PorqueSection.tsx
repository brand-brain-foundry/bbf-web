/**
 * PorqueSection — D-89 section compound, Server Component
 * §4 Por qué — surface sand-deep (#ebe3d4 via --bbf-color-sand-deep-shade, D-S4-01).
 *
 * Compound:
 *   <PorqueSection>
 *     <SectionHeader surface="warm" ... decoration={<Lissajous name="cross-2d" />} />
 *     <PorqueSection.Comparison columns={...} rows={...} />
 *     <PorqueSection.Epilogue title={...} body={...} />
 *   </PorqueSection>
 *
 * Surface bg aplicada en Tier 3 CSS — sin CVA variant (D-S4-01 Opción A).
 * Refs: D-S4-01..04, B-BBF-WEB-S4-PORQUE-FASES-2A6, home-comparison.jsx (LEY visual)
 */

import type { ReactNode } from 'react';
import { Heading } from '@/components/atoms/Heading';
import { Comparison } from './PorqueSection.Comparison';

/* ── Root ──────────────────────────────────────────────────────────────── */

interface RootProps {
  children: ReactNode;
  className?: string;
}

function Root({ children, className }: RootProps) {
  return (
    <section
      data-component="bbf-porque-section"
      data-surface="warm"
      className={`bbf-porque-section${className ? ` ${className}` : ''}`}
    >
      <div className="bbf-section-wrap">{children}</div>
    </section>
  );
}

/* ── Epilogue ──────────────────────────────────────────────────────────── */

interface EpilogueProps {
  title?: string | null;
  body?: string | null;
}

function Epilogue({ title, body }: EpilogueProps) {
  if (!title && !body) return null;

  const paragraphs =
    body
      ?.split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean) ?? [];

  return (
    <div className="bbf-porque-epilogue" data-component="bbf-porque-epilogue">
      <div className="bbf-porque-epilogue__title">
        <Heading as="h3" level="display-step-title" className="[color:var(--bbf-text-on-warm)]">
          {title}
        </Heading>
      </div>
      <div className="bbf-porque-epilogue__body">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}

/* ── Compound export ───────────────────────────────────────────────────── */

export const PorqueSection = Object.assign(Root, {
  Comparison,
  Epilogue,
});
