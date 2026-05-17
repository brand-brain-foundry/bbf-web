# BBF Public Assets

Estructura canónica de assets del proyecto Brand Brain Foundry.

**Subordinado a:** D-BBF-WEB-84 (estructura public/assets/ canon BBF)

## Estructura

```
public/assets/
├── brand/              Brand foundation (identidad permanente)
│   ├── logos/          Sistema de logos (4 variantes + legacy)
│   ├── icons/          Iconos custom NO Lucide (M6+)
│   ├── patterns/       Motifs decorativos (M6+)
│   └── guidelines/     PDFs brand guidelines (M6+)
│
├── media/              Contenido multimedia (variable)
│   ├── hero/           Video/imagen hero
│   ├── images/         Fotografía y raster
│   │   ├── team/       Team photos (M6+)
│   │   ├── cases/      Case studies images (M6+)
│   │   └── og/         Open Graph images por locale
│   ├── videos/         Videos adicionales (M6+)
│   └── audio/          Audio podcast/narration (M6+)
│
├── illustrations/      SVG decoratives custom (M6+)
├── fonts/              Self-hosted fonts (reservado M6+)
└── documents/          PDFs downloadables (M6+)
```

## Reglas canon BBF

1. **Brand foundation vs media variable:** separación semántica clara
2. **Sin colors hardcoded en nombres** de assets (D-BBF-WEB-77)
3. **READMEs en cada subdirectorio principal** (AI-readable D-82)
4. **Archivos especiales** (favicon, apple-touch-icon, robots.txt) viven en `public/` raíz

## Archivos especiales en raíz public/

Estos archivos DEBEN estar en `public/` raíz por estándares web/browser:
- `favicon.ico`, `favicon.svg`
- `apple-touch-icon.png`
- `robots.txt`
- `sitemap.xml` (cuando exista)
- `llms.txt` (canon AEO)
- `opengraph-image.png` (si Next.js metadata convention)
