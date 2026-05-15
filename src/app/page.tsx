import { BBFLogo } from '@/components/BBFLogo';
import { HeroVideo } from '@/components/HeroVideo';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[--color-bg-base]">
      {/* Background video (z-0) */}
      <HeroVideo />

      {/* Contenido principal centrado (z-20, 8pt grid spacing) */}
      <div
        className="relative z-20 mx-auto flex min-h-screen flex-col items-center justify-center text-center"
        style={{
          maxWidth: 'var(--hero-max-width)',
          paddingInline: 'var(--hero-padding-x)',
          paddingBlock: 'var(--hero-padding-y)',
        }}
      >
        <div className="hero-entrance hero-entrance--delay-1">
          <BBFLogo />
        </div>

        <h1
          className="hero-entrance hero-entrance--delay-2"
          style={{
            marginTop: 'var(--hero-gap-logo)',
            fontSize: 'var(--headline-size)',
            fontWeight: 'var(--headline-weight)',
            letterSpacing: 'var(--headline-tracking)',
            lineHeight: 'var(--headline-leading)',
            color: 'var(--color-text-primary)',
          }}
        >
          construimos
          <br />
          cerebros de marca.
        </h1>

        <p
          className="hero-entrance hero-entrance--delay-3"
          style={{
            marginTop: 'var(--hero-gap-tagline)',
            fontSize: 'var(--tagline-size)',
            fontWeight: 'var(--tagline-weight)',
            letterSpacing: 'var(--tagline-tracking)',
            color: 'var(--tagline-color)',
            textTransform: 'uppercase',
          }}
        >
          Próximamente
        </p>

        <a
          href="mailto:contacto@brandbrainfoundry.com"
          className="bbf-cta-pill hero-entrance hero-entrance--delay-4 inline-flex items-center"
          style={{
            marginTop: 'var(--hero-gap-cta)',
            backgroundColor: 'var(--btn-pill-bg)',
            color: 'var(--btn-pill-text)',
            paddingInline: 'var(--btn-pill-padding-x)',
            paddingBlock: 'var(--btn-pill-padding-y)',
            borderRadius: 'var(--btn-pill-radius)',
            textDecoration: 'none',
            fontSize: 'var(--bbf-text-base)',
            fontWeight: 500,
          }}
        >
          <span>contactanos</span>
          <span className="bbf-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </main>
  );
}
