import type { Block } from 'payload';

export const TextVisualPageBlock: Block = {
  slug: 'page-text-visual',
  interfaceName: 'TextVisualPageBlock',
  labels: { singular: 'Text + Visual', plural: 'Text + Visual' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'text-left',
      options: [
        { label: 'Text left, visual right', value: 'text-left' },
        { label: 'Text right, visual left', value: 'text-right' },
        { label: 'Text top, visual bottom', value: 'text-top' },
      ],
    },
    {
      name: 'surface',
      type: 'select',
      required: true,
      defaultValue: 'sand',
      options: [
        { label: 'Sand', value: 'sand' },
        { label: 'Dark', value: 'dark' },
        { label: 'Subtle', value: 'subtle' },
      ],
    },
    {
      name: 'iconType',
      type: 'select',
      options: [
        { label: 'Lucide icon (nombre)', value: 'lucide' },
        { label: 'Upload (SVG / imagen)', value: 'upload' },
      ],
    },
    {
      name: 'iconLucide',
      type: 'text',
      admin: {
        description: 'Nombre del icon Lucide (ej: Brain, Zap, Lightbulb)',
        condition: (data) => data?.iconType === 'lucide',
      },
    },
    {
      name: 'iconUpload',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data) => data?.iconType === 'upload' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 100,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      maxLength: 160,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'visualAsset',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'visualAspectRatio',
      type: 'select',
      defaultValue: 'auto',
      dbName: 'pg_txt_vis_aspect_ratio',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: '16:9', value: '16:9' },
        { label: '4:3', value: '4:3' },
        { label: '1:1', value: '1:1' },
      ],
    },
  ],
};
