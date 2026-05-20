import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { cn } from '@/lib/utils';

type HeaderProps = {
  className?: string;
};

const NAV_LINKS = {
  es: [
    { href: '/cerebro-marca', label: 'Cerebro de marca' },
    { href: '/metodo', label: 'Método' },
    { href: '/casos', label: 'Casos' },
    { href: '/contacto', label: 'Contacto' },
  ],
  en: [
    { href: '/en/brand-brain', label: 'Brand Brain' },
    { href: '/en/method', label: 'Method' },
    { href: '/en/cases', label: 'Cases' },
    { href: '/en/contact', label: 'Contact' },
  ],
} as const;

export async function Header({ className }: HeaderProps) {
  const locale = await getLocale();
  const links = NAV_LINKS[locale === 'en' ? 'en' : 'es'];
  const homeHref = locale === 'en' ? '/en' : '/';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-[var(--bbf-surface-sand)]/95 backdrop-blur-sm',
        'border-b border-[var(--bbf-border-on-light)]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Home link */}
          <Link
            href={homeHref}
            className="font-bold tracking-tight text-[var(--bbf-text-on-light)] transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 focus-visible:opacity-80 focus-visible:outline-none active:opacity-60"
            aria-label="Brand Brain Foundry — Home"
          >
            <span className="text-lg sm:text-xl">Brand Brain Foundry</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--bbf-text-on-light)] transition-opacity duration-150 ease-out hover:opacity-70 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 focus-visible:opacity-100 focus-visible:outline-none active:opacity-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language switcher + mobile menu placeholder */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {/* TODO M6-BP-04: mobile hamburger menu */}
          </div>
        </div>
      </div>
    </header>
  );
}
