import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { NewsletterBox } from '@/components/molecules/NewsletterBox';
import { cn } from '@/lib/utils';

type FooterProps = {
  className?: string;
};

export async function Footer({ className }: FooterProps) {
  const locale = await getLocale();
  const localeKey = locale === 'en' ? 'en' : 'es';
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
        'mt-24 border-t border-[var(--bbf-border-on-light)]',
        'bg-[var(--bbf-surface-sand)]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand identity */}
          <div className="space-y-3">
            <div className="text-lg font-bold text-[var(--bbf-text-on-light)]">{siteName}</div>
            {tagline && (
              <p className="text-sm font-medium text-[var(--bbf-text-on-light)]">{tagline}</p>
            )}
            {shortDescription && (
              <p className="max-w-xs text-sm text-[var(--bbf-text-on-light)]/70">
                {shortDescription}
              </p>
            )}
          </div>

          {/* Footer navigation */}
          {footerLinks.length > 0 && (
            <nav aria-label="Footer navigation" className="flex flex-col gap-2">
              {footerLinks.map((link, idx) => {
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
          )}

          {/* Newsletter subscription (Wave 4) */}
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

        <div className="border-t border-[var(--bbf-border-on-light)] pt-6 text-xs text-[var(--bbf-text-on-light)]/60">
          © {year} {siteName}. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
