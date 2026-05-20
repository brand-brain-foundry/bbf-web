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
 * BBF Footer — tokens Wave 5 (D-BBF-KB-104..108)
 * 3 columnas: Identity / Navigation / Newsletter
 * Links con flecha animada (matching MobileMenu canon)
 * Typography golden ratio, spacing áureo
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
        'mt-24 lg:mt-32',
        'bg-[var(--bbf-surface-sand)]',
        'border-t border-[var(--bbf-border-on-sand)]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3 lg:mb-12 lg:gap-12">
          {/* Column 1: Brand Identity */}
          <div className="space-y-3">
            <p className="text-[length:var(--bbf-text-h2)] leading-[var(--bbf-leading-snug)] font-[var(--bbf-font-display)] font-[var(--bbf-weight-bold)] tracking-[var(--bbf-tracking-tight)] text-[var(--bbf-text-on-sand)]">
              {siteName}
            </p>
            {tagline && (
              <p className="text-[length:var(--bbf-text-base)] leading-[var(--bbf-leading-base)] font-[var(--bbf-weight-medium)] text-[var(--bbf-text-on-sand)]">
                {tagline}
              </p>
            )}
            {shortDescription && (
              <p className="max-w-xs text-[length:var(--bbf-text-sm)] leading-[var(--bbf-leading-snug-small)] text-[var(--bbf-text-on-sand-muted)]">
                {shortDescription}
              </p>
            )}
          </div>

          {/* Column 2: Navigation */}
          {footerLinks.length > 0 && (
            <nav className="flex flex-col gap-2.5" aria-label="Footer navigation">
              <p className="mb-1 text-[length:var(--bbf-text-sm)] font-[var(--bbf-font-display)] font-[var(--bbf-weight-semibold)] tracking-[var(--bbf-tracking-wider)] text-[var(--bbf-text-on-sand-muted)] uppercase">
                {t('navTitle')}
              </p>
              {footerLinks.map((link, idx) => (
                <Link
                  key={`${link.href}-${idx}`}
                  href={`${localePrefix}${link.href}`}
                  className={cn(
                    'group inline-flex items-center gap-1.5',
                    'text-[length:var(--bbf-text-sm)] font-[var(--bbf-weight-medium)]',
                    'text-[var(--bbf-text-on-sand)]',
                    'transition-all duration-200 ease-out',
                    'hover:translate-x-0.5 hover:text-[var(--bbf-accent-red)]',
                    'focus-visible:text-[var(--bbf-accent-red)] focus-visible:outline-none',
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
              ))}
            </nav>
          )}

          {/* Column 3: Newsletter */}
          <div>
            {newsletter.enabled && (
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
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--bbf-border-on-sand)]/40 pt-6">
          <p className="text-[length:var(--bbf-text-xs)] text-[var(--bbf-text-on-sand-subtle)]">
            © {year} {siteName}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
