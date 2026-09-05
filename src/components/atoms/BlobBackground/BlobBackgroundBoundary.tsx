'use client';

/**
 * BBF BlobBackground — error boundary (HAL-SBWEB-CLIENT-COMPONENT-NO-BOUNDARY-01)
 *
 * El blob es decorativo — si el motor Three.js/WebGL (o su script lazy)
 * lanza CUALQUIER excepción no capturada, esto NUNCA debe tumbar el render
 * de React entero. Mismo defecto que crasheó el blob del hero en PR#24
 * (incidente 2026-09-04, Safari/móvil/GPU sin WebGL2 — Chrome desktop local
 * no lo reproduce); `BlobBackground.tsx` ya defiende con try/catch en el
 * punto de contacto del motor (`window.BlobScene.init`), este boundary es
 * la última red si algo se escapa igual. Molde replicado de
 * `BrandGradientBackgroundBoundary.tsx` (preview/blob-hero-fix, verificado
 * por Zavala: degrada sin crashear con WebGL off).
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class BlobBackgroundBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      '[bbf-blob-background] motor Three.js/WebGL falló, degradando a fondo estático:',
      error,
      errorInfo,
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          data-component="bbf-blob-background-fallback"
          className="pointer-events-none absolute inset-0 z-0 [background:var(--bbf-gradient-brand)]"
          aria-hidden="true"
        />
      );
    }
    return this.props.children;
  }
}
