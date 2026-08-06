import { s3Storage } from '@payloadcms/storage-s3';
import type { Plugin } from 'payload';

// P-STORAGE (HAL-SBWEB-PROVIDER-COUPLING-01) — reubicado tal cual desde payload.config.ts,
// sin cambio de lógica (B-BBF-WEB-FIX-R2-RUNTIME-FINAL / B-BBF-WEB-RAILWAY-EJECUCION-01).
// Cloudflare R2 (S3-compatible) via adapter oficial @payloadcms/storage-s3. R2 usa region 'auto'
// (no es región AWS real) + forcePathStyle:true (requisito R2 — sin esto el SDK intenta
// virtual-hosted-style addressing, que R2 no siempre tolera). B-BBF-WEB-FIX-R2-STORAGE.
export function r2Adapter(): Plugin[] {
  const r2Bucket = process.env.R2_BUCKET;
  const r2Endpoint = process.env.R2_ENDPOINT;
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  const r2Vars = {
    R2_BUCKET: r2Bucket,
    R2_ENDPOINT: r2Endpoint,
    R2_ACCESS_KEY_ID: r2AccessKeyId,
    R2_SECRET_ACCESS_KEY: r2SecretAccessKey,
  };
  const r2Missing = Object.entries(r2Vars)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  const r2Active = r2Missing.length === 0;

  if (r2Active) {
    console.log('[storage] R2 (Cloudflare) ACTIVO — collection media usa s3Storage.');
  } else {
    console.warn(
      `[storage] R2 SKIPPED — faltan env vars: ${r2Missing.join(', ')}. ` +
        'Media collection cae a storage local (efímero en contenedores). ' +
        'Si esto aparece en producción, confirmar las 4 vars en el panel del host (runtime, no solo build).',
    );
  }

  if (!r2Bucket || !r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey) return [];

  return [
    s3Storage({
      collections: { media: true },
      bucket: r2Bucket,
      config: {
        credentials: {
          accessKeyId: r2AccessKeyId,
          secretAccessKey: r2SecretAccessKey,
        },
        region: 'auto',
        endpoint: r2Endpoint,
        forcePathStyle: true,
      },
    }),
  ];
}
