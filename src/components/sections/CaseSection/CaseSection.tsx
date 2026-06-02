/**
 * CaseSection — D-89 section compound, Server Component
 * §3 Caso — primer surface dark del homepage BBF.
 *
 * Compound:
 *   <CaseSection surface="dark">
 *     <SectionHeader surface="dark" h2Line2SoftClassName="bbf-text-gradient-blue-animated" ... />
 *     <CaseSection.Media>
 *       <CaseMediaFrame> ... </CaseMediaFrame>
 *     </CaseSection.Media>
 *     <CaseSection.Phases>
 *       <CaseSection.Phase index={0} tag="Antes" title="Situación" body="..." />
 *     </CaseSection.Phases>
 *     <CaseSection.Quote caption="...">Quote text</CaseSection.Quote>
 *     <CaseSection.Cta href="/casos/sivar-brains" label="Leer el caso completo" />
 *   </CaseSection>
 *
 * Surface: dark — tokens de semantic/colors-dark.css
 * Refs: D-89, D-CASO-1..6, home-case.jsx (diseño LEY)
 */

import type { ReactNode } from 'react';
import { Heading } from '@/components/atoms/Heading';
import { Icon, Icons } from '@/components/atoms/Icon';

/* ── Root ─────────────────────────────────────────────────── */

interface RootProps {
  children: ReactNode;
  surface?: 'dark';
  className?: string;
}

function Root({ children, surface = 'dark', className }: RootProps) {
  return (
    <section
      data-component="bbf-case-section"
      data-surface={surface}
      className={`bbf-case-section${className ? ` ${className}` : ''}`}
    >
      <div className="bbf-case-section__wrap">{children}</div>
    </section>
  );
}

/* ── Media ────────────────────────────────────────────────── */

function Media({ children }: { children: ReactNode }) {
  return <div className="bbf-case-section__media">{children}</div>;
}

/* ── Phases ───────────────────────────────────────────────── */

function Phases({ children }: { children: ReactNode }) {
  return <div className="bbf-case-section__phases">{children}</div>;
}

/* ── Phase ────────────────────────────────────────────────── */

interface PhaseProps {
  index: number;
  tag?: string | null;
  title: string;
  body: string;
}

function Phase({ index, tag, title, body }: PhaseProps) {
  return (
    <article className="bbf-case-section__phase">
      <div className="bbf-case-section__phase-head">
        <span className="bbf-case-section__phase-num">{String(index).padStart(2, '0')}</span>
        <span className="bbf-case-section__phase-divider" aria-hidden="true" />
        {tag && <span className="bbf-case-section__phase-tag">{tag}</span>}
      </div>
      <Heading level="display-step-title" as="h3" className="bbf-case-section__phase-title">
        {title}.
      </Heading>
      <p className="bbf-case-section__phase-body">{body}</p>
    </article>
  );
}

/* ── Quote ────────────────────────────────────────────────── */

interface QuoteProps {
  children: ReactNode;
  caption?: string | null;
}

function Quote({ children, caption }: QuoteProps) {
  return (
    <figure className="bbf-case-section__quote">
      {/* Quote mark SVG — home-case.jsx design spec */}
      <svg
        className="bbf-case-section__quote-mark"
        width="48"
        height="36"
        viewBox="0 0 48 36"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 36V20C0 8.95 8.95 0 20 0V8C13.37 8 8 13.37 8 20H20V36H0ZM28 36V20C28 8.95 36.95 0 48 0V8C41.37 8 36 13.37 36 20H48V36H28Z"
          fill="currentColor"
        />
      </svg>
      <blockquote>
        <p>{children}</p>
      </blockquote>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/* ── Cta ──────────────────────────────────────────────────── */

interface CtaProps {
  href: string;
  label: string;
}

function Cta({ href, label }: CtaProps) {
  return (
    <div className="bbf-case-section__cta">
      <a href={href} className="bbf-cta-link-dark">
        {label}
        <Icon icon={Icons.arrowRight} size="sm" />
      </a>
    </div>
  );
}

/* ── Compound export ─────────────────────────────────────── */

const CaseSection = Object.assign(Root, {
  Media,
  Phases,
  Phase,
  Quote,
  Cta,
});

export { CaseSection };
