/**
 * CapabilitiesSection — D-89 section compound, Server Component
 * Root + Header + Hub + Grid sub-components via Object.assign.
 * L-BBF-216 SAFE: no 'use client'. Reveal + Lissajous are Client leaves (pre-existing).
 */
import type { ReactNode } from 'react';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Lissajous } from '@/components/atoms/Lissajous';
import { HubDiagram } from '@/components/molecules/HubDiagram';
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
    <div className="bbf-capabilities-header">
      {/* Left col: eyebrow + Lissajous deco */}
      <div className="bbf-capabilities-header__deco-col">
        {eyebrow && (
          <Text
            as="span"
            variant="caption"
            color="muted"
            className="mb-2 block [font-family:var(--bbf-font-mono)] tracking-wider uppercase"
          >
            {eyebrow}
          </Text>
        )}
        <div className="bbf-capabilities-header__deco" aria-hidden="true">
          <Lissajous name="trefoil-2d" animation="point-center" />
        </div>
      </div>

      {/* Right col: title + lead */}
      <div>
        <Heading level="display-section-h2" as="h2" color="primary" align="left">
          {h2Line1}
          <br />
          <span className="[color:var(--bbf-text-on-sand-muted)]">{h2Line2Soft}</span>
        </Heading>
        <Text variant="body-lg" color="secondary" className="mt-4">
          {lead}
        </Text>
      </div>
    </div>
  );
}

// ── Hub ───────────────────────────────────────────────────────

async function Hub() {
  return (
    <div className="bbf-capabilities-hub-wrapper">
      <HubDiagram />
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
