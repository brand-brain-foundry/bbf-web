import type { CollectionConfig } from 'payload';

export const pagesAccess: CollectionConfig['access'] = {
  read: ({ req: { user } }) => {
    if (user) return true;
    return {
      _status: { equals: 'published' },
    };
  },
  create: ({ req: { user } }) => Boolean(user),
  update: ({ req: { user } }) => Boolean(user),
  delete: ({ req: { user } }) => Boolean(user),
};
