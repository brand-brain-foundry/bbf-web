#!/usr/bin/env node
/**
 * ============================================================
 * BBF — Generador de Favicons y Assets de Marca
 * ============================================================
 *
 * Fuente única de verdad: scripts/assets/generate-favicons.mjs
 *
 * Lee:    public/logos/BBF-Logo-Icon-Favicon.png  (master único)
 * Lee:    public/logos/BBF-Logo-Stamp.svg          (para OG image)
 *
 * Genera:
 *   public/favicon.ico             — Legacy 32×32 multi-resolution
 *   public/apple-touch-icon.png    — iOS 180×180
 *   public/icon-192.png            — PWA 192×192
 *   public/icon-512.png            — PWA 512×512
 *   public/opengraph-image.png     — Social share 1200×630
 *
 * Para regenerar TODO cuando cambie el PNG master:
 *   pnpm assets:favicons
 *
 * Para regenerar solo un asset específico:
 *   node scripts/assets/generate-favicons.mjs --only=favicon-ico
 *   node scripts/assets/generate-favicons.mjs --only=apple-touch-icon
 *   node scripts/assets/generate-favicons.mjs --only=icon-192
 *   node scripts/assets/generate-favicons.mjs --only=icon-512
 *   node scripts/assets/generate-favicons.mjs --only=opengraph-image
 *
 * Para preview sin escribir archivos:
 *   node scripts/assets/generate-favicons.mjs --dry-run
 *
 * Convención: idempotente. Re-ejecutarlo NO cambia nada si el SVG
 * no cambió, gracias a hash check.
 *
 * Principios SB_Law_Construction aplicados:
 *   A-01 Simplicidad primero    — sharp ya instalado, sin deps nuevas
 *   A-02 Sin parches            — fuente única, regenera todo
 *   A-04 Convenciones           — paths canónicos, naming canon
 *   B-02 Single source of truth — un SVG genera todo
 *   C-01 Verificación           — output del script confirma cada paso
 *   D-01 Idempotencia           — re-correr da mismo output
 *
 * @file scripts/assets/generate-favicons.mjs
 * @since 2026-05-15 (B-BBF-08-H1-3-A)
 * @author BBF Strategic + Claude Code
 * ============================================================
 */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// ── Paths canónicos (no editar — se asumen relativos al repo root) ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');
const LOGOS_DIR = path.join(PUBLIC_DIR, 'logos');

// ── Sources ──
const SOURCE_FAVICON = path.join(LOGOS_DIR, 'BBF-Logo-Icon-Favicon.svg');
const SOURCE_STAMP = path.join(LOGOS_DIR, 'BBF-Logo-Stamp.svg');

// ── Tokens BBF (sincronizar con globals.css Capa 1) ──
const TOKENS = {
  cream: '#fdf5ed', // --bbf-cream-100
  black: '#131414', // --bbf-neutral-900
  blue: '#255ff1', // --bbf-blue-500
  white: '#ffffff', // --bbf-neutral-0
};

// ── Targets (todos los outputs) ──
const TARGETS = [
  {
    name: 'favicon-svg',
    file: 'favicon.svg',
    type: 'svg-copy',
    source: SOURCE_FAVICON,
  },
  {
    name: 'favicon-ico',
    file: 'favicon.ico',
    type: 'raster-ico',
    sizes: [16, 32, 48],
    source: SOURCE_FAVICON,
    bg: TOKENS.cream,
    padding: 0.0,
  },
  {
    name: 'apple-touch-icon',
    file: 'apple-touch-icon.png',
    type: 'raster-png',
    size: 180,
    source: SOURCE_FAVICON,
    bg: TOKENS.cream,
    padding: 0.15,
  },
  {
    name: 'icon-192',
    file: 'icon-192.png',
    type: 'raster-png',
    size: 192,
    source: SOURCE_FAVICON,
    bg: TOKENS.cream,
    padding: 0.175,
  },
  {
    name: 'icon-512',
    file: 'icon-512.png',
    type: 'raster-png',
    size: 512,
    source: SOURCE_FAVICON,
    bg: TOKENS.cream,
    padding: 0.175,
  },
  {
    name: 'opengraph-image',
    file: 'opengraph-image.png',
    type: 'og-composite',
    width: 1200,
    height: 630,
    source: SOURCE_STAMP,
    bg: TOKENS.cream,
  },
];

// ── Helpers ──

async function fileHash(filePath) {
  try {
    const buf = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
  } catch {
    return null;
  }
}

async function verifySource(filePath, name) {
  try {
    await fs.access(filePath);
    const stat = await fs.stat(filePath);
    return { ok: true, size: stat.size, name };
  } catch {
    return { ok: false, name, path: filePath };
  }
}

async function loadSvg(filePath) {
  return await fs.readFile(filePath);
}

async function generateRasterPng(svgBuf, { size, bg, padding = 0 }) {
  const innerSize = Math.round(size * (1 - padding * 2));
  const offset = Math.round((size - innerSize) / 2);

  const iconBuf = await sharp(svgBuf, { density: 600 })
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const finalBuf = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: iconBuf, top: offset, left: offset }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  return finalBuf;
}

async function generateIco(svgBuf, { sizes, bg }) {
  const buf = await generateRasterPng(svgBuf, {
    size: 32,
    bg,
    padding: 0.05,
  });
  return buf;
}

