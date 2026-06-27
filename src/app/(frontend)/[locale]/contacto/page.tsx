import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { ContactSection } from '@/components/sections/ContactSection';
import { ContactForm } from '@/components/molecules/ContactForm';
import { StepsBlock } from '@/components/molecules/StepsBlock';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Reveal } from '@/components/atoms/Reveal';
import { buildHreflangBySlugMap } from '@/lib/seo/hreflang';
import { getSiteIdentity } from '@/config/site';

type Props = {
  params: Promise<{ locale: 'es' | 'en' }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = locale === 'en' ? 'en' : 'es';
  const payload = await getPayload({ config });
  const [contactPage, siteId, t] = await Promise.all([
    payload.findGlobal({ slug: 'site-contact-page', locale: l, depth: 0 }),
    getSiteIdentity(l),
    getTranslations({ locale, namespace: 'contact' }),
  ]);

  const metaTitle = contactPage.seo?.metaTitle ?? t('metaTitle');
  const metaDescription = contactPage.seo?.metaDescription ?? t('metaDescription');
  // D-CT-03: slugs localizados — ES: /contacto, EN: /en/contact
  const alternates = buildHreflangBySlugMap(
    locale,
    { es: 'contacto', en: 'contact' },
    siteId.siteDomain,
  );
  const canonicalUrl =
    l === 'en' ? `${siteId.siteDomain}/en/contact` : `${siteId.siteDomain}/contacto`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'website',
      url: canonicalUrl,
      locale: l === 'es' ? 'es_SV' : 'en_US',
      images: [{ url: `${siteId.siteDomain}/og/contacto.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const l = locale === 'en' ? 'en' : 'es';

  const payload = await getPayload({ config });
  const [contactPage, siteContact, siteId, t] = await Promise.all([
    payload.findGlobal({ slug: 'site-contact-page', locale: l, depth: 0 }),
    payload.findGlobal({ slug: 'site-contact', locale: l, depth: 0 }),
    getSiteIdentity(l),
    getTranslations({ locale, namespace: 'contact' }),
  ]);

  const hero = contactPage.hero;
  const steps = (contactPage.steps ?? []).filter(
    (s): s is { title: string; body?: string | null; id?: string | null } => Boolean(s.title),
  );
  const formConfig = contactPage.formConfig;
  const microcopy = contactPage.microcopy;
  const primaryEmail = siteContact.primaryEmail;

  const stageOptions = (formConfig?.stageOptions ?? [])
    .filter(
      (o): o is { value: string; label: string; id?: string | null } =>
        typeof o.value === 'string' && typeof o.label === 'string',
    )
    .map((o) => ({ value: o.value, label: o.label }));

  const roleOptions = (formConfig?.roleOptions ?? [])
    .filter(
      (o): o is { value: string; label: string; id?: string | null } =>
        typeof o.value === 'string' && typeof o.label === 'string',
    )
    .map((o) => ({ value: o.value, label: o.label }));

  // ── §9 JSON-LD @graph (SEO-AEO-contacto-SB §9.6/§9.7) ──────────────────────
  // D-CT-03: URLs localizadas
  const contactUrl =
    l === 'en' ? `${siteId.siteDomain}/en/contact` : `${siteId.siteDomain}/contacto`;
  const breadcrumbId = `${contactUrl}#breadcrumb`;
  // FAQPage @id: mismo para ambos locales (misma entidad) — §9.7
  const faqPageId = `${siteId.siteDomain}/contacto#faqpage`;

  const faqItems = (contactPage.faq ?? []).filter(
    (f): f is { question: string; answer: string; id?: string | null } =>
      Boolean(f.question && f.answer),
  );

  const contactGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      // ContactPage — localizado por locale (§9.3)
      {
        '@type': 'ContactPage',
        '@id': `${contactUrl}#webpage`,
        url: contactUrl,
        name: contactPage.seo?.metaTitle || undefined,
        description: contactPage.seo?.metaDescription || undefined,
        inLanguage: l === 'es' ? 'es-SV' : 'en-US',
        isPartOf: { '@id': `${siteId.siteDomain}/#website` },
        about: { '@id': `${siteId.siteDomain}/#organization` },
        breadcrumb: { '@id': breadcrumbId },
        ...(faqItems.length > 0 ? { mainEntity: { '@id': faqPageId } } : {}),
      },
      // BreadcrumbList — localizado por locale (§9.2)
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('breadcrumbHome'),
            item: l === 'en' ? `${siteId.siteDomain}/en` : `${siteId.siteDomain}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('breadcrumbPage'),
            item: contactUrl,
          },
        ],
      },
      // Organization — REFERENCIA @id del homepage (no redeclara; añade contactPoint) §9.4
      {
        '@type': 'Organization',
        '@id': `${siteId.siteDomain}/#organization`,
        contactPoint: {
          '@type': 'ContactPoint',
          '@id': `${siteId.siteDomain}/#sivar-brains-contactpoint`,
          contactType: 'sales',
          ...(primaryEmail ? { email: primaryEmail } : {}),
          url: `${siteId.siteDomain}/contacto`,
          availableLanguage: [
            { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
            { '@type': 'Language', name: 'English', alternateName: 'en' },
          ],
          areaServed: 'El Salvador', // D-10 firmado Zavala 2026-06-09
        },
      },
      // FAQPage — de admin cp_faq[], mismo @id ambos locales (§9.5, §9.7)
      ...(faqItems.length > 0
        ? [
            {
              '@type': 'FAQPage' as const,
              '@id': faqPageId,
              mainEntity: faqItems.map((f) => ({
                '@type': 'Question' as const,
                name: f.question,
                acceptedAnswer: { '@type': 'Answer' as const, text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  /* T4: top slot — H1 heading + lede (mobile: order 1) */
  const topContent = (
    <>
      {hero?.heading && (
        <Reveal variant="up" as="div">
          <div className="flex flex-col">
            <Heading
              level="display-section-h2"
              as="h1"
              weight="medium"
              className="[font-feature-settings:'ss01','cv11'] text-balance text-[var(--bbf-on-surface-title)]"
            >
              {hero.heading}
              {hero.subtitle && (
                <>
                  <br />
                  {/* G-02: gradient animated blue — mismo patrón que section headers del homepage */}
                  <span className="bbf-gradient-blue-animated">{hero.subtitle}</span>
                </>
              )}
            </Heading>
            {hero.lede && (
              <Text className="bbf-lede bbf-lede--medium [margin-top:var(--bbf-space-7)] max-w-[48ch] text-[var(--bbf-on-surface-body)]">
                {hero.lede}
              </Text>
            )}
          </div>
        </Reveal>
      )}
    </>
  );

  /* T4: bottom slot — steps + channels (mobile: order 3) */
  const bottomContent = (
    <div className="flex flex-col gap-8">
      {steps.length > 0 && (
        <Reveal variant="up" delay={80} as="div">
          <StepsBlock
            eyebrow={contactPage.stepsEyebrow ?? undefined}
            steps={steps.map((s) => ({ title: s.title, body: s.body }))}
          />
        </Reveal>
      )}
      {primaryEmail && (
        <Reveal variant="up" delay={160} as="div">
          <div className="flex flex-col gap-2">
            {microcopy?.otherChannelsLabel && (
              <Text
                variant="caption"
                className="[font-family:var(--bbf-font-mono)] [letter-spacing:var(--bbf-tracking-looser)] text-[var(--bbf-on-surface-muted)] uppercase"
              >
                {microcopy.otherChannelsLabel}
              </Text>
            )}
            <a
              href={`mailto:${primaryEmail}`}
              className="[font-size:var(--bbf-text-body-md)] font-medium text-[var(--bbf-on-surface-title)] underline-offset-4 hover:text-[var(--bbf-accent-blue)] hover:underline"
            >
              {primaryEmail}
            </a>
            {microcopy?.otherChannelsNote && (
              <Text variant="caption" className="text-[var(--bbf-on-surface-muted)]">
                {microcopy.otherChannelsNote}
              </Text>
            )}
          </div>
        </Reveal>
      )}
    </div>
  );

  /* Right slot: form card (mobile: order 2) */
  const rightContent = (
    <div className="flex flex-col gap-0">
      {/* Form card header: title + encrypted badge */}
      <div className="mb-5 flex items-center justify-between border-b border-[var(--bbf-on-surface-border)] pb-5">
        {formConfig?.title ? (
          <span className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-xs)] [letter-spacing:var(--bbf-tracking-looser)] text-[var(--bbf-on-surface-body)] uppercase">
            {formConfig.title}
          </span>
        ) : (
          <span />
        )}
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="bbf-contact-badge-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--bbf-contact-success-dot)]"
            aria-hidden="true"
          />
          <span className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-micro)] [letter-spacing:var(--bbf-tracking-loose)] text-[var(--bbf-on-surface-body)] uppercase">
            {l === 'en' ? 'End-to-end encrypted' : 'Cifrado extremo a extremo'}
          </span>
        </div>
      </div>

      <ContactForm
        locale={l}
        formConfig={{
          stageLabel: formConfig?.stageLabel,
          roleLabel: formConfig?.roleLabel,
          messagePlaceholder: formConfig?.messagePlaceholder,
          requiredHint: formConfig?.requiredHint,
          submitLabel: formConfig?.submitLabel,
          stageOptions,
          roleOptions,
        }}
        successTitle={microcopy?.successTitle}
        successBody={microcopy?.successBody}
      />
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactGraph) }}
      />
      <ContactSection top={topContent} right={rightContent} bottom={bottomContent} />
    </>
  );
}
