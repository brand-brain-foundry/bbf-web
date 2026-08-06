/**
 * invalidateContent — núcleo único de invalidación de cache ISR (Next.js).
 *
 * Fuente única para "contenido cambiado → rutas/tags a invalidar"
 * (R-CACHE, D-SBWEB-CACHE). Reemplaza el try/catch+log duplicado que vivía
 * por separado en revalidateGlobal.ts, media/index.ts y
 * Pages/hooks/revalidate.ts.
 *
 * Inline — patrón oficial Payload embebido (revalidatePath/revalidateTag
 * ejecutados dentro del Route Handler real que procesa el save de
 * @payloadcms/next). H-BBF-524 descartó el patrón HTTP-fetch a un endpoint
 * dedicado (innecesario para Payload embebido en el mismo proceso Next) —
 * no se revive aquí.
 *
 * Punto de extensión: la purga de Cloudflare (o cualquier otro CDN/edge)
 * NO vive en este núcleo — es un adaptador aparte por actor (R-CACHE F3
 * punto 5, EXEC-2). El núcleo se queda agnóstico de quién más consume la
 * invalidación; cada hook que lo llama decide si además invoca su propio
 * adaptador (hoy: purgeCloudflareCache(), sin condicionar — EXEC-2).
 */
import { revalidatePath, revalidateTag } from 'next/cache';

export const LOCALES = ['es', 'en'] as const;

export type CachePathType = 'page' | 'layout';

export type CachePath = { path: string; type?: CachePathType };

export type CacheDescriptor = {
  paths: CachePath[];
  tags?: string[];
};

/** Cascada total: invalida el subárbol completo bajo cada locale (layout compartido). */
export function layoutScope(): CachePath[] {
  return LOCALES.map((locale) => ({ path: `/${locale}`, type: 'layout' as const }));
}

/** Página específica: invalida solo esa ruta exacta en cada locale. */
export function pageScope(subpath = ''): CachePath[] {
  return LOCALES.map((locale) => ({ path: `/${locale}${subpath}`, type: 'page' as const }));
}

export function invalidateContent(
  descriptor: CacheDescriptor,
  logger?: { info: (message: string) => void },
): void {
  try {
    for (const { path, type } of descriptor.paths) {
      if (type) {
        revalidatePath(path, type);
      } else {
        revalidatePath(path);
      }
    }
    for (const tag of descriptor.tags ?? []) {
      revalidateTag(tag);
    }
    logger?.info(
      `[invalidateContent] ${descriptor.paths
        .map((p) => `${p.path}${p.type ? `:${p.type}` : ''}`)
        .join(', ')} tags=[${(descriptor.tags ?? []).join(', ')}]`,
    );
  } catch {
    // No-op fuera de Next.js request context (seed scripts, CLI). El
    // cambio ya se commitió en DB — solo se omite la invalidación de cache
    // ISR. Guard defensivo verificado correcto (R-CACHE F1.2, H-BBF-524).
  }
}
