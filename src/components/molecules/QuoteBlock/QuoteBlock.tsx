/**
 * QuoteBlock — molecule canónico BBF con variants testimonial + manifesto
 *
 * D-S5-06: extraído en 2da ocurrencia (§3 + §5) para evitar fragmentación.
 * variant="testimonial" → §3 Caso (surface dark, left-align, quote mark SVG)
 * variant="manifesto"   → §5 Método (surface warm, centered, box elevado)
 *
 * Refs: D-S5-06, case-section.css (quote block origin)
 */

import type { ReactNode } from 'react';

export interface QuoteBlockProps {
  text: ReactNode;
  textSoft?: string;
  attribution?: string | null;
  surface?: 'warm' | 'dark';
  variant?: 'testimonial' | 'manifesto';
  className?: string;
}

export function QuoteBlock({
  text,
  textSoft,
  attribution,
  surface = 'dark',
  variant = 'testimonial',
  className,
}: QuoteBlockProps) {
  const base = 'bbf-quote-block';
  const cls = [base, `${base}--${variant}`, `${base}--${surface}`, className]
    .filter(Boolean)
    .join(' ');

  if (variant === 'testimonial') {
    return (
      <figure className={cls} data-component="bbf-quote-block">
        {/* Quote mark SVG — spec: home-case.jsx */}
        <svg
          className={`${base}__mark`}
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
            <span className={`${base}__text-soft bbf-text-gradient-red-animated`}> {textSoft}</span>
          )}
        </p>
      </blockquote>
      {attribution && <figcaption className={`${base}__attribution`}>{attribution}</figcaption>}
    </figure>
  );
}
