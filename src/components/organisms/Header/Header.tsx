import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { MobileMenu } from '@/components/molecules/MobileMenu';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

type HeaderProps = {
  className?: string;
};

/**
 * BBF Header — logo reducido D-BBF-KB-106, nav con underline animado,
 * CTA gradient, MobileMenu drawer canon D-BBF-KB-107
 */
export async function Header({ className }: HeaderProps) {
  const locale = await getLocale();
  const localeKey = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const localePrefix = localeKey === 'en' ? '/en' : '';

  const payload = await getPayload({ config });
  const [identity, navigation] = await Promise.all([
    payload.findGlobal({ slug: 'site-identity', locale: localeKey }),
    payload.findGlobal({ slug: 'site-navigation', locale: localeKey }),
  ]);

  const siteName = identity.siteName ?? 'Brand Brain Foundry';
  const headerLinks = navigation.headerLinks ?? [];
  const headerCta = navigation.headerCta;
  const homeHref = localeKey === 'en' ? '/en' : '/';

  return (
    <header
      data-component="bbf-header"
      className={cn(
        'fixed top-0 z-50 w-full',
        'bg-[var(--bbf-surface-sand)]/80 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
          {/* Logo — tamaño reducido D-BBF-KB-106: max text-base (16px) */}
          <Link
            href={homeHref}
            aria-label={`${siteName} — Home`}
            className={cn(
              'group inline-flex shrink-0 items-center',
              'font-bold tracking-tight',
              'text-sm sm:text-base',
              'text-[var(--bbf-text-on-sand)]',
              'transition-all duration-200 ease-out',
              'hover:text-[var(--bbf-accent-red)]',
              'focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
            )}
          >
            {siteName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {headerLinks.map((link, idx) => (
              <Link
                key={`${link.href}-${idx}`}
                href={`${localePrefix}${link.href}`}
                className={cn(
                  'group relative inline-flex items-center',
                  'text-sm font-medium',
                  'text-[var(--bbf-text-on-sand)]',
                  'transition-all duration-200 ease-out',
                  'hover:text-[var(--bbf-accent-red)]',
                  'focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
                )}
              >
                {link.label}
                {/* Underline animado al hover */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute -bottom-1 left-0 h-px',
                    'bg-[var(--bbf-accent-red)]',
                    'w-0 transition-all duration-300 ease-out',
                    'group-hover:w-full group-focus-visible:w-full',
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right cluster: CTA + LanguageSwitcher + MobileMenu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {headerCta?.label && (
              <Button
                asChild
                intent={
                  (headerCta.intent as 'primary' | 'secondary' | 'outline' | 'ghost') ?? 'primary'
                }
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href={`${localePrefix}${headerCta.href}`}>{headerCta.label}</Link>
              </Button>
            )}

            <LanguageSwitcher />

            <MobileMenu
              links={headerLinks.map((l) => ({ label: l.label ?? '', href: l.href }))}
              cta={
                headerCta?.label
                  ? {
                      label: headerCta.label,
                      href: headerCta.href,
                      intent:
                        (headerCta.intent as 'primary' | 'secondary' | 'outline') ?? 'primary',
                    }
                  : undefined
              }
              localePrefix={localePrefix}
              siteName={siteName}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
