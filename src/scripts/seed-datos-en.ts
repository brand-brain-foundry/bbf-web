/**
 * Seed datos EN faltantes — B-BBF-WEB-DEUDA-01-DATOS-EN
 *
 * Pobla los campos EN vacíos o con valor ES. El código ya tiene los valores
 * correctos en DB para la mayoría (caseStudy, comparison, method). El único
 * campo pendiente es newsletter.emailPlaceholder EN.
 *
 * Idempotente — safe to re-run.
 *
 * Usage:
 *   set -a && source .env.local && set +a && pnpm tsx src/scripts/seed-datos-en.ts
 */
import { getPayload } from 'payload';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {}

const payload = await getPayload({ config });
const db = (payload as any).db.pool as {
  query: (sql: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
};

// ── newsletter.emailPlaceholder EN ────────────────────────────────────────────
// DB tiene 'tu@email.com' para EN (valor ES filtrado). Correcto EN: 'your@email.com'.
// Canon: patrón site-newsletter (site-identity seed emailPlaceholder: 'tu@email.com' ES).
await payload.updateGlobal({
  slug: 'site-newsletter',
  locale: 'en',
  data: { emailPlaceholder: 'your@email.com' },
});
console.log('✅ newsletter EN emailPlaceholder: your@email.com');

// ── Verificar mediaTimestamp (no localizado — vale para ambos locales) ────────
const r = await db.query(`SELECT case_study_media_timestamp FROM site_homepage LIMIT 1`);
const ts = r.rows[0]?.['case_study_media_timestamp'];
console.log(
  `ℹ  mediaTimestamp (no localizado): ${ts ?? 'NULL — fallback "captura · 23:04 viernes" activo'}`,
);

// ── Confirmar EN fields ya poblados ──────────────────────────────────────────
const check = await db.query(`
  SELECT _locale,
    case_study_media_chrome_label,
    case_study_cta_label,
    comparison_eyebrow,
    method_eyebrow
  FROM site_homepage_locales
  ORDER BY _locale
`);
for (const row of check.rows) {
  console.log(
    `[${row['_locale']}] cta_label="${row['case_study_cta_label']}" eyebrow_cmp="${row['comparison_eyebrow']}" eyebrow_mth="${row['method_eyebrow']}"`,
  );
}

// ── newsletter EN post-seed ───────────────────────────────────────────────────
const nl = await payload.findGlobal({ slug: 'site-newsletter', locale: 'en' });
console.log(`✅ newsletter EN emailPlaceholder final: ${nl.emailPlaceholder}`);

process.exit(0);
