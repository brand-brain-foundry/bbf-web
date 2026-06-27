/**
 * Seed anchorPhrase + faq[] — Sprint 2 G-18 + G-19
 *
 * Fuente: SEO-AEO-home-SB.md §1.7 (anchorPhrase ES+EN) + §2.6 (faq[] ES+EN)
 * Decisión: D-SEO-SB-07 — EN aprobado por Zavala 2026-06-27.
 *
 * L-BBF-256 workaround aplicado:
 *   updateGlobal(locale='es') crea los items de faq[].
 *   anchorPhrase EN + faq[] EN se insertan via SQL (ON CONFLICT DO UPDATE)
 *   para evitar que updateGlobal(locale='en') recree el array y pierda ES.
 *
 * Usage:
 *   set -a; source .env.local; set +a && pnpm tsx src/scripts/seed-anchor-faq.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

// ── anchorPhrase (§1.7 SEO-AEO-home-SB.md) ──────────────────────────────────
// Texto EXACTO del documento fuente. NO editar sin nueva firma.

const ANCHOR_ES =
  'Sivar Brains construye, opera y mantiene tu cerebro de marca: una sola fuente para tu voz, tu contenido, tus agentes y tus respuestas, consistente en cada canal. La voz se mantiene igual porque la fuente es una sola. Tú diriges. Tu marca ejecuta.';

const ANCHOR_EN =
  'Sivar Brains builds, operates and maintains your brand brain: a single source for your voice, content, agents and answers, consistent across every channel. The voice stays the same because the source is one. You drive. Your brand runs.';

// ── faq[] (§2.6 SEO-AEO-home-SB.md, D-SEO-SB-07 aprobado 2026-06-27) ────────
// ES: canónico original. EN: traducción fiel aprobada Zavala.

const FAQ_ES = [
  {
    question: '¿Qué es un cerebro de marca?',
    answer:
      'Un cerebro de marca es el lugar único donde vive todo lo que una empresa sabe —su voz, su criterio, sus productos, sus procesos— y desde donde la marca responde a clientes, asiste al equipo y genera contenido en cada canal. La voz se mantiene consistente porque la fuente es una sola.',
  },
  {
    question: '¿En qué se diferencia Sivar Brains de una agencia de marketing?',
    answer:
      'Una agencia produce y entrega. Sivar Brains construye un sistema que produce. La diferencia es propiedad: al final, el cerebro de marca es tuyo. No dependés del proveedor para que tu marca hable.',
  },
  {
    question: '¿Qué incluye el servicio de cerebro de marca?',
    answer:
      'Cinco servicios coordinados: Agentes (atención y asistencia en cada canal), Contenido (de un brief a pieza lista), Automatizaciones (procesos repetitivos con criterio), Integraciones (tus herramientas actuales, sin migrar) y Analiza y aprende (datos propios en decisiones).',
  },
  {
    question: '¿Cuánto tiempo tarda en estar listo el cerebro de marca?',
    answer:
      'Tres etapas: diagnóstico (2-3 semanas), construcción (verificable cada semana, según alcance) y operación continua mes a mes sin lock-in. El cliente es dueño de su memoria de marca desde el primer día.',
  },
  {
    question: '¿Qué es Brand Brain Foundry?',
    answer:
      'Brand Brain Foundry es la metodología que desarrolló Christian Zavala para construir cerebros de marca. Sivar Brains es el primer estudio que aplica ese método de forma integral para clientes B2B en LATAM.',
  },
];

const FAQ_EN = [
  {
    question: 'What is a brand brain?',
    answer:
      'A brand brain is the single place where everything a company knows lives — its voice, its criteria, its products, its processes — and from which the brand responds to customers, assists the team, and generates content across every channel. The voice stays consistent because the source is one.',
  },
  {
    question: 'What makes Sivar Brains different from a marketing agency?',
    answer:
      "An agency produces and delivers. Sivar Brains builds a system that produces. The difference is ownership: in the end, the brand brain is yours. You don't depend on the vendor for your brand to speak.",
  },
  {
    question: 'What is included in the brand brain service?',
    answer:
      'Five coordinated services: Agents (customer service and team assistance across every channel), Content (from brief to finished piece), Automations (repetitive processes handled with brand judgment), Integrations (your existing tools, no migration required), and Analyze & learn (proprietary data into decisions).',
  },
  {
    question: 'How long does it take to build a brand brain?',
    answer:
      'Three stages: diagnosis (2–3 weeks), construction (verifiable every week, according to scope), and continuous monthly operation with no lock-in. The client owns their brand memory from day one.',
  },
  {
    question: 'What is Brand Brain Foundry?',
    answer:
      'Brand Brain Foundry is the methodology developed by Christian Zavala to build brand brains. Sivar Brains is the first studio to apply that method in full for B2B clients in LATAM.',
  },
];

async function seedAnchorFaq() {
  const payload = await getPayload({ config });

  console.log('[seed-anchor-faq] Sprint 2 G-18+G-19 — anchorPhrase + faq[] ES+EN');
  console.log('[seed-anchor-faq] Fuente: SEO-AEO-home-SB.md §1.7 + §2.6 (D-SEO-SB-07)');

  // @ts-justify: Payload v3 internal pg pool — workaround documentado L-BBF-256
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  // ── PASO 1: anchorPhrase ES + faq[] ES via Payload API ────────────────────
  await payload.updateGlobal({
    slug: 'site-homepage',
    locale: 'es',
    data: {
      seo: {
        anchorPhrase: ANCHOR_ES,
        faq: FAQ_ES,
      },
    },
  });

  console.log('[1/4] ✅ locale ES poblado (anchorPhrase + 5 faq[] items via Payload API)');

  // ── PASO 2: leer IDs creados ──────────────────────────────────────────────
  const homepageRow = await pool.query('SELECT id FROM site_homepage LIMIT 1');
  const parentId = homepageRow.rows[0]?.id as number;
  if (!parentId) throw new Error('[seed-anchor-faq] site_homepage row not found');

  const faqRows = await pool.query('SELECT id FROM hp_faq WHERE _parent_id = $1 ORDER BY _order', [
    parentId,
  ]);

  console.log(
    `[2/4] ✅ IDs leídos — site_homepage.id=${parentId}, hp_faq rows=${faqRows.rows.length}`,
  );

  if (faqRows.rows.length !== 5) {
    throw new Error(
      `[seed-anchor-faq] ERROR: esperaba 5 items en hp_faq, encontré ${faqRows.rows.length}`,
    );
  }

  // ── PASO 3: anchorPhrase EN via SQL UPSERT ────────────────────────────────
  await pool.query(
    `INSERT INTO site_homepage_locales (seo_anchor_phrase, _locale, _parent_id)
     VALUES ($1, 'en', $2)
     ON CONFLICT (_locale, _parent_id) DO UPDATE SET seo_anchor_phrase = EXCLUDED.seo_anchor_phrase`,
    [ANCHOR_EN, parentId],
  );

  console.log('[3/4] ✅ anchorPhrase EN insertado via SQL UPSERT');

  // ── PASO 4: faq[] EN via SQL UPSERT ──────────────────────────────────────
  for (let i = 0; i < faqRows.rows.length; i++) {
    const itemId = faqRows.rows[i].id as string;
    const en = FAQ_EN[i];

    await pool.query(
      `INSERT INTO hp_faq_locales (question, answer, _locale, _parent_id)
       VALUES ($1, $2, 'en', $3)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET question = EXCLUDED.question, answer = EXCLUDED.answer`,
      [en.question, en.answer, itemId],
    );

    console.log(`    → faq[${i}] EN: "${en.question.substring(0, 50)}…"`);
  }

  console.log('[4/4] ✅ faq[] EN insertado via SQL UPSERT (5 items)');

  // ── VERIFICACIÓN FINAL ────────────────────────────────────────────────────
  console.log('');
  console.log('[seed-anchor-faq] Verificación SQL:');

  const anchorCheck = await pool.query(
    `SELECT _locale, seo_anchor_phrase FROM site_homepage_locales
     WHERE _parent_id = $1 AND _locale IN ('es','en') ORDER BY _locale`,
    [parentId],
  );

  for (const row of anchorCheck.rows) {
    const ok = !!row.seo_anchor_phrase;
    console.log(
      `   ${ok ? '✅' : '❌'} anchorPhrase [${row._locale}]: ${ok ? String(row.seo_anchor_phrase).substring(0, 60) + '…' : 'MISSING'}`,
    );
  }

  const faqCheck = await pool.query(
    `SELECT f._order, l._locale, l.question, l.answer
     FROM hp_faq f
     JOIN hp_faq_locales l ON l._parent_id = f.id
     WHERE f._parent_id = $1
     ORDER BY f._order, l._locale`,
    [parentId],
  );

  const faqCounts = { es: 0, en: 0 };
  for (const row of faqCheck.rows) {
    const locale = row._locale as 'es' | 'en';
    faqCounts[locale]++;
    const ok = !!row.question && !!row.answer;
    console.log(
      `   ${ok ? '✅' : '❌'} faq[${row._order}] [${locale}]: "${String(row.question).substring(0, 45)}…"`,
    );
  }

  console.log('');
  console.log(`   hp_faq rows: ES=${faqCounts.es} EN=${faqCounts.en} (esperado 5×2)`);

  if (anchorCheck.rows.length === 2 && faqCounts.es === 5 && faqCounts.en === 5) {
    console.log('');
    console.log('✅ Sprint 2 G-18+G-19 POBLADO — anchorPhrase ES+EN + faq[] 5×2 locales en admin');
  } else {
    throw new Error('[seed-anchor-faq] ERROR: counts incorrectos — revisar logs arriba');
  }

  process.exit(0);
}

seedAnchorFaq().catch((err) => {
  console.error('[seed-anchor-faq] ERROR:', err);
  process.exit(1);
});
