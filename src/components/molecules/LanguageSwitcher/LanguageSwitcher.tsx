'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import {
  languageSwitcherVariants,
  languageSwitcherButtonVariants,
} from './LanguageSwitcher.variants';

type Locale = 'es' | 'en';

const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: 'es', label: 'ES', native: 'Español' },
  { code: 'en', label: 'EN', native: 'English' },
];

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <nav
      aria-label="Language switcher"
      className={cn(languageSwitcherVariants({ pending: isPending }), className)}
    >
      {LOCALES.map((loc, idx) => {
        const isActive = locale === loc.code;
        return (
          <span key={loc.code} className="flex items-center">
            {idx > 0 && (
              <span aria-hidden="true" className="mx-1 text-[var(--bbf-border-on-light)]">
                |
              </span>
            )}
            <button
              type="button"
              onClick={() => switchLocale(loc.code)}
              disabled={isPending || isActive}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Switch to ${loc.native}`}
              lang={loc.code}
              className={languageSwitcherButtonVariants({ active: isActive })}
            >
              {loc.label}
            </button>
          </span>
        );
      })}
    </nav>
  );
}
