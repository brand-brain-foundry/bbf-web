/**
 * Seed answerCapsules — TP-SEO-01 (cierre)
 * Despacho: B-BBF-WEB-HOME-CAPSULES-POBLAR
 *
 * Pobla SiteHomepage.seo.answerCapsules con las 5 Answer Capsules ES+EN
 * firmadas por Zavala (Plan Mode B-BBF-WEB-HOME-CAPSULES-CONTENT).
 *
 * Fuentes:
 *   ES — ContentMaster §1.9, §2.2–§2.5 + SEO-AEO §4.2
 *   EN — ContentMaster EN equivalents (adaptación, no traducción literal)
 *
 * L-BBF-256 workaround:
 *   updateGlobal(locale='es') crea los items del array.
 *   El locale EN se inserta via SQL directo (ON CONFLICT DO UPDATE)
 *   para evitar que una segunda updateGlobal(locale='en') recree el array
 *   y pierda el locale ES.
 *
 * Usage:
 *   set -a; source .env.local; set +a && pnpm tsx src/scripts/seed-answer-capsules.ts
 */

import { getPayload } from 'payload';

import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

// ── Capsules firmadas (Zavala 2026-06-18) ─────────────────────────────────────
// Textos EXACTOS del Plan Mode. NO editar sin nueva firma.

const CAPSULES_ES: Record<string, string> = {
  hero: 'Sivar Brains construye, opera y mantiene tu cerebro de marca: una sola fuente para tu voz, tu contenido, tus agentes y tus respuestas, consistente en cada canal. La voz se mantiene igual porque la fuente es una sola. Tú diriges. Tu marca ejecuta.',
  capabilities:
    'El cerebro de marca de Sivar Brains agrupa cinco servicios coordinados: agentes que atienden y asisten, contenido desde un brief a pieza lista, automatizaciones que resuelven procesos, integraciones con tus herramientas y análisis que convierte datos en decisiones. Un sistema. Una sola fuente.',
  caseStudy:
    'Hacienda Real ya opera su cerebro de marca: genera el contenido de sus redes desde un brief —del concepto a la pieza lista para publicar— y atiende a sus clientes en WhatsApp con menú, maridajes y reservas, con la voz exacta de la marca. Esto es lo que opera hoy.',
  comparison:
    'La diferencia no es el resultado: es quién es dueño del sistema. Con Sivar Brains, el cerebro de marca es tuyo — no alquilás capacidad, construís tu propio activo. No suma otra herramienta: coordina, desde una sola memoria, todo lo que tu marca dice y hace en cada canal.',
  method:
    'Tres etapas sin permanencia: diagnóstico cerrado (2-3 semanas), construcción verificable semana a semana, y operación continua mes a mes sin lock-in. Ves el mapa completo desde el primer día. Lo que se construye es tuyo desde el primer entregable. Tu marca es dueña de su memoria.',
};

const CAPSULES_EN: Record<string, string> = {
  hero: 'Sivar Brains builds, operates and maintains your brand brain: a single source for your voice, content, agents and answers, consistent across every channel. It serves your customers, assists your team and generates your content — always in your voice, always from the same source. You drive. Your brand runs.',
  capabilities:
    "Sivar Brains' brand brain brings five coordinated services: agents that serve customers and assist teams, content from brief to published piece, automations that resolve processes with judgment, integrations with your existing tools, and analytics that turns every interaction into a system improvement. One brain. One source.",
  caseStudy:
    "Hacienda Real already runs its brand brain: it generates its social content from a brief —from concept to a piece ready to publish— and serves its customers on WhatsApp with the menu, pairing recommendations and reservations, in the restaurant's exact voice. This is what runs today.",
  comparison:
    "The difference isn't the outcome: it's who owns the system. With Sivar Brains, the brand brain is yours — you're not renting capacity, you're building your own asset. It doesn't add another tool: it coordinates, from a single memory, everything your brand says and does across every channel.",
  method:
    'Three stages with no lock-in: a closed diagnosis (2-3 weeks), verifiable construction reviewed week by week, and ongoing month-to-month operation. You see the full map from day one. What gets built is yours from the first deliverable. Your brand owns its memory.',
};

const SECTION_ORDER = ['hero', 'capabilities', 'caseStudy', 'comparison', 'method'] as const;

