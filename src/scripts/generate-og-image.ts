/**
 * Generate static OG image — public/og-image.png (1200×630)
 * Sprint 1 G-01: SEO-AEO-home-SB §1.1 canonical OG image
 *
 * Design: dark bg #0a0a0a + blue BBF gradient accent + SIVAR BRAINS wordmark + tagline
 * ⚠️ PLACEHOLDER: marca base funcional. Zavala debe refinar con activos de marca finales.
 *
 * Usage:
 *   pnpm tsx src/scripts/generate-og-image.ts
 *   (o: set -a; source .env.local; set +a; pnpm tsx src/scripts/generate-og-image.ts)
 */

import { Resvg } from '@resvg/resvg-js';
import * as fs from 'fs';
import * as path from 'path';

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Blue radial glow — BBF accent (#255FF1) -->
    <radialGradient id="blue-glow" cx="15%" cy="25%" r="60%" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#255FF1" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#255FF1" stop-opacity="0"/>
    </radialGradient>
    <!-- Subtle grid pattern -->
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" stroke-width="0.4" opacity="0.04"/>
    </pattern>
    <!-- Top-edge gradient for depth -->
    <linearGradient id="top-fade" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1a1a2e" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Base background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0a0a0a"/>

  <!-- Grid overlay -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <!-- Blue glow -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#blue-glow)"/>

  <!-- Top depth fade -->
  <rect width="${WIDTH}" height="300" fill="url(#top-fade)"/>

  <!-- Blue accent line — horizontal (design element) -->
  <rect x="80" y="398" width="100" height="3" fill="#255FF1" rx="1.5"/>

  <!-- Brand wordmark — SIVAR BRAINS -->
  <text
    x="80"
    y="260"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    font-size="80"
    font-weight="600"
    letter-spacing="-2"
    fill="#ffffff"
  >SIVAR BRAINS</text>

  <!-- Tagline ES -->
  <text
    x="80"
    y="360"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    font-size="30"
    font-weight="400"
    letter-spacing="0.3"
    fill="#ebe3d4"
    opacity="0.75"
  >Tú diriges. Tu marca ejecuta.</text>

  <!-- Domain / URL -->
  <text
    x="80"
    y="545"
    font-family="'SF Mono', 'Fira Code', 'Cascadia Code', monospace"
    font-size="18"
    letter-spacing="2"
    fill="#255FF1"
    opacity="0.9"
  >sivarbrains.com</text>

  <!-- Right side — decorative dot matrix (3×4) -->
  ${Array.from({ length: 4 }, (_, row) =>
    Array.from(
      { length: 3 },
      (_, col) =>
        `<circle cx="${1060 + col * 28}" cy="${200 + row * 28}" r="3" fill="#255FF1" opacity="${0.15 + (row + col) * 0.05}"/>`,
    ).join('\n  '),
  ).join('\n  ')}
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: WIDTH },
  font: { loadSystemFonts: true },
});

const rendered = resvg.render();
const pngBuffer = rendered.asPng();

const outPath = path.join(process.cwd(), 'public', 'og-image.png');
fs.writeFileSync(outPath, pngBuffer);

console.log(`[generate-og-image] ✅ Escrito: ${outPath}`);
console.log(`[generate-og-image] Tamaño: ${pngBuffer.length} bytes`);
console.log(
  '[generate-og-image] ⚠️  PLACEHOLDER — Zavala debe refinar con activos de marca finales.',
);