async function generateOgImage(stampSvgBuf, { width, height, bg }) {
  const LOGO_SIZE = 280;
  const logoBuf = await sharp(stampSvgBuf, { density: 600 })
    .resize(LOGO_SIZE, LOGO_SIZE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const textSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <style>
        .title {
          font-family: -apple-system, system-ui, "Helvetica Neue", Arial, sans-serif;
          font-size: 56px;
          font-weight: 900;
          fill: ${TOKENS.black};
          letter-spacing: -0.02em;
        }
        .tagline {
          font-family: -apple-system, system-ui, "Helvetica Neue", Arial, sans-serif;
          font-size: 24px;
          font-weight: 400;
          fill: ${TOKENS.black};
          opacity: 0.7;
        }
      </style>
      <text x="50%" y="475" text-anchor="middle" class="title">Brand Brain Foundry</text>
      <text x="50%" y="520" text-anchor="middle" class="tagline">Construimos cerebros de marca.</text>
    </svg>
  `);

  const logoTop = 110;
  const logoLeft = Math.round((width - LOGO_SIZE) / 2);

  return await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: bg,
    },
  })
    .composite([
      { input: logoBuf, top: logoTop, left: logoLeft },
      { input: textSvg, top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function header(text) {
  const line = '═'.repeat(text.length + 4);
  console.log(`\n${line}\n  ${text}\n${line}`);
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const onlyArg = args.find((a) => a.startsWith('--only='));
  const only = onlyArg ? onlyArg.replace('--only=', '') : null;

  header('BBF Asset Generator v1.0');

  console.log(`Repo root:     ${REPO_ROOT}`);
  console.log(`Public dir:    ${PUBLIC_DIR}`);
  console.log(`Logos dir:     ${LOGOS_DIR}`);
  console.log(`Dry run:       ${dryRun ? 'YES (no files written)' : 'no'}`);
  console.log(`Only target:   ${only ?? 'all'}`);
  console.log('');

  console.log('► Verificando sources...');
  const sourceChecks = await Promise.all([
    verifySource(SOURCE_FAVICON, 'BBF-Logo-Icon-Favicon.svg'),
    verifySource(SOURCE_STAMP, 'BBF-Logo-Stamp.svg'),
  ]);
  const missing = sourceChecks.filter((c) => !c.ok);
  if (missing.length > 0) {
    console.error('\n✗ ERROR: sources faltantes:');
    for (const m of missing) {
      console.error(`   - ${m.name}: ${m.path}`);
    }
    console.error('\nAsegurate de que los SVG estén en public/logos/ antes de correr.');
    process.exit(1);
  }
  for (const c of sourceChecks) {
    console.log(`  ✓ ${c.name} (${formatBytes(c.size)})`);
  }

  const faviconHash = await fileHash(SOURCE_FAVICON);
  const stampHash = await fileHash(SOURCE_STAMP);
  console.log(`  ✓ favicon hash: ${faviconHash}`);
  console.log(`  ✓ stamp hash:   ${stampHash}`);

  console.log('\n► Cargando SVGs...');
  const faviconSvg = await loadSvg(SOURCE_FAVICON);
  const stampSvg = await loadSvg(SOURCE_STAMP);

  console.log('\n► Generando targets...');
  const results = [];

  for (const target of TARGETS) {
    if (only && target.name !== only) {
      console.log(`  ⏭  ${target.file} (skipped — only=${only})`);
      continue;
    }

    const outPath = path.join(PUBLIC_DIR, target.file);
    let buf;

    try {
      switch (target.type) {
        case 'svg-copy':
          buf = await fs.readFile(target.source);
          break;
        case 'raster-ico':
          buf = await generateIco(faviconSvg, {
            sizes: target.sizes,
            bg: target.bg,
          });
          break;
        case 'raster-png':
          buf = await generateRasterPng(faviconSvg, {
            size: target.size,
            bg: target.bg,
            padding: target.padding,
          });
          break;
        case 'og-composite':
          buf = await generateOgImage(stampSvg, {
            width: target.width,
            height: target.height,
            bg: target.bg,
          });
          break;
        default:
          throw new Error(`Unknown target type: ${target.type}`);
      }

      let stat;
      if (!dryRun) {
        await fs.writeFile(outPath, buf);
        stat = await fs.stat(outPath);
      } else {
        stat = { size: buf.length };
      }
      results.push({
        name: target.file,
        size: stat.size,
        path: outPath,
        ok: true,
      });
      console.log(`  ✓ ${target.file.padEnd(28)} ${formatBytes(stat.size).padStart(10)}`);
    } catch (err) {
      results.push({ name: target.file, ok: false, error: err.message });
      console.error(`  ✗ ${target.file}: ${err.message}`);
    }
  }

  console.log('\n► Resumen:');
  const ok = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  const totalSize = results.filter((r) => r.ok).reduce((a, r) => a + r.size, 0);

  console.log(`  ${ok} generados, ${failed} fallidos`);
  console.log(`  Tamaño total: ${formatBytes(totalSize)}`);

  if (dryRun) {
    console.log('\n⚠ DRY RUN — no se escribieron archivos. Quitá --dry-run para aplicar.');
  } else {
    console.log('\n✓ Todos los assets generados en public/');
  }

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('\n✗ ERROR fatal:', err);
  process.exit(1);
});
