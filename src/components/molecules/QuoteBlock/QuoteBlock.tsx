/**
 * QuoteBlock — molecule canónico BBF con variants testimonial + manifesto
 *
 * D-S5-06: extraído en 2da ocurrencia (§3 + §5) para evitar fragmentación.
 * variant="testimonial" → §3 Caso (surface dark via cascade de CaseSection)
 * variant="manifesto"   → §5 Método (surface warm via cascade de MetodoSection)
 * D-S3-ALIGN: surface-aware via --bbf-on-surface-* — sin prop surface (dead code).
 *
 * Refs: D-S5-06, D-S3-ALIGN, quote-block.css
 */

import type { ReactNode } from 'react';

export interface QuoteBlockProps {
  text: ReactNode;
  textSoft?: string;
  attribution?: string | null;
  variant?: 'testimonial' | 'manifesto';
  className?: string;
}

export function QuoteBlock({
  text,
  textSoft,
  attribution,
  variant = 'testimonial',
  className,
}: QuoteBlockProps) {
  const base = 'bbf-quote-block';
  const cls = [base, `${base}--${variant}`, className].filter(Boolean).join(' ');

  if (variant === 'testimonial') {
    return (
      <figure className={cls} data-component="bbf-quote-block">
        {/* D-S3-MARK: span Unicode ❝ + bbf-gradient-blue-animated (background-clip:text, scoped §3) */}
        <span className={`${base}__mark bbf-gradient-blue-animated`} aria-hidden="true">
          ❝
        </span>
        <blockquote className={`${base}__blockquote`}>
          <p className={`${base}__text`}>{text}</p>
        </blockquote>
        {attribution && <figcaption className={`${base}__attribution`}>{attribution}</figcaption>}
      </figure>
    );
  }

  // variant="manifesto" — text/textSoft igualan display-section-h2 (D-FIX-S5-04)
  return (
    <figure className={cls} data-component="bbf-quote-block">
      <blockquote className={`${base}__blockquote`}>
        <p className={`${base}__text`}>
          {text}
          {textSoft && (
            <span className={`${base}__text-soft bbf-gradient-blue-animated`}> {textSoft}</span>
          )}
        </p>
      </blockquote>
      {attribution && <figcaption className={`${base}__attribution`}>{attribution}</figcaption>}
    </figure>
  );
}
