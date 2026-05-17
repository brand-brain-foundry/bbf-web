import { setRequestLocale } from 'next-intl/server';
import { BBFLogo } from '@/components/BBFLogo';
import { HeroVideo } from '@/components/HeroVideo';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headline = locale === 'es' ? 'construimos' : 'we build';
  const headline2 = locale === 'es' ? 'cerebros de marca.' : 'brand brains.';
  const tagline = locale === 'es' ? 'Próximamente' : 'Coming Soon';
  const cta = locale === 'es' ? 'contactanos' : 'contact us';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[--bbf-color-bg-base]">
      <LocaleSwitcher />
      {/* Background video (z-0) */}
      <HeroVideo />

      {/* Contenido principal centrado (z-20, 8pt grid spacing) */}
      <div
        className="relative z-20 mx-auto flex min-h-screen flex-col items-center justify-center text-center"
        style={{
          maxWidth: 'var(--bbf-hero-max-width)',
          paddingInline: 'var(--bbf-hero-padding-x)',
          paddingBlock: 'var(--bbf-hero-padding-y)',
        }}
      >
        <div className="hero-entrance hero-entrance--delay-1">
          <BBFLogo />
        </div>

        <h1
          className="hero-entrance hero-entrance--delay-2"
          style={{
            marginTop: 'var(--bbf-hero-gap-logo)',
            fontSize: 'var(--bbf-headline-size)',
            fontWeight: 'var(--bbf-headline-weight)',
            letterSpacing: 'var(--bbf-headline-tracking)',
            lineHeight: 'var(--bbf-headline-leading)',
            color: 'var(--bbf-color-text-primary)',
          }}
        >
          {headline}
          <br />
          {headline2}
        </h1>

        <p
          className="hero-entrance hero-entrance--delay-3"
          style={{
            marginTop: 'var(--bbf-hero-gap-tagline)',
            fontSize: 'var(--bbf-tagline-size)',
            fontWeight: 'var(--bbf-tagline-weight)',
            letterSpacing: 'var(--bbf-tagline-tracking)',
            color: 'var(--bbf-tagline-color)',
            textTransform: 'uppercase',
          }}
        >
          {tagline}
        </p>

        <a
          href="mailto:contacto@brandbrainfoundry.com"
          className="bbf-cta-pill hero-entrance hero-entrance--delay-4 inline-flex items-center"
          style={{
            marginTop: 'var(--bbf-hero-gap-cta)',
            backgroundColor: 'var(--bbf-btn-pill-bg)',
            color: 'var(--bbf-btn-pill-text)',
            paddingInline: 'var(--bbf-btn-pill-padding-x)',
            paddingBlock: 'var(--bbf-btn-pill-padding-y)',
            borderRadius: 'var(--bbf-btn-pill-radius)',
            textDecoration: 'none',
            fontSize: 'var(--bbf-text-base)',
            fontWeight: 500,
          }}
        >
          <span>{cta}</span>
          <span className="bbf-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </main>
  );
}
