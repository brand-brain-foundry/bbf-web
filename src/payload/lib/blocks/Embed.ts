import type { Block } from 'payload';

export const EmbedBlock: Block = {
  slug: 'embed',
  labels: { singular: 'Embed', plural: 'Embeds' },
  fields: [
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'Spotify', value: 'spotify' },
        { label: 'Twitter / X', value: 'twitter' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'Canonical URL of the content to embed' },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
};
