import type { ReactNode } from 'react';
import '@/app/globals.css';

/**
 * Frontend layout — imports global CSS.
 *
 * NOTE: <html> and <body> live in [locale]/layout.tsx
 * to enable locale-specific lang attributes.
 */
export default function FrontendLayout({ children }: { children: ReactNode }) {
  return children;
}
