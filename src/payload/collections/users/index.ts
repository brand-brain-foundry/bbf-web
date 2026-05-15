import type { CollectionConfig } from 'payload';
import { isAdmin } from '@/payload/lib/access';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'name'],
  },
  access: {
    create: isAdmin,
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return user ? { id: { equals: user.id } } : false;
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return user ? { id: { equals: user.id } } : false;
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'AI Agent', value: 'ai-agent' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
