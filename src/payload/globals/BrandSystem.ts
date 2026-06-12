/**
 * BrandSystem Global — D-DS-01 (Opción B, 2026-06-12)
 *
 * Contrato de SELECTORES, NO de valores CSS crudos.
 * Los valores CSS viven en tokens de código (CSS custom properties).
 * Este global guarda cuál selector está activo.
 *
 * Consumer: lib/brand/getBrandSystem.ts
 * Decisión: D-DS-01 (B — config selector, ISR-safe, zero runtime overhead)
 */
import type { GlobalConfig } from 'payload';
import { isAdmin, publicRead } from '@/payload/lib/access';

export const BrandSystem: GlobalConfig = {
  slug: 'brandSystem',
  access: { read: publicRead, update: isAdmin },
  fields: [
    {
      name: 'colors',
      type: 'group',
      fields: [
        {
          name: 'primaryPalette',
          type: 'select',
          defaultValue: 'blue',
          options: [
            { label: 'Red (BBF canon)', value: 'red' },
            { label: 'Blue (Sivar Brains)', value: 'blue' },
          ],
        },
        {
          name: 'themeMode',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Auto (system)', value: 'auto' },
          ],
        },
      ],
    },
    {
      name: 'typography',
      type: 'group',
      fields: [
        {
          name: 'displayFamily',
          type: 'select',
          defaultValue: 'inter',
          options: [
            { label: 'Inter (canon)', value: 'inter' },
            { label: 'Custom (see tokens)', value: 'custom' },
          ],
        },
        {
          name: 'bodyFamily',
          type: 'select',
          defaultValue: 'mulish',
          options: [
            { label: 'Mulish (canon)', value: 'mulish' },
            { label: 'Custom (see tokens)', value: 'custom' },
          ],
        },
      ],
    },
    {
      name: 'brand',
      type: 'group',
      fields: [
        {
          name: 'logoVariant',
          type: 'select',
          defaultValue: 'horizontal',
          options: [
            { label: 'Icon only', value: 'icon' },
            { label: 'Horizontal (icon + name)', value: 'horizontal' },
            { label: 'Name only', value: 'name-only' },
            { label: 'Stamp (circular)', value: 'stamp' },
          ],
        },
        {
          name: 'accentGradient',
          type: 'select',
          defaultValue: 'blue-animated',
          options: [
            { label: 'Red animated', value: 'red-animated' },
            { label: 'Blue animated', value: 'blue-animated' },
            { label: 'None', value: 'none' },
          ],
        },
      ],
    },
  ],
};
