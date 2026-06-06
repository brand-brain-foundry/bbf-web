import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Reveal } from '@/components/atoms/Reveal';
import { ContactForm } from '@/components/molecules/ContactForm';
import { buildHreflang } from '@/lib/seo/hreflang';
import { getSiteIdentity } from '@/config/site';

type Props = {
  params: Promise<{ locale: 'es' | 'en' }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, { siteDomain }] = await Promise.all([
    getTranslations({ locale, namespace: 'contact' }),
    getSiteIdentity(locale),
  ]);

  const alternates = buildHreflang('/contacto', locale, siteDomain);

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates,
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
        <Reveal variant="up" as="div">
          <div className="mb-12 space-y-4 lg:mb-16 lg:space-y-6">
            <Heading
              level="display-2"
              as="h1"
              weight="semibold"
              className="text-balance text-[var(--bbf-text-on-sand)] md:[font-size:var(--bbf-typography-display-1-size)]"
            >
              {t('title')}
            </Heading>

            <Heading level="h1" weight="medium" tone="muted" asChild>
              <p>{t('subtitle')}</p>
            </Heading>

            <Text
              variant="body-md"
              className="max-w-[60ch] text-pretty text-[var(--bbf-text-on-sand)]"
            >
              {t('intro')}
            </Text>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal variant="up" delay={120} as="div">
          <ContactForm locale={locale} />
        </Reveal>
      </Container>
    </div>
  );
}
