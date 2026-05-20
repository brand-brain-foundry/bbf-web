'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

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
      className={cn('inline-flex items-center gap-1 text-sm', isPending && 'opacity-60', className)}
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
              className={cn(
                'px-1 py-1 transition-opacity duration-150 ease-out',
                isActive
                  ? 'cursor-default font-semibold text-[var(--bbf-text-on-light)]'
                  : [
                      'text-[var(--bbf-text-on-light)] opacity-60',
                      'hover:opacity-100',
                      'focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 focus-visible:opacity-100 focus-visible:outline-none',
                    ],
              )}
            >
              {loc.label}
            </button>
          </span>
        );
      })}
    </nav>
  );
}
