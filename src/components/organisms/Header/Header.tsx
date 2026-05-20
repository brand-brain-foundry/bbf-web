import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

type HeaderProps = {
  className?: string;
};

export async function Header({ className }: HeaderProps) {
  const locale = await getLocale();
  const localeKey = locale === 'en' ? 'en' : 'es';

  const payload = await getPayload({ config });

  const [identity, navigation] = await Promise.all([
    payload.findGlobal({ slug: 'site-identity', locale: localeKey }),
    payload.findGlobal({ slug: 'site-navigation', locale: localeKey }),
  ]);

  const homeHref = localeKey === 'en' ? '/en' : '/';
  const siteName = identity.siteName ?? 'Brand Brain Foundry';
  const headerLinks = navigation.headerLinks ?? [];
  const headerCta = navigation.headerCta;

  return (
    <header
      data-component="bbf-header"
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-[var(--bbf-surface-sand)]/95 backdrop-blur-sm',
        'border-b border-[var(--bbf-border-on-light)]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo / Home link */}
          <Link
            href={homeHref}
            className="font-bold tracking-tight text-[var(--bbf-text-on-light)] transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 focus-visible:opacity-80 focus-visible:outline-none active:opacity-60"
            aria-label={`${siteName} — Home`}
          >
            <span className="text-base sm:text-lg lg:text-xl">{siteName}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {headerLinks.map((link, idx) => {
              const href = localeKey === 'en' ? `/en${link.href}` : link.href;
              return (
                <Link
                  key={`${link.href}-${idx}`}
                  href={href}
                  className="text-sm text-[var(--bbf-text-on-light)] transition-opacity duration-150 ease-out hover:opacity-70 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 focus-visible:opacity-100 focus-visible:outline-none active:opacity-50"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + LanguageSwitcher (right side) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {headerCta?.label && (
              <Button
                asChild
                intent={headerCta.intent ?? 'primary'}
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href={localeKey === 'en' ? `/en${headerCta.href}` : headerCta.href}>
                  {headerCta.label}
                </Link>
              </Button>
            )}
            <LanguageSwitcher />
            {/* TODO Wave 3: mobile hamburger menu */}
          </div>
        </div>
      </div>
    </header>
  );
}
