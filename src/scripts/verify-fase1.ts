/**
 * Verificación independiente FASE 1 — B-BBF-WEB-HOME-FASE1-VERIFY-EXTCONFIG
 * SOLO LECTURA — no escribe nada.
 * Usage: set -a; source .env.local; set +a && pnpm tsx src/scripts/verify-fase1.ts
 */
import { getPayload } from 'payload';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  /* shell env */
}

async function verify() {
  const payload = await getPayload({ config });

  // Entity sivar-brains (depth:1 para obtener slugs de topics)
  const entResult = await payload.find({
    collection: 'entities',
    where: { slug: { equals: 'sivar-brains' } },
    depth: 1,
    locale: 'es',
  });

  const sb = entResult.docs[0];
  const sameAs = ((sb.sameAs as Array<{ url: string }>) ?? []).map((s) => s.url);
  const knowsAbout = (
    (sb.organization?.knowsAbout as Array<{ id: number; slug: string }>) ?? []
  ).map((t) => (typeof t === 'object' ? `${t.slug}(${t.id})` : String(t)));

  // SiteIdentity
  const siEs = await payload.findGlobal({ slug: 'site-identity', locale: 'es', depth: 1 });
  const siEn = await payload.findGlobal({ slug: 'site-identity', locale: 'en', depth: 1 });

  const orgEntity = siEs.organizationEntity as { id: number; slug: string } | null;

  console.log('\n════════════════════════════════════════════════');
  console.log('VERIFICACIÓN INDEPENDIENTE FASE 1 — raspy-hat');
  console.log('════════════════════════════════════════════════\n');

  console.log('── Entity sivar-brains (ID=' + sb.id + ') ──────────────');
  console.log('sameAs (' + sameAs.length + '):');
  sameAs.forEach((u) => console.log('  ' + u));
  console.log('\nknowsAbout (' + knowsAbout.length + '):');
  knowsAbout.forEach((t) => console.log('  ' + t));

  console.log('\n── SiteIdentity ──────────────────────────────────');
  console.log('organizationEntity: ID=' + orgEntity?.id + ' slug=' + orgEntity?.slug);
  console.log('siteDescription ES (' + ((siEs.siteDescription as string)?.length ?? 0) + 'c):');
  console.log('  "' + siEs.siteDescription + '"');
  console.log('siteDescription EN (' + ((siEn.siteDescription as string)?.length ?? 0) + 'c):');
  console.log('  "' + siEn.siteDescription + '"');

  console.log('\n════════════════════════════════════════════════');
  process.exit(0);
}

verify().catch((e) => {
  console.error(e);
  process.exit(1);
});
