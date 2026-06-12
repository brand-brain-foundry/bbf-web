/**
 * Seed sivar-brains — FASE 4.B.3 / GAP-ENT-02
 *
 * Limpia organization.areaServed: texto sucio → valores canónicos.
 * Sin schema change: field sigue siendo array of { region: text }.
 * Refactor a typed relationship (4B-ON-03) → FASE 4.C.
 *
 * Antes: [{ region: 'El Salvador SV' }, { region: 'Latinoamérica / Latin America' }]
 * Después: [{ region: 'El Salvador' }, { region: 'América Latina' }]
 *
 * Usage:
 *   pnpm tsx src/scripts/seed-sivar-brains-b3.ts
 */

import { getPayload } from 'payload';

import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

async function seedSivarBrainsB3() {
  const payload = await getPayload({ config });

  console.log('[seed-sivar-brains-b3] GAP-ENT-02: clean areaServed — FASE 4.B.3');

  // ── PASO 1: Leer sivar-brains actual ────────────────────────────────────────
  const result = await payload.find({
    collection: 'entities',
    where: { slug: { equals: 'sivar-brains' } },
    locale: 'es',
    depth: 0,
  });

  if (!result.docs.length) {
    throw new Error('[seed-sivar-brains-b3] ERROR: sivar-brains entity not found');
  }

  const sb = result.docs[0];
  const sbId = sb.id;
  console.log(`[1/2] sivar-brains encontrado (ID=${sbId})`);
  console.log(`      areaServed actual: ${JSON.stringify(sb.organization?.areaServed)}`);

  // ── PASO 2: Actualizar areaServed con valores canónicos ───────────────────
  // Payload hace patch de los campos del grupo — solo se necesita pasar areaServed.
  // Los demás campos (founders, knowsAbout, etc.) se preservan en DB sin tocarlos.
  await payload.update({
    collection: 'entities',
    id: sbId,
    locale: 'es',
    data: {
      organization: {
        // GAP-ENT-02 fix: valores limpios, sin código de país, sin mezcla idiomas
        areaServed: [{ region: 'El Salvador' }, { region: 'América Latina' }],
      },
    },
  });

  console.log(`[2/2] ✓ sivar-brains.areaServed actualizado`);
  console.log(
    `      Antes: [{ region: 'El Salvador SV' }, { region: 'Latinoamérica / Latin America' }]`,
  );
  console.log(`      Después: [{ region: 'El Salvador' }, { region: 'América Latina' }]`);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('[seed-sivar-brains-b3] GAP-ENT-02 RESUELTO — FASE 4.B.3');
  console.log('  Refactor a typed relationship (4B-ON-03) → FASE 4.C');
  console.log('═══════════════════════════════════════════════════════════');

  process.exit(0);
}

seedSivarBrainsB3().catch((err) => {
  console.error('[seed-sivar-brains-b3] ERROR:', err);
  process.exit(1);
});
