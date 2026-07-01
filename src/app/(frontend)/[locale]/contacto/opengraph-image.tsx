import { ImageResponse } from 'next/og';
import { SITE_NAME_FALLBACK, SITE_NAME_UPPER } from '@/lib/brand';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// Bilingual fallback — opengraph-image.tsx static export can't resolve locale at this level
export const alt = `Contacto / Contact — ${SITE_NAME_FALLBACK}`;

type Props = { params: Promise<{ locale: string }> };

export default async function OGImage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === 'en';

  // Locale-aware copy — matches SEO-AEO-contacto-SB §3 + §4
  // Template literals prevent smart-quote injection by the formatter
  const heading = isEn ? /* en */ `Let’s think\nthis through.` : /* es */ `Sentémonos\na pensar.`;
  const tagline = isEn
    ? /* en */ `No urgency. There’s method.`
    : /* es */ `Sin urgencia. Hay método.`;
  const label = isEn ? `CONTACT` : `CONTACTO`;

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#0a0a0a',
        padding: '64px 80px',
      }}
    >
      {/* Top row — brand + page label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 3,
          }}
        >
          {SITE_NAME_UPPER}
        </span>
        <span
          style={{
            color: '#0057ff',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 4,
          }}
        >
          {label}
        </span>
      </div>

      {/* Main headline + tagline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            color: '#ffffff',
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            whiteSpace: 'pre-line',
          }}
        >
          {heading}
        </div>
        <div
          style={{
            color: '#6b6b6b',
            fontSize: 26,
            fontWeight: 400,
            letterSpacing: 0,
          }}
        >
          {tagline}
        </div>
      </div>

      {/* Bottom row — blue accent + domain */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div
          style={{
            width: 72,
            height: 3,
            backgroundColor: '#0057ff',
            borderRadius: 2,
          }}
        />
        <span style={{ color: '#3a3a3a', fontSize: 18, letterSpacing: 1 }}>sivarbrains.com</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
