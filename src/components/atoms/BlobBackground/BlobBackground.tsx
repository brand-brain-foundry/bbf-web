'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { BLOB_INTENTS } from '@/lib/blob/blob-intents';

// ── Engine singleton (IIFE — one global BlobScene per page) ──────────────────
declare global {
  interface Window {
    BlobScene?: {
      init(canvas: HTMLCanvasElement): void;
      setTweaks(cfg: Record<string, unknown>): void;
      morph(): void;
      pause(): void;
      resume(): void;
      destroy(): void;
    };
  }
}

const BLOB_SCRIPT = '/assets/blob/blob-scene.js?v=39';
const BLOB_ASSET_BASE = '/assets/blob/';
const MOBILE_WIDTH = 768;

// Module-level promise: script loads once, BlobScene survives destroy()/init() cycles
let enginePromise: Promise<void> | null = null;

function loadEngine(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.BlobScene) return Promise.resolve();
  if (enginePromise) return enginePromise;
  enginePromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = BLOB_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      enginePromise = null;
      reject(new Error('blob-scene.js failed to load'));
    };
    document.head.appendChild(s);
  });
  return enginePromise;
}

function webGLSupported(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

type BlobSurface = 'dark' | 'sand';

interface BlobBackgroundProps {
  /** Which surface intent to render. Fase 4 will wire this to data-surface. */
  surface?: BlobSurface;
  className?: string;
  /** Skip all rendering (useful for tests or forced override). */
  disabled?: boolean;
}

export function BlobBackground({
  surface = 'dark',
  className,
  disabled = false,
}: BlobBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const morphTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  // Debounced morph — 500ms window, skips interactive elements
  const scheduleMorph = useCallback((e: PointerEvent) => {
    const target = e.target as Element | null;
    if (target?.closest?.('button,a,input,textarea,select,[role="button"],[data-no-morph]')) return;
    if (morphTimerRef.current || !window.BlobScene) return;
    window.BlobScene.morph();
    morphTimerRef.current = setTimeout(() => {
      morphTimerRef.current = null;
    }, 500);
  }, []);

  useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Fallback: GPU low-end or no WebGL ────────────────────────────────────
    if (navigator.hardwareConcurrency <= 2 || !webGLSupported()) {
      setUseFallback(true);
      return;
    }

    const intent = BLOB_INTENTS[surface] ?? BLOB_INTENTS.dark;
    const mobile =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < MOBILE_WIDTH;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let active = true;
    let io: IntersectionObserver | null = null;
    const cleanups: Array<() => void> = [];

    loadEngine()
      .then(() => {
        if (!active || !canvas || !window.BlobScene) return;

        // Apply intent + mobile degradation + reduced-motion before init
        window.BlobScene.setTweaks({
          ...intent,
          assetBase: BLOB_ASSET_BASE,
          bindInput: false, // React owns pointer events
          ...(mobile ? { maxDpr: 1.0, speed: Math.round(intent.speed * 0.7) } : {}),
          ...(reducedMotion ? { speed: 0, camera: false } : {}),
        });
        window.BlobScene.init(canvas);

        // ── 1. IntersectionObserver: pause when <5% visible ──────────────────
        io = new IntersectionObserver(
          ([entry]) => {
            if (!window.BlobScene) return;
            if (entry.intersectionRatio < 0.05) {
              window.BlobScene.pause();
              pausedRef.current = true;
            } else if (pausedRef.current) {
              window.BlobScene.resume();
              pausedRef.current = false;
            }
          },
          { threshold: [0, 0.05] },
        );
        io.observe(canvas);

        // ── 2. visibilitychange: pause on tab hidden ─────────────────────────
        const onVisibility = () => {
          if (!window.BlobScene) return;
          if (document.hidden) {
            window.BlobScene.pause();
          } else if (!pausedRef.current) {
            window.BlobScene.resume();
          }
        };
        document.addEventListener('visibilitychange', onVisibility);
        cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));

        // ── 3. prefers-reduced-motion: freeze/unfreeze ───────────────────────
        const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onMotion = (e: MediaQueryListEvent) => {
          window.BlobScene?.setTweaks(
            e.matches
              ? { speed: 0, camera: false }
              : { speed: intent.speed, camera: intent.camera },
          );
        };
        motionMql.addEventListener('change', onMotion);
        cleanups.push(() => motionMql.removeEventListener('change', onMotion));

        // ── 4. Tap-to-morph: window-level with debounce ──────────────────────
        window.addEventListener('pointerdown', scheduleMorph);
        cleanups.push(() => window.removeEventListener('pointerdown', scheduleMorph));
      })
      .catch(() => setUseFallback(true));

    return () => {
      active = false;
      io?.disconnect();
      cleanups.forEach((fn) => fn());
      if (morphTimerRef.current) {
        clearTimeout(morphTimerRef.current);
        morphTimerRef.current = null;
      }
      window.BlobScene?.destroy();
    };
  }, [surface, disabled, scheduleMorph]);

  if (disabled) return null;

  if (useFallback) {
    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          // CSS fallback: black base + PNG when available
          backgroundColor: '#000000',
          backgroundImage: 'url(/assets/blob/blob-dark-fallback.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={className}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {/*
        canvas: pointer-events:none — the component doesn't intercept clicks.
        Tap-to-morph is handled via window pointerdown (scheduleMorph),
        which skips buttons/links/inputs so content above is unaffected.
        The parent section needs position:relative; overflow:hidden.
      */}
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  );
}
