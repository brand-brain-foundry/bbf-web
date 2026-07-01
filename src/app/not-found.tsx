/**
 * Root not-found — fallback SOLO para rutas que no matchean ningún route group
 * (fuera de [locale]). El 404 real para visitantes vive en
 * (frontend)/[locale]/not-found.tsx — este archivo existe únicamente para que
 * Next.js no dependa de su página 404 interna por defecto, que en App Router
 * sin not-found.tsx raíz puede fallar el prerender con
 * "<Html> should not be imported outside of pages/_document" (bug conocido
 * Next.js, ver B-BBF-WEB-RAILWAY-EJECUCION-01).
 *
 * Sin route group — debe proveer su propio <html>/<body> (root layout es passthrough).
 */
export default function NotFound() {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: '#0a0a0a', color: '#fff' }}>
        <main
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1>404</h1>
          <p>Página no encontrada / Page not found.</p>
          <a href="/" style={{ color: '#3a7bff' }}>
            Volver al inicio / Back home
          </a>
        </main>
      </body>
    </html>
  );
}
