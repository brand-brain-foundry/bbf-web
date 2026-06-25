/**
 * CapabilityCard — D-86 compound, Server Component
 * Root + Txt + Viz sub-components via Object.assign.
 * L-BBF-216 SAFE: no 'use client' anywhere in this compound.
 */
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { Icons } from '@/components/atoms/Icon';
import { capabilityCardVariants } from './CapabilityCard.variants';
import type { CapabilityCardVariants } from './CapabilityCard.variants';

// ── Root ──────────────────────────────────────────────────────

interface CapabilityCardRootProps extends CapabilityCardVariants {
  children: ReactNode;
  index: number;
}

function CapabilityCardRoot({ children, align, index }: CapabilityCardRootProps) {
  return (
    <article
      data-component="bbf-capability-card"
      data-align={align ?? 'l'}
      data-index={index}
      className={capabilityCardVariants({ align })}
    >
      {children}
    </article>
  );
}

// ── Txt ───────────────────────────────────────────────────────

interface TxtProps {
  num: number;
  title: string;
  lede: string;
  body: string;
  bullets?: { text: string; id?: string | null }[] | null;
  example: string;
}

async function Txt({ num, title, lede, body, bullets, example }: TxtProps) {
  const t = await getTranslations('capabilities.ui');
  const capabilityLabel = t('capabilityLabel');
  const exampleLabel = t('exampleLabel');

  return (
    <div className="bbf-capability-card__txt">
      {/* Number: num + visual line + label (preview structure) */}
      <div className="bbf-capability-card__num" aria-hidden="true">
        <span className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-mono-md)]">
          {String(num).padStart(2, '0')}
        </span>
        <span className="bbf-capability-card__num-line" />
        <span className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-mono-xs)] [color:var(--bbf-on-surface-muted)]">
          {capabilityLabel}
        </span>
      </div>

      {/* Title H3 */}
      <Heading
        as="h3"
        level="display-card-title"
        color="primary"
        weight="medium"
        className="bbf-capability-card__title [font-feature-settings:'ss01','cv11'] text-balance [color:var(--bbf-on-surface-title)]"
      >
        {title}
      </Heading>

      {/* Lede — .bbf-lede--medium: 18px/16px, weight 500 — D-AUD-01 */}
      <Text className="bbf-capability-card__lede bbf-lede bbf-lede--medium [max-width:var(--bbf-capabilities-lede-measure)] [color:var(--bbf-on-surface-title)]">
        {lede}
      </Text>

      {/* Body — .bbf-lede: 18px/16px, weight 400 — D-AUD-01 */}
      <Text className="bbf-capability-card__body bbf-lede [max-width:var(--bbf-capabilities-body-measure)] [color:var(--bbf-on-surface-body)]">
        {body}
      </Text>

      {/* Bullets */}
      {bullets && bullets.length > 0 && (
        <ul className="bbf-capability-card__bullets">
          {bullets.map((bullet, i) => (
            <li key={bullet.id ?? i} className="bbf-capability-card__bullet">
              <Icon icon={Icons.checkCircle} size="sm" aria-hidden />
              <Text as="span" variant="body-md" className="[color:var(--bbf-on-surface-body)]">
                {bullet.text}
              </Text>
            </li>
          ))}
        </ul>
      )}

      {/* Example block */}
      <blockquote className="bbf-capability-card__example">
        <span className="bbf-capability-card__example-lbl">{exampleLabel}</span>
        <p className="bbf-capability-card__example-text">{example}</p>
      </blockquote>
    </div>
  );
}

// ── Viz ───────────────────────────────────────────────────────

interface VizProps {
  children: ReactNode;
}

function Viz({ children }: VizProps) {
  return <div className="bbf-capability-card__viz">{children}</div>;
}

// ── Compound export ───────────────────────────────────────────

export const CapabilityCard = Object.assign(CapabilityCardRoot, {
  Txt,
  Viz,
});
