/**
 * BBF Design System — LocaleSwitcher molecule
 *
 * Subordinado a: B-BBF-WEB-M5-D2-LOCALESWITCHER
 * Decisiones: D-77, D-78, D-82, D-83, D-85 (API monolítica)
 *
 * Refactor desde src/components/i18n/LocaleSwitcher.tsx flat.
 *
 * API monolítica canon BBF:
 *   <LocaleSwitcher locales={['es','en']} />
 *
 * NO compound dot notation (D-85 aplica A-01 SB_Law sobre D-79).
 *
 * M4 routing preservado 100% via next-intl router.
 * Auto-corrección §14: import path @/i18n/navigation (no @/lib/i18n/routing).
 * Auto-corrección §14: router.replace({ pathname, params }, { locale }) — API M4 canon.
 */

'use client';

import { useTransition } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  localeSwitcherVariants,
  localeSwitcherPillVariants,
  type LocaleSwitcherVariants,
} from './LocaleSwitcher.variants';

/**
 * Locale strings tipados canon BBF.
 * Si en M6+ se agregan locales, extender este type.
 */
export type SupportedLocale = 'es' | 'en';

/**
 * Locale display labels canon BBF.
 */
const LOCALE_LABELS: Record<SupportedLocale, string> = {
  es: 'ES',
  en: 'EN',
};

/**
 * Locale aria-labels canon BBF (bilingüe accessibility).
 */
const LOCALE_ARIA_LABELS: Record<SupportedLocale, { es: string; en: string }> = {
  es: { es: 'Cambiar a español', en: 'Switch to Spanish' },
  en: { es: 'Cambiar a inglés', en: 'Switch to English' },
};

export interface LocaleSwitcherProps extends LocaleSwitcherVariants {
  /**
   * Locales a mostrar (orden visible en UI).
   * Default: ['es', 'en']
   */
  locales?: SupportedLocale[];
  className?: string;
  /**
   * Custom aria-label para el nav container.
   */
  ariaLabel?: string;
}

/**
 * BBF LocaleSwitcher molecule — Atomic Design canon
 *
 * @description
 * Switcher de idioma canon BBF. API monolítica simple.
 * Preserva M4 routing (next-intl) sin modificar lógica.
 * Surface-aware via data-attribute ancestor.
 *
 * @example Default ES/EN
 * ```tsx
 * <LocaleSwitcher />
 * ```
 *
 * @example Surface dark explícito
 * ```tsx
 * <LocaleSwitcher surface="dark" size="lg" />
 * ```
 *
 * @example Custom locales orden
 * ```tsx
 * <LocaleSwitcher locales={['en', 'es']} />
 * ```
 *
 * @example Dentro de section con surface ancestor
 * ```tsx
 * <section data-surface="dark">
 *   <LocaleSwitcher />  // auto-detecta dark
 * </section>
 * ```
 */
export function LocaleSwitcher({
  locales = ['es', 'en'],
  surface,
  size,
  className,
  ariaLabel,
}: LocaleSwitcherProps) {
  const currentLocale = useLocale() as SupportedLocale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (locale: SupportedLocale) => {
    if (locale === currentLocale || isPending) return;
    startTransition(() => {
      // @ts-expect-error -- pathname/params son válidos en runtime,
      // TypeScript no puede verificar all routing combinations (M4 canon)
      router.replace({ pathname, params }, { locale });
    });
  };

  return (
    <nav
      data-component="bbf-locale-switcher"
      data-surface={surface !== 'auto' ? surface : undefined}
      className={cn(localeSwitcherVariants({ surface, size }), className)}
      aria-label={ariaLabel ?? 'Language switcher'}
    >
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            data-component="bbf-locale-switcher-pill"
            data-locale={locale}
            data-active={isActive || undefined}
            disabled={isActive || isPending}
            aria-current={isActive ? 'true' : undefined}
            aria-label={LOCALE_ARIA_LABELS[locale][currentLocale]}
            className={cn(localeSwitcherPillVariants({ size, active: isActive }))}
            onClick={() => handleSwitch(locale)}
          >
            {LOCALE_LABELS[locale]}
          </button>
        );
      })}
    </nav>
  );
}
