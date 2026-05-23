import { getLocale } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { MobileMenu } from '@/components/molecules/MobileMenu';
import { Button } from '@/components/atoms/Button';
import { HeaderDesktopNav } from './HeaderDesktopNav';
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
  const locale = await getLocale();
  const localeKey = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const localePrefix = localeKey === 'en' ? '/en' : '';

  const payload = await getPayload({ config });
  const [identity, navigation] = await Promise.all([
    payload.findGlobal({ slug: 'site-identity', locale: localeKey }),
    payload.findGlobal({ slug: 'site-navigation', locale: localeKey, depth: 2 }),
  ]);

  const siteName = identity.siteName ?? 'Brand Brain Foundry';
  const headerLinks = (navigation.headerLinks ?? []) as Array<{
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
              aria-label={`${siteName} — Home`}
              className={cn(
                'inline-flex shrink-0 items-center',
                'font-bold tracking-tight',
                'text-sm sm:text-base',
                'text-[var(--bbf-text-on-sand)]',
                'transition-all duration-200 ease-out',
                'hover:text-[var(--bbf-accent-red)]',
                'focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
              )}
            >
              <span>{siteName}</span>
            </Link>

            {/* Desktop nav — left-aligned, flex-1 para empujar right cluster */}
            <HeaderDesktopNav
              links={headerLinks}
              localePrefix={localePrefix}
              className="hidden flex-1 lg:flex"
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
                  <Link href={`${localePrefix}${headerCta.href}`}>{headerCta.label}</Link>
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
                        href: headerCta.href,
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
