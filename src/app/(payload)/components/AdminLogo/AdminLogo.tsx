/**
 * BBF Design System — Admin Logo (D-109 Admin canon + D-107 Cross-surface)
 *
 * Subordinado a: B-BBF-WEB-M5-ADMIN-3-IMPLEMENTATION
 * Decisiones: D-107 (Cross-surface), D-109 (Admin canon), D-110 (Surface)
 *
 * Logo BBF para Payload admin login + dashboard.
 * Reusa BBFLogo atom canon (NO sistema design paralelo).
 *
 * Referenciado en payload.config.ts:
 *   admin.components.graphics.Logo: '@/app/(payload)/components/AdminLogo'
 */

import { BBFLogo } from '@/components/atoms/BBFLogo';

export default function AdminLogo() {
  return (
    <div
      data-component="bbf-admin-logo"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--bbf-space-4) 0',
      }}
    >
      <BBFLogo variant="horizontal" size="md" />
    </div>
  );
}
