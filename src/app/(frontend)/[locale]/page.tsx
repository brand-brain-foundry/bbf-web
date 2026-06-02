import { getPayload } from 'payload';
import config from '@/payload-config';
import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { CapabilitiesSection } from '@/components/sections/CapabilitiesSection';
// ComoFuncionaSection desconectada (D-4 firmada) — componente conservado en /sections/ComoFuncionaSection/
import { CaseSection } from '@/components/sections/CaseSection';
import { PorqueSection } from '@/components/sections/PorqueSection';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { CaseMediaFrame } from '@/components/molecules/CaseMediaFrame';
import { Lissajous } from '@/components/atoms/Lissajous';
import { HeroMediaFrame, HeroRecTimer } from '@/components/molecules/HeroMediaFrame';
import { HeroTicker } from '@/components/molecules/HeroTicker';
import { HeroVideo } from '@/components/molecules/HeroVideo';
import { CapabilityCard } from '@/components/molecules/CapabilityCard';
import { CapabilityScene } from '@/components/molecules/CapabilityScene';
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

  const { hero, capabilities: cap, caseStudy: cs, comparison: cmp } = site;
  const posterUrl =
    hero.media.videoPoster && typeof hero.media.videoPoster === 'object'
      ? ((hero.media.videoPoster as Media).url ?? undefined)
      : undefined;

  // §3 Caso — video poster URL (si existe)
  const casePosterUrl =
    cs?.videoPoster && typeof cs.videoPoster === 'object'
      ? ((cs.videoPoster as Media).url ?? undefined)
      : undefined;
  const caseVideoSources = cs?.videoSources ?? [];

  return (
    <>
      <HeroSection
        surface="warm"
        height="auto"
        data-hero-decoration="grid-cols-12"
        className="bbf-hero"
      >
        {/* Outer single-col grid — outer spacing container */}
        <HeroSection.Grid cols="1" className="bbf-hero__grid bbf-container-wide mx-auto w-full">
          {/* Head row — 2-col: title left, lede+CTAs right */}
          <HeroSection.Grid cols="2-1.4-1" className="bbf-hero__head">
            <div>
              <Heading level="display-hero" color="primary" align="left" weight="medium">
                {hero.h1Line1}
                <br />
                <span data-tone="soft" className="bbf-text-gradient-red-animated">
                  {hero.h1Line2Soft}
                </span>
              </Heading>
            </div>

            <Reveal variant="up" delay={120}>
              <div className="bbf-hero__lede flex flex-col items-start gap-5">
                <Text className="bbf-lede [max-width:38ch] [color:var(--bbf-text-on-warm-muted)]">
                  {hero.ledeBody}
                  {hero.ledeEmphasis && (
                    <>
                      <br />
                      <span className="bbf-hero__lede-em font-medium text-[var(--bbf-text-on-warm)]">
                        {hero.ledeEmphasis}
                      </span>
                    </>
                  )}
                </Text>

                <div className="bbf-hero__ctas flex flex-wrap gap-[10px]">
                  <Button
                    intent="primary"
                    size="md"
                    asChild
                    className="bbf-btn-gradient-dark-animated"
                  >
                    <a href={hero.ctaPrimary.href}>
                      {hero.ctaPrimary.label}
                      <Icon icon={Icons.arrowRight} size="sm" />
                    </a>
                  </Button>
                  <Button intent="ghost" size="md" asChild className="bbf-btn-border-dark-animated">
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
            <div className="bbf-hero__media flex flex-col gap-0">
              <HeroMediaFrame className="bbf-hero__media-frame">
                <HeroMediaFrame.Chrome
                  label={hero.media.chromeLabel ?? undefined}
                  recording
                  className="bbf-hero__media-chrome"
                >
                  <HeroRecTimer />
                </HeroMediaFrame.Chrome>
                <HeroMediaFrame.VideoShell className="bbf-hero__video-shell">
                  <HeroVideo controls preload="metadata" poster={posterUrl}>
                    {hero.media.videoSources?.map((s) => (
                      <HeroVideo.Source key={s.src} src={s.src} type={s.type} />
                    ))}
                  </HeroVideo>
                </HeroMediaFrame.VideoShell>
                <HeroMediaFrame.Foot className="bbf-hero__media-foot">
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
                <HeroTicker
                  items={hero.ticker.map((t) => t.item)}
                  durationSeconds={50}
                  className="bbf-hero__ticker"
                />
              )}
            </div>
          </Reveal>
        </HeroSection.Grid>
      </HeroSection>

      <CapabilitiesSection surface="warm">
        <Reveal variant="up">
          <CapabilitiesSection.Header
            eyebrow={cap.eyebrow}
            h2Line1={cap.h2Line1 ?? ''}
            h2Line2Soft={cap.h2Line2Soft ?? ''}
            lead={cap.lead ?? ''}
          />
        </Reveal>

        <CapabilitiesSection.Hub
          spokes={cap.hubSpokes?.map((s) => ({ name: s.name ?? '', meta: s.meta })) ?? undefined}
        />

        <CapabilitiesSection.Grid>
          {(cap.items ?? []).map((c, i) => (
            <Reveal key={c.id ?? `cap-${i}`} variant="fade">
              <CapabilityCard align={i % 2 === 0 ? 'l' : 'r'} index={i + 1}>
                <CapabilityCard.Txt
                  num={i + 1}
                  title={c.title ?? ''}
                  lede={c.lede ?? ''}
                  body={c.body ?? ''}
                  bullets={c.bullets}
                  example={c.example ?? ''}
                />
                <CapabilityCard.Viz>
                  <CapabilityScene scene={c.scene} />
                </CapabilityCard.Viz>
              </CapabilityCard>
            </Reveal>
          ))}
        </CapabilitiesSection.Grid>
      </CapabilitiesSection>

      {/* ─── CASE SECTION §3 ─────────────────────────────────────────── */}
      {cs && (
        <CaseSection surface="dark">
          <Reveal variant="up">
            <SectionHeader
              surface="dark"
              eyebrow={cs.eyebrow ?? '§3 · CASO'}
              h2Line1={cs.h2Line1 ?? 'El cerebro'}
              h2Line2Soft={cs.h2Line2Soft ?? 'en producción.'}
              h2Line2SoftClassName="bbf-text-gradient-blue-animated"
              lead={cs.lead ?? undefined}
              decoration={<Lissajous name="case-2d" animation="traveling" />}
            />
          </Reveal>

          <Reveal variant="up" delay={80}>
            <CaseSection.Media>
              <CaseMediaFrame>
                <CaseMediaFrame.Chrome
                  label={cs.mediaChromeLabel ?? 'SIVAR-BRAINS · WhatsApp Business · live'}
                  timestamp={cs.mediaTimestamp ?? 'captura · 23:04 viernes'}
                  live
                />
                <CaseMediaFrame.Body>
                  {caseVideoSources.length > 0 ? (
                    <HeroVideo controls preload="metadata" poster={casePosterUrl}>
                      {caseVideoSources.map((s) => (
                        <HeroVideo.Source key={s.src} src={s.src} type={s.type} />
                      ))}
                    </HeroVideo>
                  ) : null}
                </CaseMediaFrame.Body>
              </CaseMediaFrame>
            </CaseSection.Media>
          </Reveal>

          <CaseSection.Phases>
            {(cs.phases ?? []).map((phase, i) => (
              <Reveal key={phase.id ?? `case-phase-${i}`} variant="up" delay={i * 100}>
                <CaseSection.Phase
                  index={i}
                  tag={phase.tag ?? ''}
                  title={phase.title ?? ''}
                  body={phase.body ?? ''}
                />
              </Reveal>
            ))}
          </CaseSection.Phases>

          {cs.quoteText && (
            <Reveal variant="up">
              <CaseSection.Quote caption={cs.quoteCaption ?? undefined}>
                {cs.quoteText}
              </CaseSection.Quote>
            </Reveal>
          )}

          <Reveal variant="up">
            <CaseSection.Cta
              href={cs.ctaHref ?? '/casos/sivar-brains'}
              label={cs.ctaLabel ?? 'Leer el caso completo'}
            />
          </Reveal>
        </CaseSection>
      )}

      {/* ─── POR QUÉ SECTION §4 ──────────────────────────────────────────── */}
      {cmp && (
        <PorqueSection>
          <Reveal variant="up">
            <SectionHeader
              surface="warm"
              eyebrow={cmp.eyebrow ?? '§4 · POR QUÉ'}
              h2Line1={cmp.h2Line1 ?? ''}
              h2Line2Soft={cmp.h2Line2Soft ?? undefined}
              lead={cmp.lead ?? undefined}
              decoration={<Lissajous name="cross-2d" animation="traveling" />}
            />
          </Reveal>

          <Reveal variant="fade">
            <PorqueSection.Comparison columns={cmp.columns} rows={cmp.rows} />
          </Reveal>

          <Reveal variant="up">
            <PorqueSection.Epilogue title={cmp.epilogue?.title} body={cmp.epilogue?.body} />
          </Reveal>
        </PorqueSection>
      )}
    </>
  );
}
