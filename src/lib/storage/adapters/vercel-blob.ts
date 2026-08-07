import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import type { Plugin } from 'payload';

// P-STORAGE (HAL-SBWEB-PROVIDER-COUPLING-01) — adaptador Vercel Blob, no activo en producción
// hoy (R2 es el proveedor activo) pero mantenido disponible: volver a Vercel-Blob es cambiar
// STORAGE_PROVIDER, no revertir código (F-B4, OUTPUT-SBWEB-2026-08-06-cierre-R-BRANCH-y-diseno-P-STORAGE).
export function vercelBlobAdapter(): Plugin[] {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const active = token?.startsWith('vercel_blob_rw_') ?? false;

  if (active) {
    console.log('[storage] Vercel Blob ACTIVO — collection media usa vercelBlobStorage.');
  } else {
    console.warn(
      '[storage] Vercel Blob SKIPPED — BLOB_READ_WRITE_TOKEN ausente o con prefijo inválido. ' +
        'Media collection cae a storage local (efímero en contenedores).',
    );
  }

  if (!token || !active) return [];

  return [
    vercelBlobStorage({
      collections: { media: true },
      token,
    }),
  ];
}
