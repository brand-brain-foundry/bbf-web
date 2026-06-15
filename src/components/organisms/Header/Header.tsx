import { getLocale, getTranslations } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import Link from 'next/link';
import { getSiteIdentity } from '@/config/site';
import { SkipLink } from '@/components/atoms/SkipLink';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { BrandLogoLink } from '@/components/molecules/BrandLogoLink';
import { MobileMenu } from '@/components/molecules/MobileMenu';
import { Button } from '@/components/atoms/Button';
import { HeaderDesktopNav } from './HeaderDesktopNav';
import { resolveLinkHref } from '@/lib/nav/resolveLinkHref';
import { getCtaByKey } from '@/lib/payload/getSiteCtaLibrary';
import { cn } from '@/lib/utils';

type HeaderProps = {
  className?: string;
};

/**
 * BBF Header — floating card pattern canon Wave 8 (D-BBF-KB-111)
 *
 * Wrapper: fixed full-width pointer-events-none (hero clicks-through)
 * Inner: floating card [border-radius:var(--bbf-radius-floating)] + sand/95 backdrop-blur + shadow-floating
 * Layout: logo izq → nav izq (HeaderDesktopNav) → LangSwitch+CTA+Mobile der
 */
export async function Header({ className }: HeaderProps) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Header')]);
  const localeKey = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';

  const payload = await getPayload({ config });
  const [identity, navigation] = await Promise.all([
    getSiteIdentity(localeKey),
    payload.findGlobal({ slug: 'site-navigation', locale: localeKey, depth: 2 }),
  ]);

  const siteName = identity.siteName ?? 'Sivar Brains';
  // L2/L3 (D-NAV-8/9): href top-level Y subLinks resueltos desde linkTarget vía getPathname.
  const headerLinks = (navigation.headerLinks ?? []).map((l) => ({
    ...l,
    href: resolveLinkHref(l.linkTarget, localeKey),
    subLinks: l.subLinks?.map((s) => ({
      ...s,
      href: resolveLinkHref(s.linkTarget, localeKey, '#'),
    })),
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
  const headerCtaNav = navigation.headerCta;
  const headerCtaHref = resolveLinkHref(headerCtaNav?.linkTarget, localeKey, '/contacto');
  // D-NAV-11: label + intent vienen de SiteCtaLibrary, no del nav (C-01 SSOT).
  const headerCta = headerCtaNav?.ctaKey ? await getCtaByKey(headerCtaNav.ctaKey, localeKey) : null;

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
            'mx-auto [border-radius:var(--bbf-radius-floating)]',
            'bg-[var(--bbf-surface-sand)]/95 backdrop-blur-xl',
            'border border-[var(--bbf-border-on-sand)]',
            '[box-shadow:var(--bbf-shadow-floating)]',
          )}
        >
          <div className="flex h-14 items-center gap-3 px-4 sm:h-16 sm:gap-6 sm:px-5 lg:px-6">
            {/* Logo — D-NAV-12: BrandLogoLink molecule (href home locale-aware, logoVariant from BrandSystem) */}
            <BrandLogoLink locale={localeKey} ariaLabel={`${siteName} — ${t('logoAriaLabel')}`} />

            {/* Desktop nav — left-aligned, flex-1 para empujar right cluster */}
            <HeaderDesktopNav links={headerLinks} className="hidden flex-1 lg:ml-6 lg:flex" />

            {/* Spacer mobile */}
            <div className="flex-1 lg:hidden" />

            {/* Right cluster: CTA + LanguageSwitcher + MobileMenu trigger */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {headerCta && (
                <Button
                  asChild
                  fill={(headerCta.type as 'solid' | 'outline') ?? 'solid'}
                  intent={
                    (headerCta.intent as 'primary' | 'secondary' | 'black' | 'red') ?? 'primary'
                  }
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
                        fill: (headerCta.type as 'solid' | 'outline') ?? 'solid',
                        intent: headerCta.intent as
                          | 'primary'
                          | 'secondary'
                          | 'black'
                          | 'red'
                          | undefined,
                      }
                    : undefined
                }
                siteName={siteName}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
