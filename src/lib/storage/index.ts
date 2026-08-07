import type { Plugin } from 'payload';

import { r2Adapter } from './adapters/r2';
import { vercelBlobAdapter } from './adapters/vercel-blob';

// P-STORAGE (HAL-SBWEB-PROVIDER-COUPLING-01) — único punto de decisión del proveedor de storage.
// Lee STORAGE_PROVIDER directo de process.env (NO importa src/lib/env.ts — atarlo al schema
// completo forzaría el arranque a validar las 9+ vars ajenas a storage, misma lección que R-SEC).
// Fallback 'r2' coincide con el proveedor activo hoy en producción — efecto observable cero.
export function getStorageAdapter(): Plugin[] {
  const provider = process.env.STORAGE_PROVIDER === 'vercel-blob' ? 'vercel-blob' : 'r2';

  switch (provider) {
    case 'vercel-blob':
      return vercelBlobAdapter();
    case 'r2':
    default:
      return r2Adapter();
  }
}
