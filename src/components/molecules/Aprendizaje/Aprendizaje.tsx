/**
 * Aprendizaje — D-APR-01 doble chrome: app-screen (Insights) + WA (RecChat).
 * Server Component shell: sanitiza Payload → AprendizajePlayer (D-99).
 * Reutiliza .bbf-app-screen-* + .bbf-wa-* sin duplicar ninguno.
 */
import type { SceneAprendizajeData } from '../CapabilityScene/types';
import type { Media } from '@/payload/payload-types';
import { AprendizajePlayer } from './AprendizajePlayer';

interface AprendizajeProps {
  data: SceneAprendizajeData;
}

export function Aprendizaje({ data }: AprendizajeProps) {
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
    />
  );
}
