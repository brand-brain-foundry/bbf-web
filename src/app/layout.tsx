import type { ReactNode } from 'react';

/**
 * Root layout — minimal wrapper.
 *
 * Each route group ((frontend) and (payload)) provides its own
 * <html> and <body> elements to enable locale-specific lang attributes
 * and independent fonts/metadata.
 *
 * DO NOT add fonts, metadata, or providers here. They live in route group layouts.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
