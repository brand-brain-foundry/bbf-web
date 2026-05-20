'use client';

import { useLocale } from 'next-intl';

const COPY = {
  es: 'Saltar al contenido',
  en: 'Skip to content',
} as const;

export function SkipLink() {
  const locale = useLocale() as 'es' | 'en';
  const label = COPY[locale === 'en' ? 'en' : 'es'];

  return (
    <a
      href="#main-content"
      data-component="bbf-skip-link"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-[var(--bbf-text-on-light)] focus:px-4 focus:py-2 focus:font-medium focus:text-[var(--bbf-surface-sand)] focus:no-underline focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {label}
    </a>
  );
}
