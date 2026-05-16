'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/**
 * LocaleSwitcher — botón discreto ES/EN en esquina superior derecha.
 *
 * Patrón canon next-intl 2026:
 * - Usa hooks de @/i18n/navigation (no next/navigation directamente)
 * - router.replace con { locale } cambia automáticamente:
 *   - Prefix según localePrefix: 'as-needed'
 *   - Slug según pathnames (cuando aplique en M6)
 *   - Cookie NEXT_LOCALE persiste via middleware
 *
 * Posición: fixed top-right (decisión Zavala 2026-05-16 Opción A)
 */
export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (targetLocale: string) => {
    if (targetLocale === locale) return;
    if (isPending) return;

    startTransition(() => {
      // @ts-expect-error -- pathname/params son válidos en runtime,
      // TypeScript no puede verificar all routing combinations
      router.replace({ pathname, params }, { locale: targetLocale });
    });
  };

  return (
    <nav
      className="bbf-locale-switcher"
      aria-label="Language switcher"
      data-pending={isPending ? 'true' : undefined}
    >
      {routing.locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            disabled={isActive || isPending}
            aria-current={isActive ? 'true' : undefined}
            aria-label={loc === 'es' ? 'Cambiar a español' : 'Switch to English'}
            className={`bbf-locale-switcher__btn${isActive ? 'bbf-locale-switcher__btn--active' : ''}`}
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </nav>
  );
}
