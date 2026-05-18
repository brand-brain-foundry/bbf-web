/**
 * BBF Design System — Admin Icon (D-109 Admin canon)
 *
 * Subordinado a: B-BBF-WEB-M5-ADMIN-3-IMPLEMENTATION
 * Decisiones: D-107 (Cross-surface), D-109 (Admin canon)
 *
 * Icon BBF condensado para Payload admin nav.
 * Reusa BBFLogo atom canon (variant stamp — icon compacto).
 *
 * Referenciado en payload.config.ts:
 *   admin.components.graphics.Icon: '@/app/(payload)/components/AdminIcon'
 */

import { BBFLogo } from '@/components/atoms/BBFLogo';

export default function AdminIcon() {
  return (
    <div
      data-component="bbf-admin-icon"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BBFLogo variant="stamp" size="sm" />
    </div>
  );
}
