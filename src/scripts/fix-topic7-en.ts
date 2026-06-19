/**
 * fix-topic7-en — FIX-TOPIC7-EN
 * Alinea EN locale de topic 'brand-voice-consistency' con ES + §2.9
 * EN actual: "Brand voice consistency" → correcto: "Brand voice consistency at scale"
 *
 * Causa raíz: seed-knows-about.ts actualizó nombre solo en locale default (es).
 * El EN locale tenía valor anterior de una creación previa sin "at scale".
 *
 * Usage:
 *   set -a; source .env.local; set +a && pnpm tsx src/scripts/fix-topic7-en.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

async function fixTopic7EN() {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'topics',
    where: { slug: { equals: 'brand-voice-consistency' } },
    locale: 'en',
    limit: 1,
  });

  if (!result.docs.length) {
    console.error('❌ Topic brand-voice-consistency not found');
    process.exit(1);
  }

  const doc = result.docs[0];
  const id = doc.id as number;
  console.log(`Found topic id=${id}, current EN name: "${doc.name}"`);

  await payload.update({
    collection: 'topics',
    id,
    locale: 'en',
    data: { name: 'Brand voice consistency at scale' },
  });

  const verified = await payload.find({
    collection: 'topics',
    where: { slug: { equals: 'brand-voice-consistency' } },
    locale: 'en',
    limit: 1,
  });

  const updatedName = verified.docs[0]?.name;
  if (updatedName === 'Brand voice consistency at scale') {
    console.log('✅ EN name updated: "Brand voice consistency at scale"');
  } else {
    console.error(`❌ Unexpected name after update: "${updatedName}"`);
    process.exit(1);
  }

  process.exit(0);
}

fixTopic7EN().catch((err) => {
  console.error('ERROR:', err);
  process.exit(1);
});
