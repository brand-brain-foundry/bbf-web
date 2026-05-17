'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type Surface = 'light' | 'dark' | 'glass-light' | 'glass-dark';

interface SurfaceContextValue {
  surface: Surface;
}

const SurfaceContext = createContext<SurfaceContextValue>({ surface: 'light' });

interface SurfaceProviderProps {
  surface: Surface;
  children: ReactNode;
}

export function SurfaceProvider({ surface, children }: SurfaceProviderProps) {
  return (
    <SurfaceContext.Provider value={{ surface }}>
      <div data-surface={surface}>{children}</div>
    </SurfaceContext.Provider>
  );
}

export function useSurfaceContext(): SurfaceContextValue {
  return useContext(SurfaceContext);
}
