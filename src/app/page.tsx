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

      {/* Contenido principal centrado (z-20) */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <BBFLogo />

        <h1
          className="mt-12 text-center"
          style={{
            fontSize: 'var(--headline-size)',
            fontWeight: 'var(--headline-weight)',
            letterSpacing: 'var(--headline-tracking)',
            lineHeight: 'var(--headline-leading)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-heading)',
            margin: 0,
          }}
        >
          construimos
          <br />
          cerebros de marca.
        </h1>

        <p
          className="mt-4 text-center"
          style={{
            fontSize: 'var(--bbf-text-base)',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          Próximamente.
        </p>

        <a
          href="mailto:contacto@brandbrainfoundry.com"
          className="mt-8 inline-block transition-colors hover:opacity-90"
          style={{
            backgroundColor: 'var(--btn-pill-bg)',
            color: 'var(--btn-pill-text)',
            paddingInline: 'var(--btn-pill-padding-x)',
            paddingBlock: 'var(--btn-pill-padding-y)',
            borderRadius: 'var(--btn-pill-radius)',
            textDecoration: 'none',
          }}
        >
          contactanos
        </a>
      </div>
    </main>
  );
}
