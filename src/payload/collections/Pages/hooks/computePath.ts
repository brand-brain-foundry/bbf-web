import type { CollectionBeforeChangeHook } from 'payload';

export const computePath: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!data.slug) return data;

  let path = data.slug;

  if (data.parent) {
    // @ts-justify: pages pending payload generate:types — Wave 12-A
    const parentDoc = await (req.payload.findByID as Function)({
      collection: 'pages',
      id: data.parent,
      depth: 0,
    });
    const parentPath = (parentDoc as Record<string, unknown> | null)?.path;
    if (typeof parentPath === 'string') {
      path = `${parentPath}/${data.slug}`;
    }
  }

  return { ...data, path };
};
