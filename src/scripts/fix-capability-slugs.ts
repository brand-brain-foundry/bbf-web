/**
 * fix-capability-slugs — D-CT-BUG-02
 *
 * Los slugs de capabilities.items fueron seeded con '#' prefix y
 * uno con espacio final ('#integra '). Esto produce @ids incorrectos
 * en Service JSON-LD (#service-#conversa en lugar de #service-conversa).
 *
 * Este script lee el estado actual, sanitiza los slugs y escribe de vuelta
 * via Payload updateGlobal. Solo toca el campo `slug` (no localized),
 * sin afectar los campos localized (title, lede, etc.).
 *
 * Usage:
 *   set -a; source .env.local; set +a && pnpm tsx src/scripts/fix-capability-slugs.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // env already loaded
}

async function main() {
  const payload = await getPayload({ config });

  // Read current state (ES — slug is not localized, same in all locales)
  const hp = await payload.findGlobal({ slug: 'site-homepage', locale: 'es', depth: 0 });

  const currentItems = (hp.capabilities?.items ?? []) as Array<{
    id?: string | null;
    slug: string;
    title?: string | null;
    lede?: string | null;
  }>;

  console.log('Before:');
  currentItems.forEach((item) => console.log(`  slug="${item.slug}" title="${item.title}"`));

  const cleanItems = currentItems.map((item) => ({
    ...item,
    slug: item.slug.replace(/^#+/, '').trim(),
  }));

  console.log('\nAfter:');
  cleanItems.forEach((item) => console.log(`  slug="${item.slug}" title="${item.title}"`));

  // Count changes
  const changed = cleanItems.filter((item, i) => item.slug !== currentItems[i].slug);
  if (changed.length === 0) {
    console.log('\n✅ No changes needed — slugs already clean.');
    process.exit(0);
  }

  console.log(`\nUpdating ${changed.length} slugs...`);

  await payload.updateGlobal({
    slug: 'site-homepage',
    locale: 'es',
    data: {
      capabilities: {
        ...(hp.capabilities as object),
        items: cleanItems,
      },
    },
    depth: 0,
  });

  console.log('✅ Slugs updated.');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
