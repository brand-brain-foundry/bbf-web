'use client';

import { useRef, useState } from 'react';

import { BlobBackground } from '@/components/atoms/BlobBackground';

type Surface = 'dark' | 'sand';

export function BlobTestScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [surface, setSurface] = useState<Surface>('dark');

  return (
    <section
      ref={sectionRef}
      data-surface={surface}
      style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}
    >
      {/* No surface prop → BlobBackground reads data-surface from this section (Fase 4) */}
      <BlobBackground />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '3rem 2rem',
          color: '#fdf5ed',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Blob test</h1>
        <p style={{ fontSize: '1.125rem', maxWidth: '40ch', marginBottom: '2rem', opacity: 0.8 }}>
          Texto de prueba sobre el blob. Verificá legibilidad del contenido sobre el fondo animado.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setSurface((s) => (s === 'dark' ? 'sand' : 'dark'))}
            style={{
              padding: '0.5rem 1rem',
              background: '#fdf5ed',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Toggle surface → {surface === 'dark' ? 'sand' : 'dark'}
          </button>

          <button
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.15)',
              color: '#fdf5ed',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Botón dummy A (clickeable)
          </button>

          <button
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.15)',
              color: '#fdf5ed',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Botón dummy B (clickeable)
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', opacity: 0.5 }}>
          Surface actual: <code>{surface}</code> · Clicks en botones: no disparan morph · Clicks
          entre elementos: disparan morph (debounce 500ms)
        </p>
      </div>
    </section>
  );
}
