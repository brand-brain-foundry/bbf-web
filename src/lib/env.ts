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

  // === Vercel Blob (media storage) ===
  BLOB_READ_WRITE_TOKEN: z
    .string()
    .startsWith(
      'vercel_blob_rw_',
      'BLOB_READ_WRITE_TOKEN must be a Vercel Blob token (prefix: vercel_blob_rw_)',
    ),

  // === Resend (email + newsletter) ===
  RESEND_API_KEY: z.string().min(1),
  RESEND_AUDIENCE_ID: z.string().optional(),
  RESEND_FROM_NEWSLETTER: z.string().email().optional(),
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

/**
 * Parsed + validated env. Throws at module load if invalid.
 *
 * Uso:
 *   import { env } from '@/lib/env'
 *   env.DATABASE_URL  // type-safe, validated
 */
export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
