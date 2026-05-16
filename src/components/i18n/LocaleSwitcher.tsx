'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

/**
 * LocaleSwitcher — botón discreto ES/EN en esquina superior derecha.
 *
 * Comportamiento:
 * - Locale activo destacado, otro locale clickeable
 * - Click → navega a path equivalente en otro locale
 * - Cookie NEXT_LOCALE persiste vía next-intl middleware automáticamente
 * - prefers-reduced-motion respetado
 *
 * v1 M4-C: maneja solo el segmento /locale.
 * M6 mejorará con pathnames lookup para slugs localizados dinámicos.
 */
export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLocale = (targetLocale: string) => {
    if (targetLocale === locale) return;

    let cleanPath = pathname;

    // Strip /en prefix when switching from EN
    if (locale === 'en' && pathname.startsWith('/en')) {
      cleanPath = pathname.replace(/^\/en/, '') || '/';
    }

    // Build target path — ES has no prefix (as-needed), EN has /en
    const newPath = targetLocale === 'es' ? cleanPath : `/en${cleanPath === '/' ? '' : cleanPath}`;

    router.push(newPath);
  };

  return (
    <nav className="bbf-locale-switcher" aria-label="Language switcher">
      {routing.locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            disabled={isActive}
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
