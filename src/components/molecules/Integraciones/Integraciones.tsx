/**
 * Integraciones — Server Component shell (D-99).
 * Sanitiza datos Payload y pasa props tipadas al Client leaf.
 * kind='integraciones' en CapabilityScene.
 */

import { BrandLogo } from '@/components/atoms/BrandLogo';
import type { SceneIntegracionesData } from '../CapabilityScene/types';
import { IntegracionesPlayer } from './IntegracionesPlayer';

interface IntegracionesProps {
  data: SceneIntegracionesData;
}

export async function Integraciones({ data }: IntegracionesProps) {
  const logoNode = <BrandLogo variant="icon" size={28} />;
  const summaryTitle = data.summaryTitle ?? '';

  const items = (data.items ?? []).map((item) => ({
    id: item.id ?? undefined,
    iconUrl: typeof item.icon === 'object' && item.icon !== null ? (item.icon.url ?? '') : '',
    iconAlt: typeof item.icon === 'object' && item.icon !== null ? (item.icon.alt ?? '') : '',
    name: item.name ?? '',
    category: item.category ?? '',
  }));

  return <IntegracionesPlayer logoNode={logoNode} summaryTitle={summaryTitle} items={items} />;
}
