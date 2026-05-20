import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/atoms/Container';
import { ContactForm } from '@/components/molecules/ContactForm';
import { cn } from '@/lib/utils';

type Props = {
  params: Promise<{ locale: 'es' | 'en' }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const dynamic = 'force-dynamic';

/**
 * BBF Contact page — canon Wave 7 (D-BBF-COPY-10)
 * Hero: eslogan FoundryCanon + subtitle + intro
 * Form: ContactForm molecule con tokens Wave 5
 */
export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <div
      data-component="bbf-contact-page"
      className="min-h-[calc(100vh-4rem)] bg-[var(--bbf-surface-sand)] pt-24 pb-20 lg:pt-32 lg:pb-32"
    >
      <Container size="prose">
        {/* Hero */}
        <div className="mb-12 space-y-4 lg:mb-16 lg:space-y-6">
          <h1
            className={cn(
              'font-[var(--bbf-font-display)]',
              'text-[length:var(--bbf-text-display-2)] md:text-[length:var(--bbf-text-display-1)]',
              'leading-[var(--bbf-leading-tight)]',
              'tracking-[var(--bbf-tracking-tight)]',
              'font-[var(--bbf-weight-semibold)]',
              'text-[var(--bbf-text-on-sand)]',
              'text-balance',
            )}
          >
            {t('title')}
          </h1>

          <p
            className={cn(
              'text-[length:var(--bbf-text-h1)]',
              'leading-[var(--bbf-leading-snug)]',
              'font-[var(--bbf-weight-medium)]',
              'text-[var(--bbf-text-on-sand-muted)]',
            )}
          >
            {t('subtitle')}
          </p>

          <p
            className={cn(
              'text-[length:var(--bbf-text-base)]',
              'leading-[var(--bbf-leading-base)]',
              'text-[var(--bbf-text-on-sand)]',
              'max-w-[60ch] text-pretty',
            )}
          >
            {t('intro')}
          </p>
        </div>

        {/* Form */}
        <ContactForm locale={locale} />
      </Container>
    </div>
  );
}
