/**
 * Seed §3 CaseStudy — Hacienda Real (B-BBF-WEB-SEED-03-CASESTUDY)
 *
 * Fuente: SB_ContentMaster_Homepage §2.3 (Content/Final) — EXACTO.
 * Reemplaza contenido incorrecto (Sivar Films/BBF) por el caso canónico.
 *
 * Estrategia (L-BBF-256 total bypass):
 *   Step 1: ES via payload.updateGlobal — crea milestone/phases rows en DB.
 *   Step 2: EN scalars via SQL INSERT ON CONFLICT — bypasses Payload v3
 *           ValidationError que ocurre en updateGlobal(locale='en') sobre
 *           globals con arrays existentes.
 *   Step 3: EN milestones via SQL INSERT ON CONFLICT.
 *
 * PROHIBIDO: migrate, push, tocar otras secciones, contenido admin.
 *
 * Usage:
 *   set -a; source .env.local; set +a
 *   pnpm tsx src/scripts/seed-casestudy-hacienda.ts
 */

import { getPayload } from 'payload';
import config from '@/payload.config';

async function seed() {
  const payload = await getPayload({ config });

  // @ts-justify: accessing Payload v3 internal pg pool (L-BBF-256 pattern)
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  // ── STEP 1: ES via Payload API ────────────────────────────────────────────
  try {
    await payload.updateGlobal({
      slug: 'site-homepage',
      locale: 'es',
      data: {
        caseStudy: {
          eyebrow: 'En marcha · Primer cliente',
          h2Line1: 'El primer cerebro,',
          h2Line2Soft: 'en marcha.',
          lead: 'Hacienda Real es el primer cliente de Sivar Brains. Hoy su cerebro genera el contenido de sus redes a partir de un brief —del concepto a la pieza lista para publicar— y atiende a sus clientes en WhatsApp con el menú, las recomendaciones de maridaje y las reservas, con la voz exacta del restaurante.\n\nEsto es lo que opera hoy. El caso sigue creciendo.',
          mediaChromeLabel: 'HACIENDA-REAL · WhatsApp Business · live',
          timelineAttribution: 'En operación · Sivar Brains',
          phases: [
            {
              tag: 'Antes',
              title: 'Situación',
              body: 'Respuestas manuales en WhatsApp. El contenido de redes salía sin sistema de voz unificada. La memoria del restaurante vivía dispersa entre personas.',
            },
            {
              tag: 'Construcción',
              title: 'Cerebro activo',
              body: 'Ingresamos el menú, los maridajes, la historia y la voz de Hacienda Real. Conectamos WhatsApp Business y activamos el motor de contenido desde brief.',
            },
            {
              tag: 'Hoy',
              title: 'Operación',
              body: 'El cerebro genera el contenido de redes desde un brief y atiende a los clientes en WhatsApp con la voz exacta del restaurante.',
            },
          ],
          milestones: [
            {
              title: 'Primer cliente del cerebro de marca',
              note: '',
              status: 'active',
              statusLabel: 'Activo',
            },
            {
              title: 'Genera el contenido de redes desde un brief',
              note: '',
              status: 'active',
              statusLabel: 'Activo',
            },
            {
              title: 'Agente en WhatsApp: menú, maridajes, reservas',
              note: '',
              status: 'demo',
              statusLabel: 'En demo, conectándose',
            },
            {
              title: 'Resultados y nuevos canales',
              note: '',
              status: 'next',
              statusLabel: 'Próximo',
            },
          ],
          quoteText:
            'Es como tener a alguien del equipo respondiendo cada mensaje. Solo que nadie del equipo está respondiendo.',
          quoteCaption: '— En operación · Sivar Brains',
          ctaLabel: 'Ver el historial completo',
          ctaHref: '/casos/hacienda-real',
        },
      } as any,
    });
    console.log('[seed-casestudy] ✅ STEP 1: caseStudy ES seeded (Hacienda Real)');
  } catch (err) {
    console.error('[seed-casestudy] ✗ STEP 1 ES seed failed:', err);
    process.exit(1);
  }

  // ── STEP 2: EN scalar locales via SQL ─────────────────────────────────────
  // Payload v3 throws ValidationError on updateGlobal(locale='en') for globals
  // that already have array children (phases). Bypass entirely via pool.query.
  // site_homepage has id=1 (single global record). Unique index: (_locale, _parent_id).
  try {
    await pool.query(
      `INSERT INTO site_homepage_locales
         (case_study_eyebrow, case_study_h2_line1, case_study_h2_line2_soft,
          case_study_lead, case_study_media_chrome_label, case_study_timeline_attribution,
          case_study_quote_text, case_study_quote_caption, case_study_cta_label,
          _locale, _parent_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'en',1)
       ON CONFLICT (_locale, _parent_id)
       DO UPDATE SET
         case_study_eyebrow              = EXCLUDED.case_study_eyebrow,
         case_study_h2_line1             = EXCLUDED.case_study_h2_line1,
         case_study_h2_line2_soft        = EXCLUDED.case_study_h2_line2_soft,
         case_study_lead                 = EXCLUDED.case_study_lead,
         case_study_media_chrome_label   = EXCLUDED.case_study_media_chrome_label,
         case_study_timeline_attribution = EXCLUDED.case_study_timeline_attribution,
         case_study_quote_text           = EXCLUDED.case_study_quote_text,
         case_study_quote_caption        = EXCLUDED.case_study_quote_caption,
         case_study_cta_label            = EXCLUDED.case_study_cta_label`,
      [
        'In motion · First client',
        'The first brain,',
        'in motion.',
        "Hacienda Real is the first client of Sivar Brains. Today its brain generates its social content from a brief —from concept to a piece ready to publish— and serves its customers on WhatsApp with the menu, pairing recommendations and reservations, in the restaurant's exact voice.\n\nThis is what runs today. The case keeps growing.",
        'HACIENDA-REAL · WhatsApp Business · live',
        'In operation · Sivar Brains',
        "It's like having someone from the team answering every message. Except no one from the team is answering.",
        '— In operation · Sivar Brains',
        'View the full history',
      ],
    );
    console.log('[seed-casestudy] ✅ STEP 2: caseStudy EN scalars upserted via SQL');
  } catch (err) {
    console.error('[seed-casestudy] ✗ STEP 2 EN scalars failed:', err);
    process.exit(1);
  }

  // ── STEP 3: EN milestones locale via SQL ──────────────────────────────────
  const enMilestones = [
    { title: 'First client of the brand brain', note: '', statusLabel: 'Active' },
    { title: 'Generates social content from a brief', note: '', statusLabel: 'Active' },
    {
      title: 'WhatsApp agent: menu, pairings, reservations',
      note: '',
      statusLabel: 'In demo, connecting',
    },
    { title: 'Results and new channels', note: '', statusLabel: 'Upcoming' },
  ];

  const milestoneRows = await pool.query(
    'SELECT id FROM site_homepage_case_study_milestones ORDER BY _order',
  );
  console.log(`[seed-casestudy] Found ${milestoneRows.rows.length} milestone rows`);

  for (let i = 0; i < milestoneRows.rows.length; i++) {
    const row = milestoneRows.rows[i];
    const en = enMilestones[i];
    if (!row || !en) continue;
    await pool.query(
      `INSERT INTO site_homepage_case_study_milestones_locales
         (title, note, status_label, _locale, _parent_id)
       VALUES ($1, $2, $3, 'en', $4)
       ON CONFLICT (_locale, _parent_id)
       DO UPDATE SET title        = EXCLUDED.title,
                     note         = EXCLUDED.note,
                     status_label = EXCLUDED.status_label`,
      [en.title, en.note, en.statusLabel, row.id],
    );
  }
  console.log('[seed-casestudy] ✅ STEP 3: EN milestones locale upserted via SQL');

  console.log('[seed-casestudy] 🎯 §3 Hacienda Real ES+EN complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
