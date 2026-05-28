import { getPayload } from 'payload';
import config from '@/payload-config';
import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { HeroMediaFrame } from '@/components/molecules/HeroMediaFrame';
import { HeroTicker } from '@/components/molecules/HeroTicker';
import { HeroVideo } from '@/components/molecules/HeroVideo';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Icon, Icons } from '@/components/atoms/Icon';
import { Reveal } from '@/components/atoms/Reveal';
import type { Media } from '@/payload/payload-types';

export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const payload = await getPayload({ config });
  const site = await payload.findGlobal({
    slug: 'site-homepage',
    locale: locale as 'es' | 'en',
    depth: 1,
  });

  const { hero } = site;
  const posterUrl =
    hero.media.videoPoster && typeof hero.media.videoPoster === 'object'
      ? ((hero.media.videoPoster as Media).url ?? undefined)
      : undefined;

  return (
    <HeroSection surface="sand" height="auto" data-hero-decoration="grid-cols-12">
      {/* Outer single-col grid — outer spacing container */}
      <HeroSection.Grid
        cols="1"
        className="mx-auto w-full max-w-[1280px] px-6 py-[clamp(96px,11vw,132px)]"
      >
        {/* Head row — 2-col: title left, lede+CTAs right */}
        <HeroSection.Grid cols="2-1.4-1">
          <div>
            <Heading level="display-hero" color="primary" align="left">
              {hero.h1Line1}
              <br />
              <span data-tone="soft" className="bbf-text-gradient-red-animated">
                {hero.h1Line2Soft}
              </span>
            </Heading>
          </div>

          <Reveal variant="up" delay={120}>
            <div className="flex flex-col items-start gap-5">
              <Text variant="body-lg" color="secondary" align="left">
                {hero.ledeBody}
                {hero.ledeEmphasis && (
                  <>
                    <br />
                    <span className="font-medium text-[var(--bbf-text-on-sand)]">
                      {hero.ledeEmphasis}
                    </span>
                  </>
                )}
              </Text>

              <div className="flex flex-wrap gap-[10px]">
                <Button intent="primary" size="md" asChild>
                  <a href={hero.ctaPrimary.href}>
                    {hero.ctaPrimary.label}
                    <Icon icon={Icons.arrowRight} size="sm" />
                  </a>
                </Button>
                <Button intent="ghost" size="md" asChild>
                  <a href={hero.ctaSecondary.href}>
                    {hero.ctaSecondary.label}
                    <Icon icon={Icons.arrowRight} size="sm" />
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </HeroSection.Grid>

        {/* Media row — full width below head */}
        <Reveal variant="up" delay={240}>
          <div className="flex flex-col gap-0">
            <HeroMediaFrame>
              <HeroMediaFrame.Chrome
                label={hero.media.chromeLabel ?? undefined}
                recording
                recDuration="00:42"
              />
              <HeroMediaFrame.VideoShell>
                <HeroVideo controls preload="metadata" poster={posterUrl}>
                  {hero.media.videoSources?.map((s) => (
                    <HeroVideo.Source key={s.src} src={s.src} type={s.type} />
                  ))}
                </HeroVideo>
              </HeroMediaFrame.VideoShell>
              <HeroMediaFrame.Foot>
                <div className="flex flex-col gap-1">
                  <Text variant="caption" color="secondary">
                    {hero.media.demoLabel}
                  </Text>
                  <Text variant="caption" color="primary">
                    {hero.media.footCaption}
                  </Text>
                </div>
              </HeroMediaFrame.Foot>
            </HeroMediaFrame>

            {hero.ticker && hero.ticker.length > 0 && (
              <HeroTicker items={hero.ticker.map((t) => t.item)} durationSeconds={50} />
            )}
          </div>
        </Reveal>
      </HeroSection.Grid>
    </HeroSection>
  );
}
