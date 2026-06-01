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
        <span className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-mono-xs)] [color:var(--bbf-text-on-warm-faint)]">
          {capabilityLabel}
        </span>
      </div>

      {/* Title H3 */}
      <Heading
        as="h3"
        level="display-card-title"
        color="primary"
        weight="medium"
        className="bbf-capability-card__title [font-feature-settings:'ss01','cv11'] text-balance [color:var(--bbf-text-on-warm)]"
      >
        {title}
      </Heading>

      {/* Lede — 22px, weight 500, warm */}
      <Text
        variant="body-lg"
        weight="medium"
        color="primary"
        className="bbf-capability-card__lede [max-width:38ch] [font-size:var(--bbf-text-lead)] [color:var(--bbf-text-on-warm)]"
      >
        {lede}
      </Text>

      {/* Body — 18px, warm-muted */}
      <Text
        variant="body-lg"
        color="secondary"
        className="bbf-capability-card__body [max-width:50ch] [color:var(--bbf-text-on-warm-muted)]"
      >
        {body}
      </Text>

      {/* Bullets */}
      {bullets && bullets.length > 0 && (
        <ul className="bbf-capability-card__bullets">
          {bullets.map((bullet, i) => (
            <li key={bullet.id ?? i} className="bbf-capability-card__bullet">
              <Icon icon={Icons.checkCircle} size="sm" color="primary" aria-hidden />
              <Text as="span" variant="body-md" className="[color:var(--bbf-text-on-warm-soft)]">
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
