import { getPayload } from 'payload';
import { PulpoPixelLoader } from '@/components/atoms/PulpoPixel';
import config from '@/payload-config';
import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { CapabilitiesSection } from '@/components/sections/CapabilitiesSection';
import { CaseSection } from '@/components/sections/CaseSection';
import { PorqueSection } from '@/components/sections/PorqueSection';
import { MetodoSection } from '@/components/sections/MetodoSection';
import { CierreSection } from '@/components/sections/CierreSection';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { Lissajous } from '@/components/atoms/Lissajous';
import { HeroMediaFrame, HeroRecTimer } from '@/components/molecules/HeroMediaFrame';
import { HeroTicker } from '@/components/molecules/HeroTicker';
import { HeroVideo, type HeroVideoSourceType } from '@/components/molecules/HeroVideo';
import { CapabilityCard } from '@/components/molecules/CapabilityCard';
import { CapabilityScene } from '@/components/molecules/CapabilityScene';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Icon, Icons } from '@/components/atoms/Icon';
import { Reveal } from '@/components/atoms/Reveal';
import type { Media } from '@/payload/payload-types';
import { interpolateDeep, interpolate } from '@/lib/content-interpolation';
import { buildFaqPageJsonLd } from '@/lib/seo/jsonLd/faqPage';
import { buildVideoObjectJsonLd } from '@/lib/seo/jsonLd/videoObject';
import { getSiteIdentity } from '@/config/site';
import { getCtaByKey } from '@/lib/payload/getSiteCtaLibrary';
import { Timeline } from '@/components/molecules/Timeline';

