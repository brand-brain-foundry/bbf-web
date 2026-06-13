import { getLocale, getTranslations } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import Link from 'next/link';
import { getSiteIdentity } from '@/config/site';
import { BrandLogo } from '@/components/atoms/BrandLogo';
import { SkipLink } from '@/components/atoms/SkipLink';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { MobileMenu } from '@/components/molecules/MobileMenu';
import { Button } from '@/components/atoms/Button';
import { HeaderDesktopNav } from './HeaderDesktopNav';
import { resolveLinkHref } from '@/lib/nav/resolveLinkHref';
import { cn } from '@/lib/utils';

type HeaderProps = {
  className?: string;
};

/**
 * BBF Header — floating card pattern canon Wave 8 (D-BBF-KB-111)
 *
 * Wrapper: fixed full-width pointer-events-none (hero clicks-through)
 * Inner: floating card rounded-2xl + sand/95 backdrop-blur + shadow-floating
 * Layout: logo izq → nav izq (HeaderDesktopNav) → LangSwitch+CTA+Mobile der
 */
export async function Header({ className }: HeaderProps) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Header')]);
  const localeKey = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const localePrefix = localeKey === 'en' ? '/en' : '';

  const payload = await getPayload({ config });
  const [identity, navigation] = await Promise.all([
    getSiteIdentity(localeKey),
    payload.findGlobal({ slug: 'site-navigation', locale: localeKey, depth: 2 }),
  ]);

  const siteName = identity.siteName ?? 'Sivar Brains';
  // L2 (D-NAV-8): href top-level resuelto desde linkTarget vía getPathname.
  //   subLinks siguen en href (L3 — D-NAV-9).
  const headerLinks = (navigation.headerLinks ?? []).map((l) => ({
    ...l,
    href: resolveLinkHref(l.linkTarget, localeKey),
  })) as Array<{
    label: string;
    href: string;
    hasSubMenu?: boolean;
    subLinks?: Array<{
      label: string;
      href: string;
      description?: string | null;
      mediaType: 'none' | 'image' | 'video';
      media?: {
        url?: string;
        alt?: string;
        width?: number;
        height?: number;
        mimeType?: string;
      } | null;
    }>;
  }>;
  const headerCta = navigation.headerCta;
  const headerCtaHref = resolveLinkHref(headerCta?.linkTarget, localeKey, '/contacto');
  const homeHref = localeKey === 'en' ? '/en' : '/';

  return (
    <header
      data-component="bbf-header"
      className={cn(
        'fixed top-0 right-0 left-0',
        'w-full',
        'z-[var(--bbf-z-header)]',
        'pointer-events-none',
        className,
      )}
    >
      <SkipLink />
      <div className="bbf-container-wide pointer-events-auto mx-auto box-border px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
        <div
          className={cn(
            'mx-auto rounded-2xl',
            'bg-[var(--bbf-surface-sand)]/95 backdrop-blur-xl',
            'border border-[var(--bbf-border-on-sand)]',
            '[box-shadow:var(--bbf-shadow-floating)]',
          )}
        >
          <div className="flex h-14 items-center gap-3 px-4 sm:h-16 sm:gap-6 sm:px-5 lg:px-6">
            {/* Logo */}
            <Link
              href={homeHref}
              aria-label={`${siteName} — ${t('logoAriaLabel')}`}
              className={cn(
                'inline-flex shrink-0 items-center',
                'text-[var(--bbf-text-on-sand)]',
                'transition-all duration-200 ease-out',
                '[@media(hover:hover)]:hover:text-[var(--bbf-accent-blue)]',
                'focus-visible:text-[var(--bbf-accent-blue)] focus-visible:outline-none',
              )}
            >
              <BrandLogo variant="icon" size="sm" aria-hidden />
            </Link>

            {/* Desktop nav — left-aligned, flex-1 para empujar right cluster */}
            <HeaderDesktopNav
              links={headerLinks}
              localePrefix={localePrefix}
              className="hidden flex-1 lg:ml-6 lg:flex"
            />

            {/* Spacer mobile */}
            <div className="flex-1 lg:hidden" />

            {/* Right cluster: CTA + LanguageSwitcher + MobileMenu trigger */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {headerCta && (
                <Button
                  asChild
                  intent={(headerCta.intent as 'primary' | 'secondary' | 'outline') ?? 'primary'}
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <Link href={headerCtaHref}>{headerCta.label}</Link>
                </Button>
              )}

              <LanguageSwitcher />

              <MobileMenu
                links={headerLinks.map((l) => ({
                  label: l.label,
                  href: l.href,
                  hasSubMenu: l.hasSubMenu,
                  subLinks: l.subLinks?.map((s) => ({
                    label: s.label,
                    href: s.href,
                    description: s.description,
                    mediaType: s.mediaType,
                    media: s.media,
                  })),
                }))}
                cta={
                  headerCta
                    ? {
                        label: headerCta.label,
                        href: headerCtaHref, // L2: resuelto desde linkTarget
                        intent: headerCta.intent as 'primary' | 'secondary' | 'outline' | undefined,
                      }
                    : undefined
                }
                localePrefix={localePrefix}
                siteName={siteName}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
