// P-STORAGE (HAL-SBWEB-PROVIDER-COUPLING-01) — fuente única del hostname de CSP por proveedor.
// Dato puro, cero imports: importable sin transpilación tanto desde next.config.mjs (build-time,
// antes de que exista runtime de Payload) como desde los adaptadores TS en runtime.
export const STORAGE_PROVIDERS = {
  'vercel-blob': { hostname: '*.public.blob.vercel-storage.com' },
  r2: { hostname: '*.r2.dev' },
};
