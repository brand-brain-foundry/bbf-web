'use client';

import { useSurfaceContext, type Surface } from '@/lib/context/SurfaceContext';

export function useSurface(): Surface {
  return useSurfaceContext().surface;
}
