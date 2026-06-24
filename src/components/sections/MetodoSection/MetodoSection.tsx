/**
 * MetodoSection — §5 Método homepage BBF
 *
 * Compound: SectionHeader + ProcessBar + CaseSection.Phases + CTA link.
 * Surface: dark (cascade --bbf-on-surface-bg) — como §2/§3.
 *
 * D-S5-01: ComoFuncionaSection eliminado (35% similitud, no reutilizable).
 * D-S5-02: Lissajous metodo-2d (a=2,b=3,δ=π/2).
 * D-S5-03: surface="dark" (D-S5-SURFACE-DARK firmada).
 * D-S5-04: ProcessBar Tier 3 inline (one-shot).
 * D-S5-05: ServiceCard preservado en T-METODO-CARDS (sale del render, código intacto).
 * D-S5-RECOMPOSE: mth__cards → CaseSection.Phases (Opción A: services[]→Phase, sin schema change).
 * D-S5-07: .bbf-cta-link utility (D-S5-UNIF: unificado, bbf-cta-link-warm eliminado).
 */

import { Fragment, type ReactNode } from 'react';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { CaseSection } from '@/components/sections/CaseSection';
import { Lissajous } from '@/components/atoms/Lissajous';
import { Reveal } from '@/components/atoms/Reveal';
import { Icon, Icons } from '@/components/atoms/Icon';
import type { ServiceCardProps } from './ServiceCard';

/* ── Types ─────────────────────────────────────────────────── */

interface ProcessPhase {
  number: string;
  shortLabel?: string | null;
  id?: string | null;
}

export interface MetodoData {
  eyebrow?: string | null;
  h2Line1?: string | null;
  h2Line2Soft?: string | null;
  phases?: ProcessPhase[] | null;
  services?: ServiceCardProps[] | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

/* ── ProcessBar (Tier 3 — D-S5-04) ────────────────────────── */

function ProcessBar({ phases }: { phases: ProcessPhase[] }) {
  return (
    <div className="bbf-mth__bar">
      {phases.map((p, i) => (
        <Fragment key={p.id ?? i}>
          <div className="bbf-mth__bar-node">
            <span className="bbf-mth__bar-dot" />
            <span className="bbf-mth__bar-label">
              <span className="bbf-mth__bar-number">{p.number}</span>
              <span className="bbf-mth__bar-divider"> · </span>
              <span className="bbf-mth__bar-text">{p.shortLabel}</span>
            </span>
          </div>
          {i < phases.length - 1 && <div className="bbf-mth__bar-line" aria-hidden="true" />}
        </Fragment>
      ))}
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────── */

interface RootProps {
  children: ReactNode;
}

function Root({ children }: RootProps) {
  return (
    <section
      className="bbf-mth-section"
      data-component="bbf-metodo-section"
      data-surface="dark"
      id="metodo"
    >
      <div className="bbf-section-wrap">{children}</div>
    </section>
  );
}

/* ── MetodoSection (fully wired) ────────────────────────────── */

export function MetodoSection({ data }: { data: MetodoData }) {
  const phases = data.phases ?? [];
  const services = data.services ?? [];

  return (
    <Root>
      <Reveal>
        <SectionHeader
          eyebrow={data.eyebrow ?? '§5 · MÉTODO'}
          h2Line1={data.h2Line1 ?? 'Tres servicios coordinados.'}
          h2Line2Soft={data.h2Line2Soft ?? 'Sin sorpresas.'}
          surface="dark"
          h2Line2SoftClassName="bbf-gradient-blue-animated"
          decoration={<Lissajous name="figure8-2d" animation="traveling" />}
        />
      </Reveal>

      {phases.length > 0 && (
        <Reveal>
          <ProcessBar phases={phases} />
        </Reveal>
      )}

      {services.length > 0 && (
        <CaseSection.Phases>
          {services.map((service, i) => (
            <Reveal key={i} delay={i * 100}>
              <CaseSection.Phase
                index={i}
                tag={service.number}
                title={service.name ?? ''}
                body={service.body ?? ''}
                icon={null}
              />
            </Reveal>
          ))}
        </CaseSection.Phases>
      )}

      {data.ctaLabel && data.ctaHref && (
        <Reveal>
          <div className="bbf-mth__cta">
            <a href={data.ctaHref} className="bbf-cta-link">
              {data.ctaLabel}
              <Icon icon={Icons.arrowRight} size="sm" aria-hidden />
            </a>
          </div>
        </Reveal>
      )}
    </Root>
  );
}
