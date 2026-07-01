/**
 * Integraciones — Server Component shell (D-99).
 * Sanitiza datos Payload y pasa props tipadas al Client leaf.
 * kind='integraciones' en CapabilityScene.
 */

import { getLocale, getTranslations } from 'next-intl/server';
import { BrandLogo } from '@/components/atoms/BrandLogo';
import { getSiteIdentity } from '@/config/site';
import type { SceneIntegracionesData } from '../CapabilityScene/types';
import { IntegracionesPlayer } from './IntegracionesPlayer';
import type { IntegracionesUI } from './IntegracionesPlayer';

interface IntegracionesProps {
  data: SceneIntegracionesData;
}

export async function Integraciones({ data }: IntegracionesProps) {
  const t = await getTranslations('capabilities.scenes.integraciones');
  const locale = (await getLocale()) === 'en' ? 'en' : 'es';
  const identity = await getSiteIdentity(locale);
  const logoNode = (
    <BrandLogo variant="icon" size={28} ariaLabel={identity.siteName ?? 'Sivar Brains'} />
  );
  const summaryTitle = data.summaryTitle ?? '';

  const items = (data.items ?? []).map((item) => ({
    id: item.id ?? undefined,
    iconUrl: typeof item.icon === 'object' && item.icon !== null ? (item.icon.url ?? '') : '',
    iconAlt: typeof item.icon === 'object' && item.icon !== null ? (item.icon.alt ?? '') : '',
    name: item.name ?? '',
    category: item.category ?? '',
  }));

  const ui: IntegracionesUI = {
    appTitle: t('appTitle'),
    backAriaLabel: t('backAriaLabel'),
    allDoneTitle: t('allDoneTitle'),
    sourcesOf: t('sourcesOf'),
    sourcesActive: t('sourcesActive'),
    statusConnectedPrefix: t('statusConnectedPrefix'),
    statusConnecting: t('statusConnecting'),
  };

  return (
    <IntegracionesPlayer logoNode={logoNode} summaryTitle={summaryTitle} items={items} ui={ui} />
  );
}
