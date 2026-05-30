/**
 * MethodSection — D-89 section compound, Server Component
 * Root + Header + ProcessBar + Cards + Card + Quote + CTA sub-components.
 * L-BBF-216 SAFE: sin 'use client'. Sin sticky. Reveal individual desde page.tsx.
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Lissajous } from '@/components/atoms/Lissajous';
import { Icon, Icons } from '@/components/atoms/Icon';
import { methodSectionVariants } from './MethodSection.variants';
import type { MethodSectionVariants } from './MethodSection.variants';

// ── Root ──────────────────────────────────────────────────────

interface RootProps extends MethodSectionVariants {
  children: ReactNode;
  className?: string;
}

function Root({ children, surface, className }: RootProps) {
  return (
    <section
      data-component="bbf-method-section"
      data-surface={surface ?? 'sand'}
      className={methodSectionVariants({ surface, className } as Parameters<
        typeof methodSectionVariants
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
}

function Header({ eyebrow, h2Line1, h2Line2Soft }: HeaderProps) {
  return (
    <div className="bbf-method-header">
      <div className="bbf-method-header__left">
        {eyebrow && (
          <Text as="span" variant="caption" color="muted" className="bbf-method-header__eyebrow">
            {eyebrow}
          </Text>
        )}
        <div className="bbf-method-header__deco" aria-hidden="true">
          <Lissajous name="method-2d" animation="traveling" />
        </div>
      </div>
      <div className="bbf-method-header__right">
        <Heading level="display-section-h2" as="h2" color="primary" align="left">
          {h2Line1}
          <br />
          <span className="[color:var(--bbf-text-on-sand-muted)]">{h2Line2Soft}</span>
        </Heading>
      </div>
    </div>
  );
}

// ── ProcessBar ────────────────────────────────────────────────

const DEFAULT_PROCESS_STEPS = [
  { label: 'Diagnóstico', meta: '2–3 sem' },
  { label: 'Build', meta: '8–24 sem' },
  { label: 'Retainer', meta: 'Mensual' },
] as const;

interface ProcessBarStep {
  label: string;
  meta?: string;
}

interface ProcessBarProps {
  steps?: ProcessBarStep[];
}

function ProcessBar({ steps }: ProcessBarProps) {
  const stepsToRender: readonly ProcessBarStep[] = steps ?? DEFAULT_PROCESS_STEPS;

  return (
    <div className="bbf-method-bar" role="list" aria-label="Proceso BBF">
      {stepsToRender.map((step, i) => (
        <div key={step.label} className="bbf-method-bar__step" role="listitem">
          <div className="bbf-method-bar__node">
            <div className="bbf-method-bar__dot" aria-hidden="true" />
            <div className="bbf-method-bar__step-content">
              <Text as="span" variant="body-sm" weight="medium" color="primary">
                {step.label}
              </Text>
              {step.meta && (
                <Text as="span" variant="caption" color="muted">
                  {step.meta}
                </Text>
              )}
            </div>
          </div>
          {i < stepsToRender.length - 1 && (
            <div className="bbf-method-bar__line" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Cards ─────────────────────────────────────────────────────

interface CardsProps {
  children: ReactNode;
}

function Cards({ children }: CardsProps) {
  return <div className="bbf-method-cards">{children}</div>;
}

// ── Card ──────────────────────────────────────────────────────

interface CardProps {
  index: number;
  name: string;
  range: string;
  commit: string;
  body: string;
  deliverables?: Array<{ text?: string | null; id?: string | null }> | null;
}

function Card({ index, name, range, commit, body, deliverables }: CardProps) {
  const num = String(index).padStart(2, '0');

  return (
    <article className="bbf-method-card">
      <div className="bbf-method-card__head">
        {/* Número de servicio — mono font styling en FASE 3 via bbf-method-card__num */}
        <Text as="span" variant="caption" color="muted" className="bbf-method-card__num">
          {num}
        </Text>
        <Heading as="h3" level="h4" color="primary">
          {name}
        </Heading>
      </div>

      <div className="bbf-method-card__meta">
        <div className="bbf-method-card__meta-row">
          <Text as="span" variant="caption" tone="subtle" className="bbf-method-card__lbl">
            Duración
          </Text>
          <Text as="span" variant="body-sm" weight="medium" color="primary">
            {range}
          </Text>
        </div>
        <div className="bbf-method-card__meta-row">
          <Text as="span" variant="caption" tone="subtle" className="bbf-method-card__lbl">
            Compromiso
          </Text>
          <Text as="span" variant="body-sm" weight="medium" color="primary">
            {commit}
          </Text>
        </div>
      </div>

      <Text variant="body-lg" color="muted" className="bbf-method-card__body">
        {body}
      </Text>

      {deliverables && deliverables.length > 0 && (
        <ul className="bbf-method-card__list">
          {deliverables.map((item, i) => (
            <li key={item.id ?? `del-${i}`} className="bbf-method-card__item">
              <Icon icon={Icons.checkCircle} size="sm" color="primary" aria-hidden />
              <Text as="span" variant="body-sm" color="primary">
                {item.text}
              </Text>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

// ── Quote ─────────────────────────────────────────────────────

interface QuoteProps {
  main: string;
  soft: string;
  caption: string;
}

function Quote({ main, soft, caption }: QuoteProps) {
  return (
    <figure className="bbf-method-quote">
      <blockquote className="bbf-method-quote__body">
        <Heading asChild level="display-section-h2" align="center" color="primary">
          <p>
            {main}
            <br />
            <span className="[color:var(--bbf-text-on-sand-muted)]">{soft}</span>
          </p>
        </Heading>
      </blockquote>
      <figcaption className="bbf-method-quote__caption">
        <Text variant="caption" color="muted" align="center">
          {caption}
        </Text>
      </figcaption>
    </figure>
  );
}

// ── CTA (link-arrow inline — Q2 firmada) ──────────────────────

interface CTAProps {
  text: string;
  href: string;
}

function CTA({ text, href }: CTAProps) {
  return (
    <div className="bbf-method-cta">
      <Link href={href} className="bbf-method-cta__link">
        <Text as="span" variant="body-md" color="primary">
          {text}
        </Text>
        <Icon icon={Icons.arrowRight} size="sm" color="primary" aria-hidden />
      </Link>
    </div>
  );
}

// ── Compound export ───────────────────────────────────────────

export const MethodSection = Object.assign(Root, {
  Header,
  ProcessBar,
  Cards,
  Card,
  Quote,
  CTA,
});
