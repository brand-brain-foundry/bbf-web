import type { Block } from 'payload';

export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'muted',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};
