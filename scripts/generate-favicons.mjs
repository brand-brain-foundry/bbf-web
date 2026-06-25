#!/usr/bin/env node
/**
 * generate-favicons.mjs — BBF favicon set generator
 *
 * Input:  public/assets/brand/logos/BBF-Logo-Icon.svg  (currentColor, no fill)
 * Output: public/favicon-16x16.png, favicon-32x32.png, icon-192.png, icon-512.png,
 *         apple-touch-icon.png (180×180 solid bg), maskable-icon-512x512.png, favicon.ico
 *
 * Uso: node scripts/generate-favicons.mjs
 */

import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

const BRAND_BLUE = '#255ff1'; // --bbf-accent-blue sólido sRGB
const DARK = '#0a0a0a'; // --bbf-surface-dark-base (manifest background_color)

// Read canonical icon SVG
const iconSvgRaw = readFileSync(join(ROOT, 'public/assets/brand/logos/BBF-Logo-Icon.svg'), 'utf-8');

// Inject fill — BBF-Logo-Icon.svg has no explicit fill (uses currentColor)
const iconSvgBlue = iconSvgRaw.replace('<path ', `<path fill="${BRAND_BLUE}" `);

// Rasterize SVG to PNG buffer
function rasterize(svgStr, size, background) {
  const opts = { fitTo: { mode: 'width', value: size } };
  if (background) opts.background = background;
  return Buffer.from(new Resvg(svgStr, opts).render().asPng());
}

// Build maskable SVG: icon centered in 66% safe zone, solid dark background
function buildMaskableSvg() {
  const CANVAS = 512;
  const ICON_W = Math.round(CANVAS * 0.66); // 338px — 66% safe zone
  const ICON_H = Math.round(ICON_W * (100 / 102)); // 331px — preserve 102:100 aspect
  const X = Math.round((CANVAS - ICON_W) / 2); // 87px
  const Y = Math.round((CANVAS - ICON_H) / 2); // 90px
  const pathMatch = iconSvgRaw.match(/d="([^"]+)"/);
  if (!pathMatch) throw new Error('Cannot extract path d from BBF-Logo-Icon.svg');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <rect width="${CANVAS}" height="${CANVAS}" fill="${DARK}"/>
  <svg x="${X}" y="${Y}" width="${ICON_W}" height="${ICON_H}" viewBox="0 0 102 100">
    <path fill="${BRAND_BLUE}" d="${pathMatch[1]}"/>
  </svg>
</svg>`;
}

// Build favicon.ico with multiple PNG sizes embedded (modern PNG-in-ICO)
function buildIco(pngBuffers) {
  const N = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(N, 4); // count

  let offset = 6 + N * 16;
  const entries = pngBuffers.map((png) => {
    const w = png.readUInt32BE(16); // PNG IHDR width at byte 16
    const h = png.readUInt32BE(20); // PNG IHDR height at byte 20
    const entry = Buffer.alloc(16);
    entry.writeUInt8(w >= 256 ? 0 : w, 0);
    entry.writeUInt8(h >= 256 ? 0 : h, 1);
    entry.writeUInt8(0, 2); // colorCount (0 = truecolor)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bitCount
    entry.writeUInt32LE(png.length, 8); // imageSize
    entry.writeUInt32LE(offset, 12); // imageOffset
    offset += png.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

// ── Generate ──────────────────────────────────────────────────────────────

console.log('Generating BBF favicon set...\n');

const png16 = rasterize(iconSvgBlue, 16);
const png32 = rasterize(iconSvgBlue, 32);
const png48 = rasterize(iconSvgBlue, 48);
const png192 = rasterize(iconSvgBlue, 192);
const png512 = rasterize(iconSvgBlue, 512);
const png180 = rasterize(iconSvgBlue, 180, DARK); // apple-touch: solid dark bg
const pngMaskable = rasterize(buildMaskableSvg(), 512); // maskable: safe-zone 66%
const icoBuffer = buildIco([png16, png32, png48]); // ico: 16/32/48 embedded

const files = [
  ['favicon-16x16.png', png16],
  ['favicon-32x32.png', png32],
  ['icon-192.png', png192],
  ['icon-512.png', png512],
  ['apple-touch-icon.png', png180],
  ['maskable-icon-512x512.png', pngMaskable],
  ['favicon.ico', icoBuffer],
];

for (const [name, buf] of files) {
  writeFileSync(join(PUBLIC, name), buf);
  console.log(`  ✓  public/${name}  —  ${buf.length}B`);
}

console.log('\nDone. Hard-refresh browser to clear favicon cache.');
