/**
 * CapabilitiesSection — D-89 section compound, Server Component
 * Root + Header + Hub + Grid sub-components via Object.assign.
 * L-BBF-216 SAFE: no 'use client'. Reveal + Lissajous are Client leaves (pre-existing).
 */
import type { ReactNode } from 'react';
import { Container } from '@/components/atoms/Container';
import { Lissajous } from '@/components/atoms/Lissajous';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { HubDiagram } from '@/components/molecules/HubDiagram';
import type { HubSpoke } from '@/components/molecules/HubDiagram';
import { capabilitiesSectionVariants } from './CapabilitiesSection.variants';
import type { CapabilitiesSectionVariants } from './CapabilitiesSection.variants';

// ── Root ──────────────────────────────────────────────────────

interface CapabilitiesSectionRootProps extends CapabilitiesSectionVariants {
  children: ReactNode;
  className?: string;
}

function CapabilitiesSectionRoot({ children, surface, className }: CapabilitiesSectionRootProps) {
  return (
    <section
      data-component="bbf-capabilities-section"
      data-surface={surface ?? 'sand'}
      className={capabilitiesSectionVariants({ surface, className } as Parameters<
        typeof capabilitiesSectionVariants
      >[0])}
    >
      <Container size="wide">{children}</Container>
    </section>
  );
}

// ── Header ────────────────────────────────────────────────────

interface HeaderProps {
  eyebrow?: string | null;
  h2Line1: string;
  h2Line2Soft: string;
  lead: string;
}

function Header({ eyebrow, h2Line1, h2Line2Soft, lead }: HeaderProps) {
  return (
    <SectionHeader
      eyebrow={eyebrow}
      h2Line1={h2Line1}
      h2Line2Soft={h2Line2Soft}
      lead={lead}
      decoration={<Lissajous name="trefoil-2d" animation="traveling-dot" />}
    />
  );
}

// ── Hub ───────────────────────────────────────────────────────

interface HubProps {
  spokes?: HubSpoke[];
}

async function Hub({ spokes }: HubProps = {}) {
  return (
    <div className="bbf-capabilities-hub-wrapper">
      <HubDiagram spokes={spokes} />
    </div>
  );
}

// ── Grid ──────────────────────────────────────────────────────

interface GridProps {
  children: ReactNode;
}

function Grid({ children }: GridProps) {
  return <div className="bbf-capabilities-grid">{children}</div>;
}

// ── Compound export ───────────────────────────────────────────

export const CapabilitiesSection = Object.assign(CapabilitiesSectionRoot, {
  Header,
  Hub,
  Grid,
});
