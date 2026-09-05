'use client';

/**
 * BBF BrandGradientBackground — error boundary (post-incidente D-SBWEB-BLOB-BRAND-02)
 *
 * El blob es decorativo — si el motor WebGL2 (o su chunk lazy) lanza
 * CUALQUIER excepción no capturada, esto NUNCA debe tumbar el render de
 * React entero. Nace tras incidente de producción 2026-09-04: PR#24
 * crasheó sivarbrains.com en navegadores reales (Safari/móvil/GPU con
 * WebGL2 bloqueado) que Chrome desktop local no reproduce — sin boundary,
 * el error sube hasta la raíz y Next.js renderiza la página de error
 * genérica ("Application error: a client-side exception has occurred").
 * `engine.ts` y `BrandGradientBackground.tsx` ya defienden con try/catch
 * en cada punto de contacto con la API del navegador; este boundary es la
 * última red si algo se escapa igual.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class BrandGradientBackgroundBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      '[bbf-brand-gradient-background] motor WebGL2 falló, degradando a fondo estático:',
      error,
      errorInfo,
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Mismo fallback visual que BrandGradientBackground.tsx usa cuando
      // WebGL2 no está soportado — sin color hardcodeado (token semantic).
      return (
        <div
          data-component="bbf-brand-gradient-background-fallback"
          className="pointer-events-none absolute inset-0 z-0 [background:var(--bbf-gradient-brand)]"
          aria-hidden="true"
        />
      );
    }
    return this.props.children;
  }
}
