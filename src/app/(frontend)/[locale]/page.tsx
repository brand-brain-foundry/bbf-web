import { getPayload } from 'payload';
import config from '@/payload-config';
import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { CapabilitiesSection } from '@/components/sections/CapabilitiesSection';
import { CaseSection } from '@/components/sections/CaseSection';
import { PorqueSection } from '@/components/sections/PorqueSection';
import { MetodoSection } from '@/components/sections/MetodoSection';
import { CierreSection } from '@/components/sections/CierreSection';
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
import { interpolate } from '@/lib/content-interpolation';

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

  const {
    hero,
    capabilities: cap,
    caseStudy: cs,
    comparison: cmp,
    method: mth,
    closing: cls,
  } = site;

  // Pre-interpolate all editorial {{placeholder}} fields across §1-§6
  const l = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const [
    // §1 Hero
    h1Line1,
    h1Line2Soft,
    ledeBody,
    ledeEmphasis,
    // §2 Capabilities header
    capEyebrow,
    capH2Line1,
    capH2Line2Soft,
    capLead,
    // §3 Case Study
    csEyebrow,
    csH2Line1,
    csH2Line2Soft,
    csLead,
    csQuoteText,
    csQuoteCaption,
    // §5 Método
    mthEyebrow,
    mthH2Line1,
    mthH2Line2Soft,
    mthQuoteText,
    mthQuoteTextSoft,
    mthQuoteAttribution,
    mthCtaLabel,
    // §6 Cierre
    clsEyebrow,
    clsBrandLine,
    clsStatementLine1,
    clsStatementLine2Soft,
    clsCtaLabel,
    clsCtaNote,
    clsSignatureTagline,
  ] = await Promise.all([
    interpolate(hero?.h1Line1, l),
    interpolate(hero?.h1Line2Soft, l),
    interpolate(hero?.ledeBody, l),
    interpolate(hero?.ledeEmphasis, l),
    interpolate(cap?.eyebrow, l),
    interpolate(cap?.h2Line1, l),
    interpolate(cap?.h2Line2Soft, l),
    interpolate(cap?.lead, l),
    interpolate(cs?.eyebrow, l),
    interpolate(cs?.h2Line1, l),
    interpolate(cs?.h2Line2Soft, l),
    interpolate(cs?.lead, l),
    interpolate(cs?.quoteText, l),
    interpolate(cs?.quoteCaption, l),
    interpolate(mth?.eyebrow, l),
    interpolate(mth?.h2Line1, l),
    interpolate(mth?.h2Line2Soft, l),
    interpolate(mth?.quoteText, l),
    interpolate(mth?.quoteTextSoft, l),
    interpolate(mth?.quoteAttribution, l),
    interpolate(mth?.ctaLabel, l),
    interpolate(cls?.eyebrow, l),
    interpolate(cls?.brandLine, l),
    interpolate(cls?.statementLine1, l),
    interpolate(cls?.statementLine2Soft, l),
    interpolate(cls?.cta?.label, l),
    interpolate(cls?.ctaNote, l),
    interpolate(cls?.signatureTagline, l),
  ]);

  // §2 Hub spokes — names and metas interpolated
  const capHubSpokes = cap?.hubSpokes
    ? await Promise.all(
        cap.hubSpokes.map((s) =>
          Promise.all([interpolate(s.name ?? '', l), interpolate(s.meta ?? '', l)]).then(
            ([name, meta]) => ({ ...s, name, meta: meta || null }),
          ),
        ),
      )
    : undefined;
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
                {h1Line1}
                <br />
                <span data-tone="soft" className="bbf-gradient-blue-animated">
                  {h1Line2Soft}
                </span>
              </Heading>
            </div>

            <Reveal variant="up" delay={120}>
              <div className="bbf-hero__lede flex flex-col items-start gap-5">
                <Text className="bbf-lede max-w-[38ch] [color:var(--bbf-text-on-warm-muted)]">
                  {ledeBody}
                  {ledeEmphasis && (
                    <>
                      <br />
                      <span className="bbf-hero__lede-em font-medium [color:var(--bbf-text-on-warm)]">
                        {ledeEmphasis}
                      </span>
                    </>
                  )}
                </Text>

                <div className="bbf-hero__ctas flex flex-wrap gap-2.5">
                  <Button intent="primary" size="md" asChild className="bbf-gradient-dark-animated">
                    <a href={hero.ctaPrimary.href}>
                      {hero.ctaPrimary.label}
                      <Icon icon={Icons.arrowRight} size="sm" />
                    </a>
                  </Button>
                  <Button intent="ghost" size="md" asChild className="bbf-gradient-border-animated">
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
            eyebrow={capEyebrow || undefined}
            h2Line1={capH2Line1}
            h2Line2Soft={capH2Line2Soft}
            h2Line2SoftClassName="bbf-gradient-blue-animated"
            lead={capLead}
          />
        </Reveal>

        <CapabilitiesSection.Hub
          spokes={capHubSpokes?.map((s) => ({ name: s.name, meta: s.meta })) ?? undefined}
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
              eyebrow={csEyebrow || '§3 · CASO'}
              h2Line1={csH2Line1 || 'El cerebro'}
              h2Line2Soft={csH2Line2Soft || 'en producción.'}
              h2Line2SoftClassName="bbf-gradient-blue-animated"
              lead={csLead || undefined}
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

          {csQuoteText && (
            <Reveal variant="up">
              <CaseSection.Quote caption={csQuoteCaption || undefined}>
                {csQuoteText}
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
      {/* ─── MÉTODO SECTION §5 ──────────────────────────────────────────── */}
      {mth && (
        <MetodoSection
          data={{
            eyebrow: mthEyebrow || undefined,
            h2Line1: mthH2Line1 || undefined,
            h2Line2Soft: mthH2Line2Soft || undefined,
            phases: mth.phases?.map((p) => ({
              number: p.number,
              shortLabel: p.shortLabel,
              id: p.id,
            })),
            services: mth.services?.map((s) => ({
              number: s.number,
              name: s.name,
              duration: s.duration,
              commitment: s.commitment,
              body: s.body,
              deliverables: s.deliverables,
            })),
            quoteText: mthQuoteText || undefined,
            quoteTextSoft: mthQuoteTextSoft || undefined,
            quoteAttribution: mthQuoteAttribution || undefined,
            ctaLabel: mthCtaLabel || undefined,
            ctaHref: mth.ctaHref,
          }}
        />
      )}

      {/* ─── CIERRE SECTION §6 ──────────────────────────────────────────── */}
      {cls && (
        <CierreSection
          data={{
            eyebrow: clsEyebrow || undefined,
            brandLine: clsBrandLine || undefined,
            brandYear: cls.brandYear,
            statementLine1: clsStatementLine1 || undefined,
            statementLine2Soft: clsStatementLine2Soft || undefined,
            cta: cls.cta ? { ...cls.cta, label: clsCtaLabel || cls.cta.label } : undefined,
            ctaNote: clsCtaNote || undefined,
            signatureTagline: clsSignatureTagline || undefined,
          }}
        />
      )}
    </>
  );
}
