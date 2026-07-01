/**
 * Runtime validation de environment variables.
 *
 * Fail-fast al startup si alguna variable requerida está ausente o inválida.
 * Schema canonical per SB_ExternalConfigsCanon v1.1 + D-EXTCONFIG-01..07.
 *
 * Refs: FASE 4.B.0 Hardening, L-BBF-250 (memoria de build)
 */

import { z } from 'zod';

const envSchema = z.object({
  // === Database ===
  DATABASE_URL: z.string().url(),

  // === Payload CMS ===
  PAYLOAD_SECRET: z.string().min(32),

  // === Cloudflare R2 (media storage) — B-BBF-WEB-RAILWAY-EJECUCION-01, reemplaza Vercel Blob ===
  // Opcionales aquí (requeridos solo en production, ver superRefine abajo) — "local dev sin
  // provisionar" es un estado válido documentado en payload.config.ts (el plugin se salta si faltan).
  R2_BUCKET: z.string().min(1).optional(),
  R2_ENDPOINT: z.string().url().optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),

  // === Resend (email + newsletter) ===
  RESEND_API_KEY: z.string().min(1),
  RESEND_AUDIENCE_ID: z.string().optional(),
  // No .email() — el valor real es un From header RFC 5322 ("Nombre <email>"),
  // no una dirección bare (ver newsletter.ts). Hallado al conectar env.ts (B-BBF-WEB-FIX-R2-STORAGE).
  RESEND_FROM_NEWSLETTER: z.string().min(1).optional(),
  RESEND_WEBHOOK_SECRET: z.string().optional(),

  // === Upstash Redis (rate limiting) ===
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // === Cloudflare Turnstile (bot protection) ===
  TURNSTILE_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),

  // === Site config ===
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // === Runtime ===
  NODE_ENV: z.enum(['development', 'production', 'test'] as const).default('development'),
});

const R2_KEYS = ['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'] as const;

// En production, R2 SÍ es requerido (storage real, no "sin provisionar") — fail-fast
// si falta cualquiera, en vez de degradar en silencio a storage local efímero.
const envSchemaProd = envSchema.superRefine((data, ctx) => {
  if (data.NODE_ENV !== 'production') return;
  for (const key of R2_KEYS) {
    if (!data[key]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [key],
        message: `${key} es requerido en production (Cloudflare R2 storage — B-BBF-WEB-FIX-R2-STORAGE)`,
      });
    }
  }
});

/**
 * Parsed + validated env. Throws at module load if invalid.
 *
 * Uso:
 *   import { env } from '@/lib/env'
 *   env.DATABASE_URL  // type-safe, validated
 */
export const env = envSchemaProd.parse(process.env);

export type Env = z.infer<typeof envSchema>;
