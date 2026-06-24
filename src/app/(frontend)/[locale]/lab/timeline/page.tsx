/**
 * Timeline Lab — validación visual §4·B
 *
 * Página de QA: renderiza el componente Timeline con milestones reales de admin.
 * NO link público — accesible solo via URL directa /lab/timeline.
 * noindex + robots.txt disallow (triple protección).
 *
 * §3 CaseSection INTACTA. Este montaje es solo para validar Parte 2.
 * El reemplazo real de §3 ocurre en Parte 4.
 */

import { getPayload } from 'payload';
import config from '@/payload-config';
import { setRequestLocale } from 'next-intl/server';
import { Timeline } from '@/components/molecules/Timeline';

export const metadata = {
  title: 'Timeline Lab — BBF',
  robots: { index: false, follow: false },
};

export default async function TimelineLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const l = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';

  const payload = await getPayload({ config });
  const site = await payload.findGlobal({ slug: 'site-homepage', locale: l, depth: 0 });

  const cs = site.caseStudy;
  const milestones = cs?.milestones;
  const timelineAttribution = cs?.timelineAttribution;
  const ctaHref = cs?.ctaHref ?? '/casos/sivar-brains';
  const ctaLabel = cs?.ctaLabel ?? 'Leer el caso completo';

  return (
    <div
      className="min-h-screen [background-color:var(--bbf-surface-dark-base)]"
      data-surface="dark"
    >
      {/* Etiqueta de lab */}
      <div className="[background-color:var(--bbf-surface-dark-elevated)] [padding:var(--bbf-space-4)_var(--bbf-space-6)] [border-bottom:1px_solid_var(--bbf-border-on-dark-surface)]">
        <p className="m-0 [font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-mono-xs)] [color:var(--bbf-text-on-dark-surface-muted)]">
          LAB · §4·B Timeline · Parte 2 · validación visual
        </p>
      </div>

      {milestones && milestones.length > 0 ? (
        <div className="[padding:var(--bbf-space-12)_var(--bbf-space-6)]">
          <div className="bbf-section-wrap">
            <Timeline
              milestones={milestones.map((m) => ({
                ...m,
                title: m.title ?? '',
                note: m.note ?? '',
                statusLabel: m.statusLabel ?? '',
              }))}
              attribution={timelineAttribution}
              ctaHref={ctaHref}
              ctaLabel={ctaLabel}
            />
          </div>
        </div>
      ) : (
        <div className="[padding:var(--bbf-space-16)_var(--bbf-space-6)] text-center">
          <p className="[font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-mono-xs)] [color:var(--bbf-text-on-dark-surface-muted)]">
            Sin milestones — cargá datos en admin → SiteHomepage → §3 Caso → Timeline Hitos.
          </p>
        </div>
      )}
    </div>
  );
}
