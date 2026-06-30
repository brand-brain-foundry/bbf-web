import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { getSiteIdentity } from '@/config/site';
import { interpolate } from '@/lib/content-interpolation';
import { resolveLinkHref } from '@/lib/nav/resolveLinkHref';
import { Container } from '@/components/atoms/Container';
import { Text } from '@/components/atoms/Text';
import { NewsletterBox } from '@/components/molecules/NewsletterBox';
import { BrandLogoLink } from '@/components/molecules/BrandLogoLink';
import { Badge } from '@/components/atoms/Badge';
import { navLinkBaseVariants, navLinkUnderlineVariants } from '@/components/atoms/NavLink';
import { cn } from '@/lib/utils';

type FooterProps = {
  className?: string;
};

type FlagVariant = 'default' | 'accent' | 'success' | 'beta';

/**
 * BBF Footer — canon Vercel-style (D-BBF-KB-120)
 *
 * DESKTOP:
 *   Col 1 (1.4fr): Brand identity — stamp animated + site name + tagline + desc
 *   Cols 2..N (1fr each): footerGroups (groupTitle + links + optional badges)
 *   Col last (1.4fr): Newsletter
 *
 * MOBILE:
 *   Stack vertical: Newsletter → Brand → Groups → Copyright
 *
 * Tipografía canon:
 *   Site name:   text-base bold (reducido desde h2 — D-BBF-KB-120)
 *   Tagline:     text-sm medium
 *   Desc:        text-sm muted
 *   Group title: text-xs bold uppercase tracking-wider muted
 *   Link:        text-sm regular
 *   Copyright:   text-legal muted (--bbf-text-legal = text-micro semantic role)
 */
export async function Footer({ className }: FooterProps) {
  const locale = await getLocale();
  const localeKey = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const t = await getTranslations('footer');

  const payload = await getPayload({ config });
  const [identity, navigation, newsletter] = await Promise.all([
    getSiteIdentity(localeKey),
    payload.findGlobal({ slug: 'site-navigation', locale: localeKey, depth: 2 }),
    payload.findGlobal({ slug: 'site-newsletter', locale: localeKey }),
  ]);

  const siteName = identity.siteName ?? 'Sivar Brains';
  const [tagline, shortDescription] = await Promise.all([
    interpolate(identity.siteTagline, localeKey),
    interpolate(identity.siteDescription, localeKey),
  ]);
  // L2 (D-NAV-8): href resuelto desde linkTarget vía getPathname.
  const footerGroups = (navigation.footerGroups ?? []).map((g) => ({
    groupTitle: g.groupTitle,
    links: (g.links ?? []).map((l) => ({
      label: l.label,
      href: resolveLinkHref(l.linkTarget, localeKey),
      flag: l.flag,
      flagVariant: l.flagVariant,
    })),
  })) as Array<{
    groupTitle: string;
    links: Array<{
      label: string;
      href: string;
      flag?: string | null;
      flagVariant?: FlagVariant;
    }>;
  }>;
  const year = new Date().getFullYear();
  const groupsCount = footerGroups.length;

  return (
    <footer
      data-component="bbf-footer"
      data-surface="sand"
      className={cn(
        'bbf-section-mt-default lg:bbf-section-mt-xl',
        'bg-[var(--bbf-surface-sand-shade)]' /* D-S4-01: misma piel que §4 PorqueSection */,
        'border-t border-[var(--bbf-on-surface-divider)]',
        className,
      )}
    >
      <Container
        size="wide"
        className="py-[var(--bbf-space-section-gap-sm)] lg:py-[var(--bbf-space-section-gap-md)]"
      >
        {/* Main grid: brand + groups + newsletter */}
        <div
          className={cn(
            'mb-10 grid lg:mb-12',
            'grid-cols-1 gap-12',
            'md:grid-cols-[1.4fr_repeat(var(--footer-cols),1fr)_1.4fr]',
            'md:gap-8 lg:gap-10',
          )}
          style={{
            ['--footer-cols' as string]: String(Math.max(groupsCount, 1)),
          }}
        >
          {/* Col 1: Brand identity */}
          <div className="order-2 flex flex-col gap-3 md:order-1 md:gap-4">
            <BrandLogoLink
              locale={localeKey}
              ariaLabel={siteName}
              variantOverride="horizontal"
              name={siteName}
            />
            {tagline && (
              <Text variant="body-sm" weight="bold" tone="default">
                {tagline}
              </Text>
            )}
            {shortDescription && (
              <Text variant="body-sm" tone="muted" className="max-w-xs">
                {shortDescription}
              </Text>
            )}
          </div>

          {/* Newsletter — order-1 mobile, last desktop */}
          {newsletter.enabled && (
            <div className="order-1 md:order-last">
              <NewsletterBox
                copy={{
                  title: newsletter.title ?? t('newsletter.title'),
                  description: newsletter.description ?? '',
                  emailPlaceholder: newsletter.emailPlaceholder ?? 'tu@email.com',
                  submitLabel: newsletter.submitLabel ?? t('newsletter.submitLabel'),
                  submittingLabel: newsletter.submittingLabel ?? t('newsletter.submittingLabel'),
                  successTitle: newsletter.successTitle ?? t('newsletter.successTitle'),
                  successMessage: newsletter.successMessage ?? '',
                  privacyNote: newsletter.privacyNote ?? '',
                }}
              />
            </div>
          )}

          {/* Group columns */}
          {footerGroups.map((group, idx) => (
            <nav
              key={`${group.groupTitle}-${idx}`}
              className="order-3 flex flex-col gap-3 md:order-2"
              aria-label={group.groupTitle}
            >
              <Text variant="eyebrow" tone="muted">
                {group.groupTitle}
              </Text>
              <ul className="flex flex-col gap-2">
                {group.links.map((link, lidx) => (
                  <li key={`${link.href}-${lidx}`}>
                    <Link
                      href={link.href}
                      className={cn(
                        navLinkBaseVariants({ active: false }),
                        'min-h-[44px] gap-2 py-1 md:min-h-0',
                      )}
                    >
                      <span>{link.label}</span>
                      {link.flag && (
                        <Badge intent={(link.flagVariant ?? 'default') as FlagVariant} size="xs">
                          {link.flag}
                        </Badge>
                      )}
                      <span
                        aria-hidden="true"
                        style={{ bottom: 'calc(-1 * var(--bbf-nav-underline-offset))' }}
                        className={navLinkUnderlineVariants({ active: false })}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 border-t border-[var(--bbf-on-surface-divider)]/40 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="[font-size:var(--bbf-text-legal)] text-[var(--bbf-on-surface-muted)]">
            © {year} {siteName}. {t('rights')}
          </p>
        </div>
      </Container>
    </footer>
  );
}
