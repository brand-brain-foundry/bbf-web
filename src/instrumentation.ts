/**
 * Next.js instrumentation hook — corre una vez al iniciar el servidor,
 * antes de servir cualquier request. Conecta src/lib/env.ts (fail-fast
 * Zod) al boot real — hasta B-BBF-WEB-FIX-R2-STORAGE nunca se importaba
 * desde ningún lado, así que su validación jamás corría.
 *
 * Guard a nodejs runtime: env.ts valida secretos server-only, sin sentido
 * (y con riesgo de incompatibilidad) en el runtime edge.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./lib/env');
  }
}
