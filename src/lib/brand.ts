/**
 * SSOT del nombre de marca para código que NO puede leer `SiteIdentity.siteName`
 * en runtime (circular dependency en payload.config.ts, `export const` estático
 * de Next.js, boundary de resiliencia en admin/login, o fallback de última
 * instancia si Payload falla).
 *
 * El valor dinámico real vive en `SiteIdentity.siteName` (Payload) vía
 * `getSiteIdentity()` — esa sigue siendo la fuente editable sin deploy.
 * Esta constante existe solo para los casos que no pueden consultarla.
 *
 * Ref: B-BBF-WEB-AUDIT-SITENAME-SSOT + B-BBF-WEB-SITENAME-SSOT-EJECUCION
 */
export const SITE_NAME_FALLBACK = 'Sivar Brains';
export const SITE_NAME_UPPER = 'SIVAR BRAINS';
