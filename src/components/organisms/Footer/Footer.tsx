import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { NewsletterBox } from '@/components/molecules/NewsletterBox';
import { cn } from '@/lib/utils';

type FooterProps = {
  className?: string;
};

/**
 * BBF Footer — mobile-first canon 2026
 *
 * MOBILE (< md):
 *   - Single column stack (UXPin/SliderRevolution canon)
 *   - Order: Newsletter → Brand → Navigation → Copyright
 *   - Newsletter primero (mayor conversión + más prominente)
 *   - Touch targets 44px+ (WCAG AA)
 *
 * DESKTOP (md+):
 *   - 3 columnas grid (Brand | Navigation | Newsletter)
 *   - Spacing áureo
 */
export async function Footer({ className }: FooterProps) {
  const locale = await getLocale();
  const localeKey = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const localePrefix = localeKey === 'en' ? '/en' : '';
  const t = await getTranslations('footer');

  const payload = await getPayload({ config });
  const [identity, navigation, newsletter] = await Promise.all([
    payload.findGlobal({ slug: 'site-identity', locale: localeKey }),
    payload.findGlobal({ slug: 'site-navigation', locale: localeKey }),
    payload.findGlobal({ slug: 'site-newsletter', locale: localeKey }),
  ]);

  const siteName = identity.siteName ?? 'Brand Brain Foundry';
  const tagline = identity.tagline;
  const shortDescription = identity.shortDescription;
  const footerLinks = navigation.footerLinks ?? [];
  const year = new Date().getFullYear();

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
        {/* MOBILE STACK + DESKTOP 3-COL GRID */}
        <div className="mb-10 grid grid-cols-1 gap-10 md:mb-12 md:grid-cols-3 md:gap-8 lg:gap-12">
          {/* Newsletter — primero en mobile (mayor prominencia) */}
          {newsletter.enabled && (
            <div className="order-1 md:order-3">
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

          {/* Brand identity — segundo mobile */}
          <div className="order-2 space-y-3 md:order-1">
            <p className="text-[length:var(--bbf-text-h2)] leading-[var(--bbf-leading-snug)] font-[var(--bbf-font-display)] font-[var(--bbf-weight-bold)] tracking-[var(--bbf-tracking-tight)] text-[var(--bbf-text-on-sand)]">
              {siteName}
            </p>
            {tagline && (
              <p className="text-[length:var(--bbf-text-base)] leading-[var(--bbf-leading-base)] font-[var(--bbf-weight-medium)] text-[var(--bbf-text-on-sand)]">
                {tagline}
              </p>
            )}
            {shortDescription && (
              <p className="max-w-sm text-[length:var(--bbf-text-sm)] leading-[var(--bbf-leading-snug-small)] text-[var(--bbf-text-on-sand-muted)]">
                {shortDescription}
              </p>
            )}
          </div>

          {/* Navigation — tercero mobile */}
          {footerLinks.length > 0 && (
            <nav className="order-3 flex flex-col gap-3 md:order-2" aria-label="Footer navigation">
              <p className="text-[length:var(--bbf-text-sm)] font-[var(--bbf-font-display)] font-[var(--bbf-weight-semibold)] tracking-[var(--bbf-tracking-wider)] text-[var(--bbf-text-on-sand-muted)] uppercase">
                {t('navTitle')}
              </p>
              <ul className="flex flex-col gap-2">
                {footerLinks.map((link, idx) => (
                  <li key={`${link.href}-${idx}`}>
                    <Link
                      href={`${localePrefix}${link.href}`}
                      className={cn(
                        'group inline-flex min-h-[44px] items-center gap-1.5 py-1 md:min-h-0',
                        'text-[length:var(--bbf-text-base)] font-[var(--bbf-weight-medium)] md:text-[length:var(--bbf-text-sm)]',
                        'text-[var(--bbf-text-on-sand)]',
                        'transition-all duration-200 ease-out',
                        'hover:translate-x-0.5 hover:text-[var(--bbf-accent-red)]',
                        'focus-visible:translate-x-0.5 focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
                      )}
                    >
                      <span>{link.label}</span>
                      <span
                        aria-hidden="true"
                        className="-translate-x-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Bottom bar — copyright */}
        <div className="flex flex-col gap-2 border-t border-[var(--bbf-border-on-sand)]/40 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[length:var(--bbf-text-xs)] text-[var(--bbf-text-on-sand-subtle)]">
            © {year} {siteName}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
