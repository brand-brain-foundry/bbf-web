import { BBFLogo } from '@/components/BBFLogo';
import { HeroVideo } from '@/components/HeroVideo';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[--color-bg-base]">
      {/* Background video (z-0) */}
      <HeroVideo />

      {/* Overlay sutil para legibilidad del texto sobre el video (z-10) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'var(--hero-overlay-color)',
          opacity: 'var(--hero-overlay-opacity)',
        }}
        aria-hidden="true"
      />

      {/* Contenido principal centrado (z-20, fluid responsive) */}
      <div
        className="relative z-20 mx-auto flex min-h-screen flex-col items-center justify-center text-center"
        style={{
          maxWidth: 'var(--hero-max-width)',
          paddingInline: 'var(--hero-padding-x)',
          paddingBlock: 'var(--hero-padding-y)',
        }}
      >
        <BBFLogo />

        <h1
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
          className="inline-block transition-opacity hover:opacity-90"
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
          contactanos
        </a>
      </div>
    </main>
  );
}
