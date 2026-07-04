'use client';

import { useEffect, useRef } from 'react';

// D-BBF-PULPO — engine singleton (mismo patrón BlobBackground.tsx): un solo
// <script> inyectado por página, sobrevive ciclos destroy()/init().
declare global {
  interface Window {
    OctopusPet?: {
      init(options?: Record<string, unknown>): { destroy(): void; refresh(): void };
    };
  }
}

const PULPO_SCRIPT = '/assets/pulpo/octopus.js?v=1';

let enginePromise: Promise<void> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Script load failed: ${src}`));
    document.head.appendChild(s);
  });
}

function loadEngine(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.OctopusPet) return Promise.resolve();
  if (enginePromise) return enginePromise;
  enginePromise = injectScript(PULPO_SCRIPT).catch((err: unknown) => {
    enginePromise = null; // clear so the next mount retries
    throw err;
  });
  return enginePromise;
}

// R-BBF-DS-03 — Canvas 2D no lee CSS vars; hex documentado con su equivalencia canon.
// Preset de marca BBF (default). Cada página puede sobreescribir vía props (§5).
const PULPO_ACCENT = '#255ff1'; // --bbf-accent-blue (canon blue post-rebrand, D-REBRAND-01)
const PULPO_EYE = '#ebe3d4'; // --bbf-color-sand-deep-shade
const PULPO_INK = '#1a1a1a'; // --bbf-color-black-600 (D1: Opción A)

interface PulpoPixelProps {
  /** Color del cuerpo. Default: preset de marca BBF (--bbf-accent-blue). */
  accent?: string;
  /** Color de los ojos. Default: preset de marca BBF (--bbf-color-sand-deep-shade). */
  eyeColor?: string;
  /** Color de tinta (ambos tonos). Default: preset de marca BBF (--bbf-color-black-600). */
  inkColor?: string;
  /** Selector de obstáculos. Default coincide con el motor (`[data-oct-obstacle]`). */
  obstacleSelector?: string;
  /** Desactiva completamente (fuera de homepage, tests, etc.). */
  disabled?: boolean;
}

/**
 * PulpoPixel — mascota Canvas 2D pixel-art (D-BBF-PULPO).
 *
 * Motor agnóstico en `public/assets/pulpo/octopus.js` (I-1..I-5: sin voz/marca
 * hardcodeada en el motor — el preset de marca vive aquí, en el wrapper).
 * Gate de capacidad + defer post-LCP replican src/components/atoms/BlobBackground
 * (BlobBackground.tsx:109-129) — mismo patrón, no uno nuevo (A-01).
 *
 * D3 (firmada): activo en mobile/touch — el motor soporta followTouch nativo,
 * sin gate de pointer:coarse. Sí gatea hardware débil y reduced-motion (este
 * último DESACTIVA por completo, no solo atenúa — WCAG 2.1 SC 2.3.3).
 */
export function PulpoPixel({
  accent = PULPO_ACCENT,
  eyeColor = PULPO_EYE,
  inkColor = PULPO_INK,
  obstacleSelector,
  disabled = false,
}: PulpoPixelProps) {
  const instanceRef = useRef<{ destroy(): void } | null>(null);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === 'undefined') return;

    // ── Fallback: hardware débil ─────────────────────────────────────────
    if (navigator.hardwareConcurrency <= 2) return;

    // ── prefers-reduced-motion: DESACTIVA (no solo atenúa) ───────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let active = true;
    let cancelIdle: (() => void) | null = null;

    // ── Defer post-LCP: requestIdleCallback (fallback setTimeout Safari) ──
    const schedule = (cb: () => void) => {
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(cb, { timeout: 4000 });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else {
        const id = setTimeout(cb, 1500);
        cancelIdle = () => clearTimeout(id);
      }
    };

    schedule(() => {
      if (!active) return;
      loadEngine()
        .then(() => {
          if (!active || !window.OctopusPet) return;
          instanceRef.current = window.OctopusPet.init({
            accent,
            eyeColor,
            inkColor,
            inkColor2: inkColor,
            ...(obstacleSelector ? { obstacleSelector } : {}),
          });
        })
        .catch(() => {
          /* engine load failed — sin mascota, sin romper la página (mismo patrón BlobBackground) */
        });
    });

    return () => {
      active = false;
      cancelIdle?.();
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [accent, eyeColor, inkColor, obstacleSelector, disabled]);

  // El motor crea su propio <canvas> fixed overlay (pointer-events:none) —
  // nada que renderizar en el árbol React.
  return null;
}
