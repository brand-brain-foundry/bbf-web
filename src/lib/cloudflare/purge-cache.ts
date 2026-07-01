/**
 * Purge de cache de Cloudflare — complementa la revalidación interna de
 * Next.js (revalidatePath/revalidateTag) en los hooks afterChange de
 * Payload. Next.js invalida SU propio cache, pero Cloudflare cachea el
 * HTML en el edge por separado (respeta el header s-maxage que Next
 * emite para páginas con `revalidate`) — sin este purge, el edge sigue
 * sirviendo la versión vieja hasta que s-maxage expira.
 *
 * purge_everything (no purge por URL/tag): header/footer/nav afectan
 * TODAS las páginas, así que un purge selectivo requeriría mantener un
 * mapeo "qué global/collection afecta qué rutas" — frágil y con riesgo
 * de quedar desactualizado. Para el volumen de publish de este sitio,
 * purgar todo el edge en cada save es simple y suficientemente barato.
 *
 * Ref: B-BBF-WEB-FIX-CACHE-CDN-01.
 */
export async function purgeCloudflareCache(): Promise<void> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;

  if (!token || !zoneId) {
    console.warn(
      '[cloudflare] Purge SKIPPED — faltan CLOUDFLARE_API_TOKEN / CLOUDFLARE_ZONE_ID en runtime. ' +
        'El edge puede seguir sirviendo contenido stale hasta que expire s-maxage.',
    );
    return;
  }

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ purge_everything: true }),
    });

    const data = (await res.json()) as { success?: boolean; errors?: unknown };

    if (!res.ok || !data.success) {
      console.error('[cloudflare] Purge FAILED', { status: res.status, errors: data.errors });
      return;
    }

    console.log('[cloudflare] Purge OK — edge cache invalidado.');
  } catch (err) {
    // No debe romper el save de Payload por un fallo de red hacia Cloudflare —
    // el contenido ya se guardó en Neon, solo el purge del edge falló.
    console.error('[cloudflare] Purge error de red', err);
  }
}
