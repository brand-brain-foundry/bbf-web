/**
 * AppScreen — Server Component shell para app-screen CapabilityScene kind.
 * Logo solo-icono del SSOT (D-PANTALLA-03-REV). D-99 pattern.
 */

import { getTranslations } from 'next-intl/server';
import { BrandLogo } from '@/components/atoms/BrandLogo';
import type { SceneAppScreenData } from '../CapabilityScene/types';
import { AppScreenPlayer } from './AppScreenPlayer';
import type { AppScreenUI } from './AppScreenPlayer';

interface AppScreenProps {
  data: SceneAppScreenData;
}

export async function AppScreen({ data }: AppScreenProps) {
  const chips = (data.chips ?? []).map((c) => c.label ?? '');
  const metaRows = (data.metaRows ?? []).map((r) => ({
    key: r.key ?? '',
    value: r.value ?? '',
  }));

  const rawImageUrl =
    typeof data.rawImage === 'object' && data.rawImage !== null ? (data.rawImage.url ?? '') : '';
  const rawImageAlt =
    typeof data.rawImage === 'object' && data.rawImage !== null ? (data.rawImage.alt ?? '') : '';
  const renderImageUrl =
    typeof data.renderImage === 'object' && data.renderImage !== null
      ? (data.renderImage.url ?? '')
      : '';
  const renderImageAlt =
    typeof data.renderImage === 'object' && data.renderImage !== null
      ? (data.renderImage.alt ?? '')
      : '';

  // D-PANTALLA-03: logo solo-icono del SSOT — pasado como ReactNode al Client leaf
  const logoNode = <BrandLogo variant="icon" size={28} />;

  const t = await getTranslations('capabilities.scenes.appScreen');
  const ui: AppScreenUI = {
    backAriaLabel: t('backAriaLabel'),
    titleBrief: t('titleBrief'),
    titleDetail: t('titleDetail'),
    titleRender: t('titleRender'),
    briefHint: t('briefHint'),
    briefLabel: t('briefLabel'),
    generating: t('generating'),
    generateCta: t('generateCta'),
    assetBadge: t('assetBadge'),
    designing: t('designing'),
    designCta: t('designCta'),
    captionLabel: t('captionLabel'),
    hashtagsLabel: t('hashtagsLabel'),
    renderStatus: t('renderStatus'),
    publishing: t('publishing'),
    publishCta: t('publishCta'),
    publishedTitle: t('publishedTitle'),
    publishedBody: t('publishedBody'),
  };

  return (
    <AppScreenPlayer
      logoNode={logoNode}
      briefText={data.briefText ?? ''}
      chips={chips}
      metaRows={metaRows}
      rawImageUrl={rawImageUrl}
      rawImageAlt={rawImageAlt}
      renderImageUrl={renderImageUrl}
      renderImageAlt={renderImageAlt}
      caption={data.caption ?? ''}
      hashtags={data.hashtags ?? ''}
      publishMeta={data.publishMeta ?? ''}
      ui={ui}
    />
  );
}
