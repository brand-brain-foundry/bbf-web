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
      trackPointer?(nx: number, ny: number): void;
    };
  }
}

const THREE_SCRIPT = '/assets/blob/three.min.js';
const BLOB_SCRIPT = '/assets/blob/blob-scene.js?v=41';
const BLOB_ASSET_BASE = '/assets/blob/';
const MOBILE_WIDTH = 768;

// Module-level promise: Three.js + engine load once; BlobScene survives destroy()/init() cycles
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
  if (window.BlobScene) return Promise.resolve();
  if (enginePromise) return enginePromise;
  // Three.js must be globally available before blob-scene.js executes (IIFE uses THREE as global).
  // Sequential: Three onload → then motor. NOT parallel — parallel restores the ReferenceError.
  const w = window as typeof window & { THREE?: unknown };
  enginePromise = (async () => {
    if (!w.THREE) await injectScript(THREE_SCRIPT);
    await injectScript(BLOB_SCRIPT);
  })().catch((err: unknown) => {
    enginePromise = null; // clear so the next mount retries
    throw err;
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
  /**
   * Surface intent to render.
   * Omit (undefined) → reads data-surface from closest DOM ancestor (Fase 4).
   * Explicit value → overrides DOM; MutationObserver is NOT set up.
   */
  surface?: BlobSurface;
  className?: string;
  /** Skip all rendering (useful for tests or forced override). */
  disabled?: boolean;
}

export function BlobBackground({
  surface: surfaceProp,
  className,
  disabled = false,
}: BlobBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    const container = containerRef.current;
    if (!canvas || !container) return;

    // ── Fallback: GPU low-end or no WebGL ────────────────────────────────────
    if (navigator.hardwareConcurrency <= 2 || !webGLSupported()) {
      setUseFallback(true);
      return;
    }

    // Fase 4: surface priority — explicit prop > DOM ancestor > 'dark'
    const domHost = container.closest('[data-surface]');
    const domSurface = domHost?.getAttribute('data-surface') ?? 'dark';
    const initialSurface = surfaceProp ?? domSurface;
    const intent = BLOB_INTENTS[initialSurface] ?? BLOB_INTENTS.dark;

    const mobile =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < MOBILE_WIDTH;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let active = true;
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
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

        // ── Fase 4: MutationObserver — data-surface changes → setTweaks (no re-init) ──
        if (!surfaceProp && domHost) {
          mo = new MutationObserver(() => {
            if (!active || !window.BlobScene) return;
            const next = domHost.getAttribute('data-surface') ?? 'dark';
            window.BlobScene.setTweaks(BLOB_INTENTS[next] ?? BLOB_INTENTS.dark);
          });
          mo.observe(domHost, { attributes: true, attributeFilter: ['data-surface'] });
        }

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

        // ── 5. pointermove → cursor-driven light rotation ────────────────────
        // bindInput:false means the engine skips its own pointermove listener.
        // We forward normalized coords so the studio light follows the cursor.
        const onPointerMove = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = -((e.clientY / window.innerHeight) * 2 - 1);
          window.BlobScene?.trackPointer?.(nx, ny);
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        cleanups.push(() => window.removeEventListener('pointermove', onPointerMove));
      })
      .catch(() => setUseFallback(true));

    return () => {
      active = false;
      io?.disconnect();
      mo?.disconnect();
      cleanups.forEach((fn) => fn());
      if (morphTimerRef.current) {
        clearTimeout(morphTimerRef.current);
        morphTimerRef.current = null;
      }
      window.BlobScene?.destroy();
    };
  }, [surfaceProp, disabled, scheduleMorph]);

  if (disabled) return null;

  if (useFallback) {
    return (
      <div
        ref={containerRef}
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
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none' }}
      />
      {/* Grain — SVG fractalNoise at 5.5% opacity, mix-blend:screen. Keyframe in animations.css. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.055,
          mixBlendMode: 'screen',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          animation: 'bbf-blob-grain 4s steps(6) infinite',
          pointerEvents: 'none',
        }}
      />
      {/* Vignette — radial-gradient darkening edges for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 120% at 50% 46%, transparent 52%, rgba(0,0,0,.55) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
