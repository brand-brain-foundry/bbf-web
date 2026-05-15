import type { Access, Where } from 'payload';

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin';
};

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'editor';
};

export const isContentWriter: Access = ({ req: { user } }) => {
  if (!user) return false;
  return ['admin', 'editor', 'ai-agent'].includes(user.role);
};

export const aiAgentCanUpdateIfAIGenerated: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'editor') return true;
  if (user.role === 'ai-agent') {
    return {
      aiGenerated: { equals: true },
    };
  }
  return false;
};

export const publicReadPublished: Access = ({ req: { user } }) => {
  if (user) return true;
  const publishedFilter: Where = {
    and: [
      { publishedAt: { less_than_equal: new Date().toISOString() } },
      { _status: { equals: 'published' } },
    ],
  };
  return publishedFilter;
};

export const publicRead: Access = () => true;

export const authenticatedCanCreate: Access = ({ req: { user } }) => {
  return Boolean(user);
};

export const nobody: Access = () => false;
