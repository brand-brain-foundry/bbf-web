/**
 * Seed §4 Comparison — D-COMPARISON-01 (B-BBF-WEB-SEED-04-COMPARISON)
 *
 * Fuente: SB_ContentMaster_Homepage §2.4 (Content/Final) — post D-COMPARISON-01.
 * Corrige: columna A "SaaS / Chatbot" → "Lo que ya usás", fila Disponibilidad
 * reencuadrada, Coordinación en pos 4, lead corregido, 9 filas completas.
 *
 * Estrategia:
 *   Step 1: ES via payload.updateGlobal(locale='es') — reemplaza arrays existentes.
 *   Step 2: EN scalars via SQL INSERT ON CONFLICT (site_homepage_locales).
 *   Step 3: EN column labels via SQL (cmp_columns_locales).
 *   Step 4: EN row attributes + cell values via SQL (cmp_rows_locales + cmp_cells_locales).
 *
 * PROHIBIDO: migrate, push, tocar otras secciones.
 *
 * Usage:
 *   set -a; source .env.local; set +a
 *   pnpm tsx src/scripts/seed-comparison.ts
 */

import { getPayload } from 'payload';
import config from '@/payload.config';

// ── EN data ──────────────────────────────────────────────────────────────────
const EN_SCALARS = {
  eyebrow: 'Why',
  h2Line1: 'The difference between renting and owning.',
  h2Line2Soft: 'And between doing it by hand or coordinating with judgment.',
  lead: "Today your company faces two invisible costs: the software you rent without owning, and the work your team still does by hand, one task at a time. A brand brain closes both. It doesn't add another tool: it coordinates, from a single memory, everything your brand says and does across every channel —so your team stops executing and goes back to leading.",
  epilogueTitle: 'The operational difference',
  epilogueBody:
    "Software gives you temporary access to a tool your competitors also use. Manual work doesn't scale: every new channel is more hours, more people, more cost. And neither software nor hands coordinate with each other —each piece lives apart.\n\nA brand brain is yours and it coordinates: a single memory behind every agent, every piece of content, every process. The voice is the same everywhere because the source is one. Your team returns to what only a person can do: lead.",
};

// Order: column A (Lo que ya usás), column B (Trabajo manual), column C (Cerebro de marca)
const EN_COLUMN_LABELS = ['What you already use', 'Manual work', 'Brand brain'];

// 9 rows, each with 3 cells [colA, colB, colC]
const EN_ROWS: Array<{ attribute: string; cells: [string, string, string] }> = [
  {
    attribute: 'Ownership',
    cells: ['Theirs', 'Yours, but diluted', 'Yours: memory and data'],
  },
  {
    attribute: 'Learns your company',
    cells: ['Market average', 'Per person', 'Your specific memory'],
  },
  {
    attribute: 'Consistent voice',
    cells: ['Approximate', 'Depends who', 'Exact, always'],
  },
  {
    attribute: 'Coordination',
    cells: ['Each tool on its own', 'A person does it', 'One source coordinates all'],
  },
  {
    attribute: 'Availability',
    cells: ['Works, not your voice', 'Business hours', 'Your exact voice, always'],
  },
  {
    attribute: 'Scale',
    cells: ['Pay per use', 'Hire more', 'No linear cost'],
  },
  {
    attribute: 'Governance',
    cells: ["The vendor's", 'No traceability', 'Yours, auditable'],
  },
  {
    attribute: 'Portability',
    cells: ['No, lock-in', 'Yes, but in people', "Yes, it's yours"],
  },
  {
    attribute: '3-year cost',
    cells: ['Rises every year', 'Rises with scale', 'An investment that appreciates'],
  },
];

