/**
 * withPropagation — invierte la carga de la prueba del contrato de
 * propagación (F3.4, EXEC 4/4, `HAL-SBWEB-PROPAGATION-CONTRACT-01`).
 *
 * Si el config YA declara `hooks.afterChange` (lógica custom: revalidateMedia/
 * Entity/Page/Topic/VideoPackage/contentItem, o el revalidateGlobal universal
 * de los 10 globals) lo respeta intacto — opt-out explícito, cero doble hook.
 *
 * Si NO lo declara, adjunta un afterChange genérico que invoca el mismo
 * núcleo que ya usan los hooks custom (`invalidateContent` + `globalCacheScope`
 * + `contentCacheTag`) — nunca "no invalidar". El default pasa a ser
 * "propaga"; no propagar requiere escribir un hook a propósito.
 */
import type { CollectionConfig, GlobalConfig } from 'payload';
import { invalidateContent, layoutScope } from './invalidate';
import { contentCacheTag } from './contentCacheTag';
import { globalCacheScope } from '@/payload/hooks/cacheScopeMap';

type PropagationKind = 'collection' | 'global';

type PropagationLogger = {
  info: (message: string) => void;
  warn: (message: string) => void;
};

function genericAfterChange(kind: PropagationKind, slug: string) {
  return async ({ req }: { req: { payload: { logger: PropagationLogger } } }) => {
    const paths = globalCacheScope[slug];
    if (!paths) {
      req.payload.logger.warn(
        `[withPropagation] ${kind} ${slug} sin entrada en cacheScopeMap — invalidando layoutScope() por defecto`,
      );
    }
    invalidateContent(
      { paths: paths ?? layoutScope(), tags: [contentCacheTag(kind, slug)] },
      req.payload.logger,
    );
  };
}

function withCollectionPropagation(config: CollectionConfig): CollectionConfig {
  if (config.hooks?.afterChange?.length) {
    return config;
  }
  return {
    ...config,
    hooks: { ...config.hooks, afterChange: [genericAfterChange('collection', config.slug)] },
  };
}

function withGlobalPropagation(config: GlobalConfig): GlobalConfig {
  if (config.hooks?.afterChange?.length) {
    return config;
  }
  return {
    ...config,
    hooks: { ...config.hooks, afterChange: [genericAfterChange('global', config.slug)] },
  };
}

export function withPropagation(config: CollectionConfig, kind: 'collection'): CollectionConfig;
export function withPropagation(config: GlobalConfig, kind: 'global'): GlobalConfig;
export function withPropagation(
  config: CollectionConfig | GlobalConfig,
  kind: PropagationKind,
): CollectionConfig | GlobalConfig {
  // @ts-justify: dispatch de overload — `kind` es el discriminante en tiempo
  // de ejecución que las dos firmas públicas ya garantizan en tiempo de compilación.
  return kind === 'collection'
    ? withCollectionPropagation(config as CollectionConfig)
    : withGlobalPropagation(config as GlobalConfig);
}
