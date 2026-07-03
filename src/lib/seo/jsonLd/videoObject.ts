import type { VideoObject, WithContext } from 'schema-dts';

interface BuildVideoObjectOptions {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
  duration?: number | null;
  inLanguage: 'es-SV' | 'en-US';
  publisherId: string;
}

// D-BBF-MEDIA-PACKAGE — 1 VideoObject por paquete (contentUrl único,
// la fuente "primary"), NUNCA uno por formato (diagnóstico §6). publisher
// conecta por @id a la Organization ya emitida en el layout (C-01, no
// duplica name/url/logo).
export function buildVideoObjectJsonLd(opts: BuildVideoObjectOptions): WithContext<VideoObject> {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': opts.id,
    name: opts.name,
    description: opts.description,
    thumbnailUrl: opts.thumbnailUrl,
    contentUrl: opts.contentUrl,
    uploadDate: opts.uploadDate,
    ...(opts.duration ? { duration: `PT${Math.round(opts.duration)}S` } : {}),
    inLanguage: opts.inLanguage,
    publisher: { '@id': opts.publisherId },
  };
}
