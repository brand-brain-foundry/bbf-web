'use client';

import dynamic from 'next/dynamic';

// D-BBF-PULPO — ssr:false debe invocarse desde un Client Component (Next.js
// App Router no lo permite directo en un Server Component como page.tsx).
// Este wrapper es el único propósito: mover el code-split fuera del server tree.
export const PulpoPixelLoader = dynamic(() => import('./PulpoPixel').then((m) => m.PulpoPixel), {
  ssr: false,
});
