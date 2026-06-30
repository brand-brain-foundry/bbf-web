/**
 * Aprendizaje — D-APR-01 doble chrome: app-screen (Insights) + WA (RecChat).
 * Server Component shell: sanitiza Payload → AprendizajePlayer (D-99).
 * Reutiliza .bbf-app-screen-* + .bbf-wa-* sin duplicar ninguno.
 */
import { getTranslations } from 'next-intl/server';
import type { SceneAprendizajeData } from '../CapabilityScene/types';
import type { Media } from '@/payload/payload-types';
import { AprendizajePlayer } from './AprendizajePlayer';
import type { AprendizajeUI } from './AprendizajePlayer';

interface AprendizajeProps {
  data: SceneAprendizajeData;
}

export async function Aprendizaje({ data }: AprendizajeProps) {
  const postImageUrl =
    typeof data.postImage === 'object' && data.postImage !== null
      ? ((data.postImage as Media).url ?? null)
      : null;
  const postImageAlt =
    typeof data.postImage === 'object' && data.postImage !== null
      ? ((data.postImage as Media).alt ?? '')
      : '';

  const recPoints = (data.recPoints ?? []).map((p) => ({
    id: p.id,
    key: p.key ?? '',
    value: p.value ?? '',
    data: p.data ?? '',
  }));

  const t = await getTranslations('capabilities.scenes.aprendizaje');
  const ui: AprendizajeUI = {
    liveBadge: t('liveBadge'),
    engLabel: t('engLabel'),
    engDelta: t('engDelta'),
    bannerStrong: t('bannerStrong'),
    bannerSub: t('bannerSub'),
    metricsAriaLabel: t('metricsAriaLabel'),
    metricKeyTag: t('metricKeyTag'),
    metricDeltaSub: t('metricDeltaSub'),
    chartTitle: t('chartTitle'),
    chartTag: t('chartTag'),
    audienceTitle: t('audienceTitle'),
    audienceSub: t('audienceSub'),
    audienceAriaLabel: t('audienceAriaLabel'),
    learnTitle: t('learnTitle'),
    learnAriaLabel: t('learnAriaLabel'),
    signalsSuffix: t('signalsSuffix'),
    tabsAriaLabel: t('tabsAriaLabel'),
    tabContent: t('tabContent'),
    tabAnalytics: t('tabAnalytics'),
    tabAudiencia: t('tabAudiencia'),
    tabHerram: t('tabHerram'),
    metricLabels: [
      t('metricAlcance'),
      t('metricImpresiones'),
      t('metricMeGusta'),
      t('metricComentarios'),
      t('metricCompartidos'),
      t('metricGuardados'),
    ],
    audienceLabels: [t('audienceCdmx'), t('audienceGdl'), t('audienceMty')],
    backAriaLabel: t('backAriaLabel'),
    statusTyping: t('statusTyping'),
    statusOnline: t('statusOnline'),
    daystamp: t('daystamp'),
    inputPlaceholder: t('inputPlaceholder'),
    sendAriaLabel: t('sendAriaLabel'),
    recCardTitle: t('recCardTitle'),
    recCardConf: t('recCardConf'),
    quickYes: t('quickYes'),
    quickAdjust: t('quickAdjust'),
    briefQuestion: t('briefQuestion'),
    brainAsk: t('brainAsk'),
    b1Text: t('b1Text'),
    b2Text: t('b2Text'),
    userReply: t('userReply'),
    b3Text: t('b3Text'),
    step1Label: t('step1Label'),
    step2Label: t('step2Label'),
    stepsAriaLabel: t('stepsAriaLabel'),
  };

  return (
    <AprendizajePlayer
      insightsTitle={data.insightsTitle ?? 'Análisis del post'}
      postImageUrl={postImageUrl}
      postImageAlt={postImageAlt}
      postCaption={data.postCaption ?? ''}
      platformLabel={data.platformLabel ?? 'Instagram · Historia'}
      timeLabel={data.timeLabel ?? 'Publicado hace 3 días'}
      recPoints={recPoints}
      projection={data.projection ?? ''}
      ui={ui}
    />
  );
}
