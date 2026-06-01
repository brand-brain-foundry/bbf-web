/**
 * SectionHeader — BBF molecule reutilizable §2–§7
 *
 * Layout grid 200px/1fr desktop → 1fr mobile (Claude Design Preview valores exactos).
 * Props: eyebrow + H2 (line1 + line2soft) + lead + decoration (slot para Lissajous).
 * Surface via data-surface — cascade de colores por contexto.
 *
 * D-85 molecule monolítica. D-89 section compound consumer.
 * Valores firmados: B-BBF-WEB-S2-N1-HEADER-VALORES-EXACTOS.
 */
import type { ReactNode } from 'react';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';

export interface SectionHeaderProps {
  eyebrow?: string | null;
  h2Line1: string;
  h2Line2Soft?: string | null;
  lead?: string | null;
  /** Decoración izquierda — típicamente un preset Lissajous */
  decoration?: ReactNode;
  surface?: 'warm' | 'sand';
}

export function SectionHeader({
  eyebrow,
  h2Line1,
  h2Line2Soft,
  lead,
  decoration,
  surface = 'warm',
}: SectionHeaderProps) {
  return (
    <div className="bbf-section-header" data-component="bbf-section-header" data-surface={surface}>
      {/* Left col: eyebrow + decoration */}
      <div className="bbf-section-header__deco-col">
        {eyebrow && (
          <Text
            as="span"
            variant="caption"
            color="muted"
            className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-xs)] tracking-wider [color:var(--bbf-text-on-warm-muted)] uppercase"
          >
            {eyebrow}
          </Text>
        )}
        {decoration && (
          <div className="bbf-section-header__deco" aria-hidden="true">
            {decoration}
          </div>
        )}
      </div>

      {/* Right col: H2 + lead */}
      <div>
        <Heading
          level="display-section-h2"
          as="h2"
          color="primary"
          align="left"
          weight="medium"
          className="[font-feature-settings:'ss01','cv11'] text-balance [color:var(--bbf-text-on-warm)]"
        >
          {h2Line1}
          {h2Line2Soft && (
            <>
              <br />
              <span className="[color:var(--bbf-text-on-warm-muted)]">{h2Line2Soft}</span>
            </>
          )}
        </Heading>
        {lead && (
          <Text
            variant="body-lg"
            color="secondary"
            className="[margin-top:var(--bbf-space-7)] [max-width:52ch] [font-size:var(--bbf-text-lead)] [line-height:var(--bbf-leading-snug-small)] [letter-spacing:-0.01em] [color:var(--bbf-text-on-warm-soft)]"
          >
            {lead}
          </Text>
        )}
      </div>
    </div>
  );
}
