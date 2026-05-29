/**
 * Payload select options derivadas del Lissajous registry.
 * Evita drift entre registry y schema Payload — fuente única.
 * Despacho: B-BBF-WEB-DS-REFINEMENT-LISSAJOUS-SCENES
 */
import { getLissajousNamesByDimension, getLissajousVariant } from '@/lib/motion/lissajous';

export const lissajousVariantOptions2D = getLissajousNamesByDimension('2d').map((name) => ({
  value: name,
  label: getLissajousVariant(name).defaultLabel,
}));
