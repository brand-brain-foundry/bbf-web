/**
 * Generate static hero poster — public/hero-poster.png
 * Sprint 1 G-02: LCP strategy — poster del hero video reduce LCP <2.0s.
 *
 * Resolución: 1920×1080 (16:9, matching video aspect ratio).
 * Design: mismo look dark + blue glow que el hero section.
 * ⚠️ PLACEHOLDER: Zavala debe reemplazar con un still real del video hero.
 *
 * Usage:
 *   pnpm tsx src/scripts/generate-hero-poster.ts
 */

import { Resvg } from '@resvg/resvg-js';
import * as fs from 'fs';
import * as path from 'path';

const WIDTH = 1920;
const HEIGHT = 1080;

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="blue-glow" cx="30%" cy="40%" r="55%" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#255FF1" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#255FF1" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.04"/>
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0a0a0a"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#blue-glow)"/>
  <!-- Center mark for video alignment -->
  <text
    x="${WIDTH / 2}"
    y="${HEIGHT / 2 - 20}"
    text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    font-size="48"
    font-weight="600"
    fill="#ffffff"
    opacity="0.15"
  >SIVAR BRAINS</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: WIDTH },
  font: { loadSystemFonts: true },
});

const rendered = resvg.render();
const pngBuffer = rendered.asPng();

const outPath = path.join(process.cwd(), 'public', 'hero-poster.png');
fs.writeFileSync(outPath, pngBuffer);

console.log(`[generate-hero-poster] ✅ Escrito: ${outPath}`);
console.log(`[generate-hero-poster] Tamaño: ${pngBuffer.length} bytes`);
console.log('[generate-hero-poster] ⚠️  PLACEHOLDER — reemplazar con still real del video hero.');
