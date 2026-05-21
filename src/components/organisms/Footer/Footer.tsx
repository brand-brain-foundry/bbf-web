import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { NewsletterBox } from '@/components/molecules/NewsletterBox';
import { BBFLogo } from '@/components/atoms/BBFLogo';
import { Badge } from '@/components/atoms/Badge';
import { cn } from '@/lib/utils';

type FooterProps = {
  className?: string;
};

type FlagVariant = 'default' | 'accent' | 'success' | 'beta';

/**
 * BBF Footer — canon Vercel-style (D-BBF-KB-120)
 *
 * DESKTOP:
 *   Col 1 (2fr): Brand identity — stamp animated + site name + tagline + desc
 *   Cols 2..N (1fr each): footerGroups (groupTitle + links + optional badges)
 *   Col last (1.5fr): Newsletter
 *
 * MOBILE:
 *   Stack vertical: Brand → Newsletter → Groups → Copyright
 *
 * Tipografía canon:
 *   Site name:   text-base bold (reducido desde h2 — D-BBF-KB-120)
 *   Tagline:     text-sm medium
 *   Desc:        text-sm muted
 *   Group title: text-xs bold uppercase tracking-wider muted
 *   Link:        text-sm regular
 *   Copyright:   text-micro muted
 */
export async function Footer({ className }: FooterProps) {
  const locale = await getLocale();
  const localeKey = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const localePrefix = localeKey === 'en' ? '/en' : '';
  const t = await getTranslations('footer');

  const payload = await getPayload({ config });
  const [identity, navigation, newsletter] = await Promise.all([
    payload.findGlobal({ slug: 'site-identity', locale: localeKey }),
    payload.findGlobal({ slug: 'site-navigation', locale: localeKey, depth: 2 }),
    payload.findGlobal({ slug: 'site-newsletter', locale: localeKey }),
  ]);

  const siteName = identity.siteName ?? 'Brand Brain Foundry';
  const tagline = identity.tagline;
  const shortDescription = identity.shortDescription;
  const footerGroups = (navigation.footerGroups ?? []) as Array<{
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
      className={cn(
        'mt-20 lg:mt-32',
        'bg-[var(--bbf-surface-sand)]',
        'border-t border-[var(--bbf-border-on-sand)]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        {/* Main grid: brand + groups + newsletter */}
        <div
          className="mb-10 grid grid-cols-1 gap-10 md:mb-12 md:gap-8 lg:gap-12"
          style={{
            ['--footer-cols' as string]: String(Math.max(groupsCount, 1)),
            gridTemplateColumns:
              groupsCount > 0 ? `2fr repeat(${groupsCount}, 1fr) 1.5fr` : undefined,
          }}
        >
          {/* Col 1: Brand identity */}
          <div className="order-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BBFLogo variant="stamp" size="sm" animated aria-hidden="true" />
              <p
                className={cn(
                  'font-[var(--bbf-font-display)]',
                  'text-[length:var(--bbf-text-base)]',
                  'leading-[var(--bbf-leading-snug)]',
                  'tracking-[var(--bbf-tracking-tight)]',
                  'font-[var(--bbf-weight-bold)]',
                  'text-[var(--bbf-text-on-sand)]',
                )}
              >
                {siteName}
              </p>
            </div>
            {tagline && (
              <p
                className={cn(
                  'text-[length:var(--bbf-text-sm)]',
                  'leading-[var(--bbf-leading-base)]',
                  'font-[var(--bbf-weight-medium)]',
                  'text-[var(--bbf-text-on-sand)]',
                )}
              >
                {tagline}
              </p>
            )}
            {shortDescription && (
              <p
                className={cn(
                  'text-[length:var(--bbf-text-sm)]',
                  'leading-[var(--bbf-leading-snug-small)]',
                  'text-[var(--bbf-text-on-sand-muted)]',
                  'max-w-xs',
                )}
              >
                {shortDescription}
              </p>
            )}
          </div>

          {/* Newsletter — order-2 mobile, last desktop */}
          {newsletter.enabled && (
            <div className="order-2 md:order-last">
              <NewsletterBox
                copy={{
                  title: newsletter.title ?? 'Cerebros de marca, cada quince días.',
                  description: newsletter.description ?? '',
                  emailPlaceholder: newsletter.emailPlaceholder ?? 'tu@email.com',
                  submitLabel: newsletter.submitLabel ?? 'Suscribirme',
                  submittingLabel: newsletter.submittingLabel ?? 'Enviando…',
                  successTitle: newsletter.successTitle ?? 'Revisá tu email',
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
              className="order-3 flex flex-col gap-3"
              aria-label={group.groupTitle}
            >
              <p
                className={cn(
                  'font-[var(--bbf-font-display)]',
                  'text-[length:var(--bbf-text-xs)]',
                  'tracking-[var(--bbf-tracking-wider)]',
                  'uppercase',
                  'font-[var(--bbf-weight-bold)]',
                  'text-[var(--bbf-text-on-sand-muted)]',
                )}
              >
                {group.groupTitle}
              </p>
              <ul className="flex flex-col gap-2">
                {group.links.map((link, lidx) => (
                  <li key={`${link.href}-${lidx}`}>
                    <Link
                      href={`${localePrefix}${link.href}`}
                      className={cn(
                        'group inline-flex items-center gap-2 py-1',
                        'min-h-[44px] md:min-h-0',
                        'text-[length:var(--bbf-text-sm)]',
                        'font-[var(--bbf-weight-regular)]',
                        'text-[var(--bbf-text-on-sand)]',
                        'transition-all duration-200 ease-out',
                        'hover:translate-x-0.5 hover:text-[var(--bbf-accent-red)]',
                        'focus-visible:translate-x-0.5 focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
                      )}
                    >
                      <span>{link.label}</span>
                      {link.flag && (
                        <Badge intent={(link.flagVariant ?? 'default') as FlagVariant} size="sm">
                          {link.flag}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 border-t border-[var(--bbf-border-on-sand)]/40 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[length:var(--bbf-text-micro)] text-[var(--bbf-text-on-sand-subtle)]">
            © {year} {siteName}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
