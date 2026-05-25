import type { Field } from 'payload';

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  index: true,
  localized: true,
  admin: {
    position: 'sidebar',
    description: 'URL slug (auto-generated from title, can be edited)',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return value;
        if (data?.title) {
          return String(data.title)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        return value;
      },
    ],
  },
};