async function seed() {
  const payload = await getPayload({ config });

  // @ts-justify: accessing Payload v3 internal pg pool (L-BBF-256 pattern)
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  // ── STEP 1: ES via Payload API ────────────────────────────────────────────
  // Payload v3 replaces arrays (deletes old rows, inserts new) on updateGlobal(locale='es').
  try {
    await payload.updateGlobal({
      slug: 'site-homepage',
      locale: 'es',
      data: {
        comparison: {
          eyebrow: 'Por qué',
          h2Line1: 'La diferencia entre alquilar y ser dueño.',
          h2Line2Soft: 'Y entre ejecutar a mano o coordinar con criterio.',
          lead: 'Hoy tu empresa enfrenta dos costos invisibles: el software que alquilás sin que sea tuyo, y el trabajo que tu equipo todavía hace a mano, una tarea a la vez. Un cerebro de marca cierra los dos. No suma otra herramienta: coordina, desde una sola memoria, todo lo que tu marca dice y hace en cada canal —para que tu equipo deje de ejecutar y vuelva a dirigir.',
          columns: [
            { label: 'Lo que ya usás', isHighlighted: false },
            { label: 'Trabajo manual', isHighlighted: false },
            { label: 'Cerebro de marca', isHighlighted: true },
          ],
          rows: [
            {
              attribute: 'Propiedad',
              cells: [
                { state: 'text', value: 'Suya' },
                { state: 'text', value: 'Tuya, pero diluida' },
                { state: 'text', value: 'Tuya: memoria y datos' },
              ],
            },
            {
              attribute: 'Aprende tu empresa',
              cells: [
                { state: 'text', value: 'Promedio de mercado' },
                { state: 'text', value: 'Por persona' },
                { state: 'text', value: 'Tu memoria específica' },
              ],
            },
            {
              attribute: 'Voz consistente',
              cells: [
                { state: 'text', value: 'Aproximada' },
                { state: 'text', value: 'Depende de quién' },
                { state: 'text', value: 'Exacta, siempre' },
              ],
            },
            {
              attribute: 'Coordinación',
              cells: [
                { state: 'text', value: 'Cada herramienta por su lado' },
                { state: 'text', value: 'La hace una persona' },
                { state: 'text', value: 'Una sola fuente coordina todo' },
              ],
            },
            {
              attribute: 'Disponibilidad',
              cells: [
                { state: 'text', value: 'Funciona, sin tu voz' },
                { state: 'text', value: 'Horario laboral' },
                { state: 'text', value: 'Tu voz exacta, siempre' },
              ],
            },
            {
              attribute: 'Escala',
              cells: [
                { state: 'text', value: 'Pagás por uso' },
                { state: 'text', value: 'Contratar más' },
                { state: 'text', value: 'Sin costo lineal' },
              ],
            },
            {
              attribute: 'Gobernanza',
              cells: [
                { state: 'text', value: 'Del proveedor' },
                { state: 'text', value: 'Sin trazabilidad' },
                { state: 'text', value: 'Tuya, auditable' },
              ],
            },
            {
              attribute: 'Portabilidad',
              cells: [
                { state: 'text', value: 'No, lock-in' },
                { state: 'text', value: 'Sí, pero en personas' },
                { state: 'text', value: 'Sí, es tuyo' },
              ],
            },
            {
              attribute: 'Costo a 3 años',
              cells: [
                { state: 'text', value: 'Sube cada año' },
                { state: 'text', value: 'Sube con escala' },
                { state: 'text', value: 'Inversión que se aprecia' },
              ],
            },
          ],
          epilogue: {
            title: 'La diferencia operativa',
            body: 'Un software te da acceso temporal a una herramienta que también usan tus competidores. El trabajo manual no escala: cada canal nuevo es más horas, más personas, más costo. Y ni el software ni las manos coordinan entre sí —cada pieza vive aparte.\n\nUn cerebro de marca es tuyo y coordina: una sola memoria detrás de cada agente, cada pieza de contenido, cada proceso. La voz es la misma en todos lados porque la fuente es una sola. Tu equipo vuelve a lo que solo una persona puede hacer: dirigir.',
          },
        },
      } as any,
    });
    console.log('[seed-comparison] ✅ STEP 1: comparison ES seeded (9 rows, D-COMPARISON-01)');
  } catch (err) {
    console.error('[seed-comparison] ✗ STEP 1 ES seed failed:', err);
    process.exit(1);
  }

  // ── STEP 2: EN scalars via SQL ────────────────────────────────────────────
  try {
    await pool.query(
      `INSERT INTO site_homepage_locales
         (comparison_eyebrow, comparison_h2_line1, comparison_h2_line2_soft,
          comparison_lead, comparison_epilogue_title, comparison_epilogue_body,
          _locale, _parent_id)
       VALUES ($1,$2,$3,$4,$5,$6,'en',1)
       ON CONFLICT (_locale, _parent_id)
       DO UPDATE SET
         comparison_eyebrow          = EXCLUDED.comparison_eyebrow,
         comparison_h2_line1         = EXCLUDED.comparison_h2_line1,
         comparison_h2_line2_soft    = EXCLUDED.comparison_h2_line2_soft,
         comparison_lead             = EXCLUDED.comparison_lead,
         comparison_epilogue_title   = EXCLUDED.comparison_epilogue_title,
         comparison_epilogue_body    = EXCLUDED.comparison_epilogue_body`,
      [
        EN_SCALARS.eyebrow,
        EN_SCALARS.h2Line1,
        EN_SCALARS.h2Line2Soft,
        EN_SCALARS.lead,
        EN_SCALARS.epilogueTitle,
        EN_SCALARS.epilogueBody,
      ],
    );
    console.log('[seed-comparison] ✅ STEP 2: EN scalars upserted via SQL');
  } catch (err) {
    console.error('[seed-comparison] ✗ STEP 2 EN scalars failed:', err);
    process.exit(1);
  }

  // ── STEP 3: EN column labels via SQL ─────────────────────────────────────
  const columnRows = await pool.query(
    'SELECT id FROM cmp_columns WHERE _parent_id=1 ORDER BY _order',
  );
  console.log(`[seed-comparison] Found ${columnRows.rows.length} column rows`);
  if (columnRows.rows.length !== 3) {
    console.error('[seed-comparison] ✗ Expected 3 columns, got', columnRows.rows.length);
    process.exit(1);
  }

  for (let i = 0; i < columnRows.rows.length; i++) {
    const colId = columnRows.rows[i]!.id;
    const enLabel = EN_COLUMN_LABELS[i]!;
    await pool.query(
      `INSERT INTO cmp_columns_locales (label, sub, _locale, _parent_id)
       VALUES ($1, '', 'en', $2)
       ON CONFLICT (_locale, _parent_id)
       DO UPDATE SET label = EXCLUDED.label, sub = EXCLUDED.sub`,
      [enLabel, colId],
    );
  }
  console.log('[seed-comparison] ✅ STEP 3: EN column labels upserted via SQL');

  // ── STEP 4: EN row attributes + cell values via SQL ───────────────────────
  const rowRows = await pool.query('SELECT id FROM cmp_rows WHERE _parent_id=1 ORDER BY _order');
  console.log(`[seed-comparison] Found ${rowRows.rows.length} row rows`);
  if (rowRows.rows.length !== 9) {
    console.error('[seed-comparison] ✗ Expected 9 rows, got', rowRows.rows.length);
    process.exit(1);
  }

  for (let i = 0; i < rowRows.rows.length; i++) {
    const rowId = rowRows.rows[i]!.id;
    const enRow = EN_ROWS[i]!;

    // Insert EN attribute for this row
    await pool.query(
      `INSERT INTO cmp_rows_locales (attribute, _locale, _parent_id)
       VALUES ($1, 'en', $2)
       ON CONFLICT (_locale, _parent_id)
       DO UPDATE SET attribute = EXCLUDED.attribute`,
      [enRow.attribute, rowId],
    );

    // Get cells for this row (ordered by _order = col A, B, C)
    const cellRows = await pool.query(
      'SELECT id FROM cmp_cells WHERE _parent_id=$1 ORDER BY _order',
      [rowId],
    );
    if (cellRows.rows.length !== 3) {
      console.error(`[seed-comparison] ✗ Row ${i} has ${cellRows.rows.length} cells, expected 3`);
      process.exit(1);
    }

    for (let j = 0; j < cellRows.rows.length; j++) {
      const cellId = cellRows.rows[j]!.id;
      const enValue = enRow.cells[j]!;
      await pool.query(
        `INSERT INTO cmp_cells_locales (value, _locale, _parent_id)
         VALUES ($1, 'en', $2)
         ON CONFLICT (_locale, _parent_id)
         DO UPDATE SET value = EXCLUDED.value`,
        [enValue, cellId],
      );
    }
  }
  console.log('[seed-comparison] ✅ STEP 4: EN row attributes + cell values upserted via SQL');
  console.log('[seed-comparison] 🎯 §4 Comparison ES+EN complete — D-COMPARISON-01.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