async function seedAnswerCapsules() {
  const payload = await getPayload({ config });

  console.log('[seed-answer-capsules] TP-SEO-01 — poblando 5 Answer Capsules ES+EN');
  console.log('[seed-answer-capsules] Fuente: Plan Mode firmado por Zavala 2026-06-18');

  // ── PASO 1: Poblar locale ES via Payload API ───────────────────────────────
  // updateGlobal crea los 5 items del array con sectionId + ES capsule.
  // El campo seo.answerCapsules es un grupo anidado en SiteHomepage.
  await payload.updateGlobal({
    slug: 'site-homepage',
    locale: 'es',
    data: {
      seo: {
        answerCapsules: SECTION_ORDER.map((sectionId) => ({
          sectionId,
          capsule: CAPSULES_ES[sectionId],
        })),
      },
    },
  });

  console.log('[1/3] ✅ Locale ES poblado (5 items creados via Payload API)');

  // ── PASO 2: Leer IDs creados ───────────────────────────────────────────────
  // L-BBF-256: una segunda updateGlobal(locale='en') recrea el array y pierde ES.
  // En su lugar: leer los IDs recién creados y usar SQL para insertar EN.
  // @ts-justify: Payload v3 internal pg pool — workaround documentado L-BBF-256
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  const siteHomepageRow = await pool.query('SELECT id FROM site_homepage LIMIT 1');
  const parentId = siteHomepageRow.rows[0]?.id as number;
  if (!parentId) throw new Error('[seed-answer-capsules] site_homepage row not found');

  const capsuleRows = await pool.query(
    'SELECT id, section_id FROM site_homepage_seo_answer_capsules WHERE _parent_id = $1 ORDER BY _order',
    [parentId],
  );

  console.log(`[2/3] ✅ IDs leídos: ${capsuleRows.rows.length} items en DB`);

  if (capsuleRows.rows.length !== 5) {
    throw new Error(
      `[seed-answer-capsules] ERROR: esperaba 5 items, encontré ${capsuleRows.rows.length}`,
    );
  }

  // ── PASO 3: Insertar locale EN via SQL (ON CONFLICT DO UPDATE) ────────────
  for (const row of capsuleRows.rows) {
    const sectionId = row.section_id as string;
    const itemId = row.id as string;
    const enText = CAPSULES_EN[sectionId];

    if (!enText) {
      throw new Error(`[seed-answer-capsules] ERROR: no EN text for sectionId="${sectionId}"`);
    }

    await pool.query(
      `INSERT INTO site_homepage_seo_answer_capsules_locales (capsule, _locale, _parent_id)
       VALUES ($1, 'en', $2)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET capsule = EXCLUDED.capsule`,
      [enText, itemId],
    );

    console.log(`    → ${sectionId}: EN insertado`);
  }

  console.log('[3/3] ✅ Locale EN insertado via SQL (workaround L-BBF-256)');

  // ── VERIFICACIÓN FINAL ─────────────────────────────────────────────────────
  console.log('');
  console.log('[seed-answer-capsules] Verificación final:');

  const verification = await pool.query(
    `SELECT
       c.section_id,
       c._order,
       l_es.capsule AS capsule_es,
       l_en.capsule AS capsule_en
     FROM site_homepage_seo_answer_capsules c
     LEFT JOIN site_homepage_seo_answer_capsules_locales l_es
       ON l_es._parent_id = c.id AND l_es._locale = 'es'
     LEFT JOIN site_homepage_seo_answer_capsules_locales l_en
       ON l_en._parent_id = c.id AND l_en._locale = 'en'
     WHERE c._parent_id = $1
     ORDER BY c._order`,
    [parentId],
  );

  let allOk = true;
  for (const row of verification.rows) {
    const esOk = !!row.capsule_es;
    const enOk = !!row.capsule_en;
    const status = esOk && enOk ? '✅' : '❌';
    if (!esOk || !enOk) allOk = false;
    console.log(
      `   ${status} ${row.section_id}: ES=${esOk ? String(row.capsule_es).substring(0, 40) + '…' : 'MISSING'} | EN=${enOk ? String(row.capsule_en).substring(0, 40) + '…' : 'MISSING'}`,
    );
  }

  console.log('');
  if (allOk) {
    console.log(
      '✅ TP-SEO-01 POBLADO — 5 Answer Capsules ES+EN en SiteHomepage.seo.answerCapsules',
    );
    console.log('   Validar en admin: SiteHomepage → Optimización SEO + GEO → answerCapsules');
  } else {
    throw new Error('[seed-answer-capsules] ERROR: algún item tiene locale faltante');
  }

  process.exit(0);
}

seedAnswerCapsules().catch((err) => {
  console.error('[seed-answer-capsules] ERROR:', err);
  process.exit(1);
});
