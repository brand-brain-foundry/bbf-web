/**
 * SectionHeader — BBF molecule reutilizable §2–§7
 *
 * Layout grid 200px/1fr desktop → 1fr mobile (Claude Design Preview valores exactos).
 * Props: eyebrow + H2 (line1 + line2soft) + lead + decoration (slot para Lissajous).
 * Surface via data-surface — cascade de colores por contexto (section-header.css).
 *
 * D-85 molecule monolítica. D-89 section compound consumer.
 * Valores firmados: B-BBF-WEB-S2-N1-HEADER-VALORES-EXACTOS.
 * Surface dark: D-CASO-3 firmada 2026-06-02.
 * D-DS-07 (2026-06-12): SURFACE_TOKENS eliminado — colores via CSS [data-surface] cascade.
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
  surface?: 'warm' | 'sand' | 'dark';
  /** Override className para el span h2Line2Soft (ej: bbf-gradient-blue-animated). */
  h2Line2SoftClassName?: string;
}

export function SectionHeader({
  eyebrow,
  h2Line1,
  h2Line2Soft,
  lead,
  decoration,
  surface = 'warm',
  h2Line2SoftClassName,
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
            className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-xs)] tracking-wider uppercase"
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
          className="[font-feature-settings:'ss01','cv11'] text-balance"
        >
          {h2Line1}
          {h2Line2Soft && (
            <>
              <br />
              <span className={h2Line2SoftClassName ?? 'bbf-section-header__h2-soft'}>
                {h2Line2Soft}
              </span>
            </>
          )}
        </Heading>
        {lead && (
          <Text className="bbf-lede bbf-lede--medium [margin-top:var(--bbf-space-7)] [max-width:52ch]">
            {lead}
          </Text>
        )}
      </div>
    </div>
  );
}
