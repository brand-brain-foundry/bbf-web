import { setRequestLocale } from 'next-intl/server';
import { BBFLogo } from '@/components/atoms/BBFLogo';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { HeroVideo } from '@/components/molecules/HeroVideo';
import { LocaleSwitcher } from '@/components/molecules/LocaleSwitcher';
import { HeroSection } from '@/components/sections/HeroSection';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headline = locale === 'es' ? 'construimos' : 'we build';
  const headline2 = locale === 'es' ? 'cerebros de marca.' : 'brand brains.';
  const tagline = locale === 'es' ? 'Próximamente' : 'Coming Soon';
  const cta = locale === 'es' ? 'contactanos' : 'contact us';

  return (
    <HeroSection surface="auto">
      <LocaleSwitcher />

      {/* Background video (z-0) — TD-M5-D3-01: poster pendiente M6+ */}
      <HeroVideo autoplay muted loop>
        <HeroVideo.Source src="/assets/media/hero/hero.av1.webm" type="webm-vp9" />
        <HeroVideo.Source src="/assets/media/hero/hero.h264.mp4" type="mp4-h264" />
      </HeroVideo>

      {/* Contenido principal centrado (z-20, 8pt grid via hero-section.css) */}
      <HeroSection.Content align="center">
        <div className="hero-entrance hero-entrance--delay-1">
          <BBFLogo variant="stamp" size="hero" animated />
        </div>

        <Heading
          level="display-lg"
          weight="bold"
          color="primary"
          align="center"
          className="hero-entrance hero-entrance--delay-2"
        >
          {headline}
          <br />
          {headline2}
        </Heading>

        <Text
          variant="overline"
          color="primary"
          align="center"
          className="hero-entrance hero-entrance--delay-3"
        >
          {tagline}
        </Text>

        {/* TD-M5-D4-01: hero-entrance → migrar a motion system M5-E */}
        <Button
          asChild
          intent="primary"
          size="lg"
          className="bbf-cta-pill hero-entrance hero-entrance--delay-4"
        >
          <a href="mailto:contacto@brandbrainfoundry.com">
            <span>{cta}</span>
            <span className="bbf-cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </Button>
      </HeroSection.Content>
    </HeroSection>
  );
}
