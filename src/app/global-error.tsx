'use client';

import { useEffect } from 'react';
import { Inter, Mulish } from 'next/font/google';
import '@/app/globals.css';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';

/**
 * Root error boundary (Next.js App Router) — última red del sitio.
 *
 * Reemplaza el layout raíz ENTERO cuando un error escapa de cualquier
 * boundary de segmento o de widget (spec Next: por eso trae su propio
 * <html>/<body> — el root layout real, `src/app/layout.tsx`, es un
 * passthrough sin <html>, y [locale]/layout.tsx no está disponible aquí).
 * Re-declara las mismas fuentes y `globals.css` que [locale]/layout.tsx
 * para que los tokens (`--bbf-*`) y la tipografía resuelvan igual que en
 * el resto del sitio — sin esto, el fallback caería a estilos de navegador
 * por defecto. Formaliza HAL-SBWEB-CLIENT-COMPONENT-NO-BOUNDARY-01 /
 * L-34 junto con `.claude/rules/60-error-boundary-policy.md`.
 */

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mulish',
  display: 'swap',
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[bbf-global-error] error no capturado en la raíz:', error);
  }, [error]);

  return (
    <html lang="es" className={`${inter.variable} ${mulish.variable}`}>
      <body>
        <main data-component="bbf-global-error" className="flex min-h-screen items-center py-24">
          <Container size="prose" className="text-center">
            <Heading level="h2" weight="bold" color="primary" className="mb-4">
              Algo salió mal
            </Heading>
            <Text variant="body-lg" color="secondary" className="mb-10">
              Ocurrió un error inesperado. Por favor intenta de nuevo.
            </Text>
            <Button intent="primary" size="lg" onClick={reset}>
              Reintentar
            </Button>
          </Container>
        </main>
      </body>
    </html>
  );
}
