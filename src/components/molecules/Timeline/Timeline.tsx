/**
 * Timeline — D-TIMELINE-01 molecule, Server Component (thin data layer)
 * §4·B Trayectoria — scroller horizontal de hitos operacionales.
 *
 * Patrón D-99: Server Component pasa datos a TimelineScroller (Client Component).
 * Timeline.tsx = data + shell (bbf-timeline wrapper).
 * TimelineScroller.tsx = interactividad completa.
 *
 * Props:
 *   milestones[]   — hitos desde admin (SiteHomepage.caseStudy.milestones)
 *   attribution?   — pill mono-xs con dot azul (ej: "En operación · Sivar Brains")
 *   ctaHref        — URL del CTA link-arrow
 *   ctaLabel       — label del CTA link-arrow
 *
 * Refs: D-99, D-TIMELINE-01, B-BBF-WEB-TIMELINE
 */

import { TimelineScroller } from './TimelineScroller';

/* ── Types ────────────────────────────────────────────────────── */

export interface TimelineMilestone {
  id?: string | null;
  title: string;
  note: string;
  icon?: string | null;
  status: 'active' | 'demo' | 'next';
  statusLabel: string;
}

interface TimelineProps {
  milestones: TimelineMilestone[];
  attribution?: string | null;
  ctaHref: string;
  ctaLabel: string;
}

/* ── Component ────────────────────────────────────────────────── */

export function Timeline({ milestones, attribution, ctaHref, ctaLabel }: TimelineProps) {
  if (!milestones.length) return null;

  return (
    <div data-component="bbf-timeline" className="bbf-timeline">
      <TimelineScroller
        milestones={milestones}
        attribution={attribution}
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
      />
    </div>
  );
}
