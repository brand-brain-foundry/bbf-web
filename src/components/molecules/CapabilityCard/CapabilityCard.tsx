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
      {/* Number block */}
      <div className="bbf-capability-card__num" aria-hidden="true">
        <Text as="span" variant="caption" color="muted">
          {String(num).padStart(2, '0')} / {capabilityLabel}
        </Text>
      </div>

      {/* Title */}
      <Heading as="h3" level="display-card-title" color="primary">
        {title}
      </Heading>

      {/* Lede */}
      <Text variant="body-lg" weight="medium" color="primary">
        {lede}
      </Text>

      {/* Body */}
      <Text variant="body-md" color="secondary">
        {body}
      </Text>

      {/* Bullets */}
      {bullets && bullets.length > 0 && (
        <ul className="bbf-capability-card__bullets">
          {bullets.map((bullet, i) => (
            <li key={bullet.id ?? i} className="bbf-capability-card__bullet">
              <Icon icon={Icons.checkCircle} size="sm" color="accent" aria-hidden />
              <Text as="span" variant="body-sm" color="primary">
                {bullet.text}
              </Text>
            </li>
          ))}
        </ul>
      )}

      {/* Example */}
      <blockquote className="bbf-capability-card__example">
        <Text as="span" variant="caption" color="muted">
          {exampleLabel}:
        </Text>{' '}
        <Text as="span" variant="body-sm" color="secondary">
          {example}
        </Text>
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
