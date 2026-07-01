/**
 * Healthcheck — liveness simple para DO App Platform (u otro host).
 *
 * Solo confirma que el proceso Next.js responde — NO toca DB/Payload
 * (un check de readiness que falle por latencia de DB no debe tumbar
 * el deploy). Sin auth, sin queries, rápido por diseño.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ status: 'ok' });
}
