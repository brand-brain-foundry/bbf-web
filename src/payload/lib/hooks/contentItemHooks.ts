import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
} from 'payload';
import { invalidateContent, pageScope } from '@/lib/cache/invalidate';
import { contentCacheTag } from '@/lib/cache/contentCacheTag';

/**
 * Rutas estáticas que hoy consumen `fetchCornerstoneBySlug` (verificado por
 * grep en `src/app/(frontend)/[locale]/`): `/cerebro-marca`, `/casos`,
 * `/como-trabajamos`. Refuerzo de path — el mecanismo primario es el tag,
 * idéntico al que consume `fetchContent.ts` por venir ambos de
 * `contentCacheTag`. No se inventan paths para kinds sin consumidor real
 * hoy (pillar-page, cluster-article, case, episode, page, post).
 */
const CORNERSTONE_PATHS = ['/cerebro-marca', '/casos', '/como-trabajamos'].flatMap((subpath) =>
  pageScope(subpath),
);

// Placeholder — implementación completa en B-BBF-12 (Canon v1 §5.4)
export const computeCanonicalUrl: CollectionBeforeChangeHook = async ({ data }) => {
  return data;
};

// Verifica 7 audits antes de publish (Canon v1 §5.3 CI-INV-03)
export const verifyAuditsBeforePublish: CollectionBeforeValidateHook = async ({
  data,
  operation,
}) => {
  if (operation === 'update' && data?._status === 'published') {
    const audits = data?.audits || {};
    const required = [
      'aud01_informationGain',
      'aud02_eeat',
      'aud03_geoChecklist',
      'aud04_voiceBbf',
      'aud05_schema',
      'aud06_antipatterns',
      'aud07_copyEdit',
    ];
    for (const a of required) {
      if (!audits[a]?.passed) {
        throw new Error(`Audit ${a} must pass before publishing`);
      }
    }
  }
  return data;
};

// Invalidación real de cache (F3, primer EXEC del contrato de propagación).
// El tag emitido aquí y el consumido en `fetchContent.ts` vienen AMBOS de
// `contentCacheTag('collection', 'contentItems')` — imposible desalinearse.
export const triggerSurfaceRegeneration: CollectionAfterChangeHook = async ({ doc, req }) => {
  req.payload.logger.info({
    msg: '[ContentItem afterChange] Surface regeneration triggered',
    contentItemId: doc.id,
    kind: doc.kind,
  });

  invalidateContent(
    {
      paths: CORNERSTONE_PATHS,
      tags: [contentCacheTag('collection', 'contentItems')],
    },
    req.payload.logger,
  );

  return doc;
};
