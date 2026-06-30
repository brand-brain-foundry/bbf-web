/**
 * Seed SiteContact global — B-BBF-WEB-BLOQUEANTES-FUNCIONALES
 *
 * SiteContact no tiene seed propio. Payload v3 NO persiste defaultValue
 * hasta que el global se guarda explícitamente. Sin seed, primaryEmail
 * y fromEmail son undefined → Resend falla silenciosamente.
 *
 * Este script persiste los valores canónicos una sola vez.
 * Repitiendo el seed es idempotente (updateGlobal es upsert).
 *
 * Values (D-BBF-KB-99 — NOT rendered in front, admin-only):
 *   primaryEmail: contacto@sivarbrains.com  (recipient form)
 *   fallbackEmail: hola@sivarbrains.com     (errores técnicos internos)
 *   fromEmail: web@sivarbrains.com          (Resend domain verified)
 *
 * Usage:
 *   set -a && source .env.local && set +a && pnpm tsx src/scripts/seed-site-contact.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

const payload = await getPayload({ config });

await payload.updateGlobal({
  slug: 'site-contact',
  data: {
    primaryEmail: 'contacto@sivarbrains.com',
    fallbackEmail: 'hola@sivarbrains.com',
    fromEmail: 'web@sivarbrains.com',
  },
});

console.log('✅ SiteContact seeded — primaryEmail + fromEmail persistidos');

process.exit(0);
