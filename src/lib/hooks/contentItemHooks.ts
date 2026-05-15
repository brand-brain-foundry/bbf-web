import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
} from 'payload';

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

// Placeholder — generators implementados en B-BBF-13-SURFACES (Canon v1 §11.3)
export const triggerSurfaceRegeneration: CollectionAfterChangeHook = async ({ doc, req }) => {
  req.payload.logger.info({
    msg: '[ContentItem afterChange] Surface regeneration triggered',
    contentItemId: doc.id,
    kind: doc.kind,
  });
  return doc;
};