export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const l = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';

  const payload = await getPayload({ config });
  const [rawSite, siteId] = await Promise.all([
    // depth:2 (antes 1) — D-BBF-MEDIA-PACKAGE: hero.media.videoPackage y
    // caseStudy.videoPackage son una relación (nivel 1); sus propios campos
    // primary/fallback/poster son relaciones A MEDIA (nivel 2) — sin depth:2
    // esos llegarían como IDs sueltos, no como Media completos con .url.
    payload.findGlobal({ slug: 'site-homepage', locale: l, depth: 2 }),
    getSiteIdentity(l),
  ]);
  // D-PLACEHOLDER-01: interpolateDeep cubre TODOS los campos del global en una pasada.
  // Campos futuros quedan cubiertos automáticamente — sin listas manuales.
  const site = await interpolateDeep(rawSite, l);

  const {
    hero,
    capabilities: cap,
    caseStudy: cs,
    comparison: cmp,
    method: mth,
    closing: cls,
  } = site;
  // §1 Hero CTAs — resolved from SiteCtaLibrary (D-E2-09 rev: array, max 2)
  const heroCtas = (
    await Promise.all(
      (hero.ctas ?? []).slice(0, 2).map(({ ctaKey }) => (ctaKey ? getCtaByKey(ctaKey, l) : null)),
    )
  ).filter((cta): cta is NonNullable<typeof cta> => cta !== null);

  // §6 Cierre CTA — resolved from SiteCtaLibrary (D-S456-02: outline+secondary via ctaKey)
  const closingCta = cls?.ctaKey ? await getCtaByKey(cls.ctaKey, l) : null;

  // D-BBF-MEDIA-PACKAGE (Fase-Package-02) — helpers agnósticos (I-1..I-5,
  // sin voz/marca hardcodeada). VideoPackage no guarda "type" por fuente
  // (el diagnóstico confirmó que mimeType solo no distingue codec) —
  // primary/fallback son roles fijos por diseño: primary = mejor codec
  // moderno, fallback = universal. Se deriva un default razonable acorde
  // a ese rol, no un valor inventado.
  const toAbsoluteUrl = (url: string) =>
    url.startsWith('http') ? url : `${siteId.siteDomain}${url}`;
  const primaryMimeToSourceType = (mimeType?: string | null): HeroVideoSourceType =>
    mimeType === 'video/quicktime' ? 'mov' : 'webm-vp9';
  const fallbackMimeToSourceType = (mimeType?: string | null): HeroVideoSourceType =>
    mimeType === 'video/quicktime' ? 'mov' : 'mp4-h264';

  const heroPkg =
    hero.media.videoPackage && typeof hero.media.videoPackage === 'object'
      ? hero.media.videoPackage
      : undefined;
  const heroPrimary =
    heroPkg?.primary && typeof heroPkg.primary === 'object'
      ? (heroPkg.primary as Media)
      : undefined;
  const heroFallback =
    heroPkg?.fallback && typeof heroPkg.fallback === 'object'
      ? (heroPkg.fallback as Media)
      : undefined;
  const heroPosterMedia =
    heroPkg?.poster && typeof heroPkg.poster === 'object' ? (heroPkg.poster as Media) : undefined;

  // G-02: fallback a hero-poster.png estático si admin no tiene poster subido (LCP)
  const posterUrl = heroPosterMedia?.url ?? '/hero-poster.png';

  const casePkg =
    cs?.videoPackage && typeof cs.videoPackage === 'object' ? cs.videoPackage : undefined;
  const casePrimary =
    casePkg?.primary && typeof casePkg.primary === 'object'
      ? (casePkg.primary as Media)
      : undefined;
  const caseFallback =
    casePkg?.fallback && typeof casePkg.fallback === 'object'
      ? (casePkg.fallback as Media)
      : undefined;
  const casePosterMedia =
    casePkg?.poster && typeof casePkg.poster === 'object' ? (casePkg.poster as Media) : undefined;
  const casePosterUrl = casePosterMedia?.url ?? undefined;

  const resolveInLanguage = (pkgLang?: 'es' | 'en' | null): 'es-SV' | 'en-US' =>
    (pkgLang ?? l) === 'es' ? 'es-SV' : 'en-US';

  // A6 (AEO): 1 VideoObject por paquete (contentUrl único — heroPrimary),
  // NUNCA uno por formato (diagnóstico D-BBF-MEDIA-PACKAGE §6).
  const heroVideoObjectSchema = heroPrimary?.url
    ? buildVideoObjectJsonLd({
        id: `${siteId.siteDomain}/#video-hero`,
        name: heroPkg?.seoName || hero.media.demoLabel,
        description: heroPkg?.seoDescription || hero.media.footCaption || hero.media.demoLabel,
        thumbnailUrl: toAbsoluteUrl(posterUrl),
        contentUrl: toAbsoluteUrl(heroPrimary.url),
        uploadDate: site.updatedAt ?? new Date().toISOString(),
        duration: heroPkg?.duration,
        inLanguage: resolveInLanguage(heroPkg?.inLanguage),
        publisherId: `${siteId.siteDomain}/#org`,
      })
    : null;

  const caseVideoObjectSchema = casePrimary?.url
    ? buildVideoObjectJsonLd({
        id: `${siteId.siteDomain}/#video-case`,
        name: casePkg?.seoName || cs?.mediaChromeLabel || cs?.h2Line1 || '',
        description: casePkg?.seoDescription || cs?.lead || cs?.mediaChromeLabel || '',
        thumbnailUrl: toAbsoluteUrl(casePosterUrl ?? posterUrl),
        contentUrl: toAbsoluteUrl(casePrimary.url),
        uploadDate: site.updatedAt ?? new Date().toISOString(),
        duration: casePkg?.duration,
        inLanguage: resolveInLanguage(casePkg?.inLanguage),
        publisherId: `${siteId.siteDomain}/#org`,
      })
    : null;

  // G-19: FAQPage JSON-LD from admin faq[] (Sprint 2 — campo canónico, no hardcoded)
  const faqItems = (site.seo?.faq ?? [])
    .filter((item): item is { question: string; answer: string; id?: string | null } =>
      Boolean(item.question && item.answer),
    )
    .map((item) => ({ question: item.question as string, answer: item.answer as string }));
  const faqSchema =
    faqItems.length > 0 ? buildFaqPageJsonLd(faqItems, `${siteId.siteDomain}/#faqpage-home`) : null;

  // Sprint 1 G-03: WebPage JSON-LD — @id correcto (#webpage-home), description, primaryImageOfPage
  const [siteTaglineInterp, siteDescriptionInterp] = await Promise.all([
    interpolate(siteId.siteTagline, l),
    interpolate(siteId.siteDescription, l),
  ]);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteId.siteDomain}/#webpage-home`,
    url: l === 'en' ? `${siteId.siteDomain}/en` : siteId.siteDomain,
    name: siteTaglineInterp ? `${siteId.siteName} · ${siteTaglineInterp}` : siteId.siteName,
    description: siteDescriptionInterp || undefined,
    inLanguage: l === 'es' ? 'es-SV' : 'en-US',
    dateModified: site.updatedAt,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${siteId.siteDomain}/og-image.png`,
      width: 1200,
      height: 630,
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteId.siteDomain}/#website`,
      url: siteId.siteDomain,
    },
  };

  return (
    <>
      <HeroSection
        surface="dark"
        height="auto"
        data-hero-decoration="grid-cols-12"
        className="bbf-hero"
      >
        {/* Outer single-col grid — outer spacing container */}
        <HeroSection.Grid cols="1" className="bbf-hero__grid bbf-container-wide mx-auto w-full">
          <HeroSection.Grid cols="2-1.4-1" className="bbf-hero__head">
            <div data-oct-obstacle>
              <Heading
                level="display-hero"
                color="primary"
                align="left"
                weight="medium"
                className="bbf-hero__title"
              >
                {hero.h1Line1 ?? ''}
                <br />
                <span data-tone="soft" className="bbf-gradient-blue-animated">
                  {hero.h1Line2Soft ?? ''}
                </span>
              </Heading>
            </div>

            <Reveal variant="up" delay={120}>
              <div className="bbf-hero__lede flex flex-col items-start gap-5" data-oct-obstacle>
                <Text className="bbf-lede max-w-[38ch]">
                  {hero.ledeBody ?? ''}
                  {hero.ledeEmphasis && (
                    <>
                      <br />
                      <span className="bbf-hero__lede-em font-medium [color:var(--bbf-on-surface-bright)]">
                        {hero.ledeEmphasis}
                      </span>
                    </>
                  )}
                </Text>

                {heroCtas.length > 0 && (
                  <div className="bbf-hero__ctas flex flex-wrap gap-2.5">
                    {heroCtas.map((cta) => (
                      <Button
                        key={cta.key}
                        fill={(cta.type as 'solid' | 'outline') ?? 'solid'}
                        intent={
                          (cta.intent as 'primary' | 'secondary' | 'black' | 'red') ?? 'secondary'
                        }
                        surface="dark"
                        size="md"
                        asChild
                      >
                        <a href={cta.href ?? '#'}>
                          {cta.label}
                          <Icon icon={Icons.arrowRight} size="sm" />
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
                {/* G-18: anchorPhrase en admin → solo a llms-full.txt (R-BBF-SEO-HIDDEN-01) */}
              </div>
            </Reveal>
          </HeroSection.Grid>

          {/* Media row — full width below head */}
          <Reveal variant="up" delay={240}>
            <div className="bbf-hero__media flex flex-col gap-0" data-oct-obstacle>
              <HeroMediaFrame className="bbf-hero__media-frame">
                <HeroMediaFrame.Chrome
                  label={hero.media.chromeLabel ?? undefined}
                  recording
                  className="bbf-hero__media-chrome"
                >
                  <HeroRecTimer />
                </HeroMediaFrame.Chrome>
                <HeroMediaFrame.VideoShell className="bbf-hero__video-shell">
                  <HeroVideo
                    controls
                    preload="metadata"
                    poster={posterUrl}
                    ariaLabel={hero.media.demoLabel}
                  >
                    {heroPrimary?.url && (
                      <HeroVideo.Source
                        src={heroPrimary.url}
                        type={primaryMimeToSourceType(heroPrimary.mimeType)}
                      />
                    )}
                    {heroFallback?.url && (
                      <HeroVideo.Source
                        src={heroFallback.url}
                        type={fallbackMimeToSourceType(heroFallback.mimeType)}
                      />
                    )}
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

      <CapabilitiesSection surface="dark">
        <Reveal variant="up">
          <CapabilitiesSection.Header
            eyebrow={cap?.eyebrow || undefined}
            h2Line1={cap?.h2Line1 ?? ''}
            h2Line2Soft={cap?.h2Line2Soft ?? ''}
            h2Line2SoftClassName="bbf-gradient-blue-animated"
            lead={cap?.lead ?? ''}
            surface="dark"
          />
        </Reveal>

        <CapabilitiesSection.Hub
          spokes={cap?.hubSpokes?.map((s) => ({ name: s.name ?? '', meta: s.meta })) ?? undefined}
        />

        <CapabilitiesSection.Grid>
          {(cap?.items ?? []).map((c, i) => (
            <li key={c.id ?? `cap-${i}`} data-oct-obstacle>
              <Reveal variant="fade">
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
            </li>
          ))}
        </CapabilitiesSection.Grid>
      </CapabilitiesSection>

      {/* ─── CASE SECTION §3 ─────────────────────────────────────────── */}
      {cs && (
        <CaseSection surface="dark">
          <Reveal variant="up">
            <SectionHeader
              surface="dark"
              eyebrow={cs.eyebrow || '§3 · CASO'}
              h2Line1={cs.h2Line1 || 'El cerebro'}
              h2Line2Soft={cs.h2Line2Soft || 'en producción.'}
              h2Line2SoftClassName="bbf-gradient-blue-animated"
              lead={cs.lead || undefined}
              decoration={<Lissajous name="case-2d" animation="traveling" />}
            />
          </Reveal>

          <Reveal variant="up" delay={80}>
            <CaseSection.Media>
              <HeroMediaFrame>
                <HeroMediaFrame.Chrome
                  status="live"
                  label={cs.mediaChromeLabel ?? 'SIVAR-BRAINS · WhatsApp Business · live'}
                  timestamp={cs.mediaTimestamp ?? 'captura · 23:04 viernes'}
                />
                <HeroMediaFrame.VideoShell>
                  {casePrimary?.url ? (
                    <HeroVideo
                      controls
                      preload="metadata"
                      poster={casePosterUrl}
                      ariaLabel={cs.mediaChromeLabel ?? cs.h2Line1 ?? undefined}
                    >
                      <HeroVideo.Source
                        src={casePrimary.url}
                        type={primaryMimeToSourceType(casePrimary.mimeType)}
                      />
                      {caseFallback?.url && (
                        <HeroVideo.Source
                          src={caseFallback.url}
                          type={fallbackMimeToSourceType(caseFallback.mimeType)}
                        />
                      )}
                    </HeroVideo>
                  ) : null}
                </HeroMediaFrame.VideoShell>
              </HeroMediaFrame>
            </CaseSection.Media>
          </Reveal>

          <Timeline
            milestones={(cs.milestones ?? []).map((m) => ({
              ...m,
              title: m.title ?? '',
              note: m.note ?? '',
              statusLabel: m.statusLabel ?? '',
            }))}
            attribution={cs.timelineAttribution || undefined}
            ctaHref={cs.ctaHref ?? '/casos/sivar-brains'}
            ctaLabel={cs.ctaLabel ?? 'Leer el caso completo'}
          />
        </CaseSection>
      )}

      {/* ─── POR QUÉ SECTION §4 ──────────────────────────────────────────── */}
      {cmp && (
        <PorqueSection>
          <Reveal variant="up">
            <SectionHeader
              surface="sand"
              eyebrow={cmp.eyebrow ?? '§4 · POR QUÉ'}
              h2Line1={cmp.h2Line1 ?? ''}
              h2Line2Soft={cmp.h2Line2Soft ?? undefined}
              h2Line2SoftClassName="bbf-gradient-blue-animated"
              lead={cmp.lead ?? undefined}
              decoration={<Lissajous name="cross-2d" animation="traveling" />}
            />
          </Reveal>

          <Reveal variant="fade">
            <PorqueSection.Comparison
              columns={cmp.columns}
              rows={cmp.rows}
              crownText={siteId.siteShortName}
            />
          </Reveal>
        </PorqueSection>
      )}
      {/* ─── MÉTODO SECTION §5 ──────────────────────────────────────────── */}
      {mth && (
        <MetodoSection
          data={{
            eyebrow: mth.eyebrow || undefined,
            h2Line1: mth.h2Line1 || undefined,
            h2Line2Soft: mth.h2Line2Soft || undefined,
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
              icon: s.icon ?? null,
              deliverables: s.deliverables,
            })),
            ctaLabel: mth.ctaLabel || undefined,
            ctaHref: mth.ctaHref,
          }}
        />
      )}

      {/* ─── CIERRE SECTION §6 ──────────────────────────────────────────── */}
      {cls && (
        <CierreSection
          data={{
            eyebrow: cls.eyebrow || undefined,
            brandLine: cls.brandLine || undefined,
            brandYear: cls.brandYear,
            statementLine1: cls.statementLine1 || undefined,
            statementLine2Soft: cls.statementLine2Soft || undefined,
            cta: closingCta ?? undefined,
            ctaNote: cls.ctaNote || undefined,
            signatureTagline: cls.signatureTagline || undefined,
          }}
        />
      )}

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {heroVideoObjectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(heroVideoObjectSchema) }}
        />
      )}
      {caseVideoObjectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(caseVideoObjectSchema) }}
        />
      )}
      <PulpoPixelLoader />
    </>
  );
}
