/**
 * CierreSection — §6 Cierre homepage BBF
 *
 * Última sección. Surface dark. Statement H2 + CTA outline-dark + firma brand.
 * NO SectionHeader, NO Lissajous, NO container statement.
 *
 * D-S6-01: H2 level="display-hero" as="h2" weight="medium"
 * D-S6-02: Button intent="outline-dark" size="xl" — hover border blue gradient (D-REBRAND-01)
 * D-S6-05: Surface DARK (--bbf-surface-dark-base = #0a0a0a)
 * D-S6-06: H2 line2 soft con .bbf-text-gradient-blue-animated (D-REBRAND-01)
 * D-S6-07: Pill firma con BBFLogo atom + nombre hardcoded + tagline Payload
 * D-S6-08: Statement H2 puro sin container
 */

import Link from 'next/link';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Icon, Icons } from '@/components/atoms/Icon';
import { BBFLogo } from '@/components/atoms/BBFLogo';
import { Reveal } from '@/components/atoms/Reveal';

export interface CierreData {
  eyebrow?: string | null;
  brandLine?: string | null;
  brandYear?: string | null;
  statementLine1?: string | null;
  statementLine2Soft?: string | null;
  cta?: {
    label?: string | null;
    href?: string | null;
  } | null;
  ctaNote?: string | null;
  signatureTagline?: string | null;
}

export function CierreSection({ data }: { data: CierreData }) {
  const year = data.brandYear || new Date().getFullYear().toString();
  const eyebrow = data.eyebrow ?? '§6 · CIERRE';
  const brandLine = data.brandLine ?? 'Sivar Brains';

  return (
    <section
      className="bbf-cierre"
      data-component="bbf-cierre-section"
      data-surface="dark"
      id="cierre"
    >
      <div className="bbf-section-wrap bbf-cierre__wrap">
        {/* Meta row */}
        <Reveal>
          <div className="bbf-cierre__meta">
            <Text
              as="span"
              variant="caption"
              className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-mono-xs)] tracking-wider uppercase"
            >
              {eyebrow}
            </Text>
            <span className="bbf-cierre__meta-rule" aria-hidden="true" />
            <Text
              as="span"
              variant="caption"
              className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-mono-xs)] tracking-wider"
            >
              {brandLine} · {year}
            </Text>
          </div>
        </Reveal>

        {/* Statement H2 — D-S6-01 + D-S6-06 + D-S6-08 */}
        <Reveal>
          <Heading
            as="h2"
            level="display-hero"
            weight="medium"
            align="center"
            className="bbf-cierre__title [color:var(--bbf-text-on-dark-surface)]"
          >
            {data.statementLine1 ?? 'Tu marca aprende una vez.'}
            <span className="bbf-cierre__title-soft bbf-text-gradient-blue-animated">
              {data.statementLine2Soft ?? 'Te representa en todos lados.'}
            </span>
          </Heading>
        </Reveal>

        {/* CTA principal + nota — D-S6-02 + D-S6-03 */}
        <Reveal>
          <div className="bbf-cierre__cta-wrap">
            <Button intent="outline-dark" size="xl" asChild>
              <Link href={data.cta?.href ?? '/contacto'}>
                {data.cta?.label ?? 'Sentémonos a pensar'}
                <Icon icon={Icons.arrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
            {data.ctaNote && (
              <Text
                as="p"
                variant="caption"
                className="bbf-cierre__note [font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-mono-xs)]"
              >
                {data.ctaNote}
              </Text>
            )}
          </div>
        </Reveal>

        {/* Firma brand — D-S6-07 */}
        <Reveal>
          <div className="bbf-cierre__signature">
            <BBFLogo variant="icon" size={22} aria-hidden />
            <span>
              <span className="bbf-cierre__sig-name">{brandLine}</span>
              {data.signatureTagline && (
                <>
                  {' · '}
                  <span className="bbf-cierre__sig-tag">{data.signatureTagline}</span>
                </>
              )}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
