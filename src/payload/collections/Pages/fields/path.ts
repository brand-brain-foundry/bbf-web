import type { Field } from 'payload';

export const pathField: Field = {
  name: 'path',
  type: 'text',
  required: false,
  unique: false,
  index: true,
  localized: true,
  admin: {
    position: 'sidebar',
    readOnly: true,
    description: 'Full URL path (auto-computed from slug + parent)',
  },
};
