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

  // === P-STORAGE (HAL-SBWEB-PROVIDER-COUPLING-01) — selector por config, no por rama ===
  STORAGE_PROVIDER: z.enum(['r2', 'vercel-blob']).default('r2'),

  // === Cloudflare R2 (media storage) ===
  // Opcionales aquí (requeridas solo cuando STORAGE_PROVIDER='r2', ver superRefine abajo) —
  // "sin provisionar" es un estado válido documentado en adapters/r2.ts (el plugin se salta si faltan).
  R2_BUCKET: z.string().min(1).optional(),
  R2_ENDPOINT: z.string().url().optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),

  // === Vercel Blob (media storage) ===
  // Requerido solo cuando STORAGE_PROVIDER='vercel-blob' (ver superRefine abajo).
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),

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

  // === Cloudflare Cache Purge (edge CDN) — B-BBF-WEB-FIX-CACHE-CDN-01 ===
  // Opcionales — si faltan, purgeCloudflareCache() solo loguea y sigue (no rompe el save).
  CLOUDFLARE_API_TOKEN: z.string().min(1).optional(),
  CLOUDFLARE_ZONE_ID: z.string().min(1).optional(),

  // === Site config ===
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // === Runtime ===
  NODE_ENV: z.enum(['development', 'production', 'test'] as const).default('development'),
});

const R2_KEYS = ['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'] as const;

// P-STORAGE: las vars requeridas dependen del proveedor SELECCIONADO (STORAGE_PROVIDER),
// no de NODE_ENV — el proveedor ya no se infiere del entorno, se declara explícitamente.
const envSchemaProd = envSchema.superRefine((data, ctx) => {
  if (data.STORAGE_PROVIDER === 'r2') {
    for (const key of R2_KEYS) {
      if (!data[key]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `${key} es requerido cuando STORAGE_PROVIDER='r2' (P-STORAGE)`,
        });
      }
    }
  } else if (data.STORAGE_PROVIDER === 'vercel-blob') {
    if (!data.BLOB_READ_WRITE_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['BLOB_READ_WRITE_TOKEN'],
        message:
          "BLOB_READ_WRITE_TOKEN es requerido cuando STORAGE_PROVIDER='vercel-blob' (P-STORAGE)",
      });
    } else if (!data.BLOB_READ_WRITE_TOKEN.startsWith('vercel_blob_rw_')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['BLOB_READ_WRITE_TOKEN'],
        message: 'BLOB_READ_WRITE_TOKEN debe tener el prefijo vercel_blob_rw_ (P-STORAGE)',
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
