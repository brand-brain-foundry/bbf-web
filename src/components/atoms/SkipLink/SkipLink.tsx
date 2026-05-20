'use client';

import { useTranslations } from 'next-intl';

export function SkipLink() {
  const t = useTranslations('common');

  return (
    <a
      href="#main-content"
      data-component="bbf-skip-link"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-[var(--bbf-text-on-light)] focus:px-4 focus:py-2 focus:font-medium focus:text-[var(--bbf-surface-sand)] focus:no-underline focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {t('skipToContent')}
    </a>
  );
}
