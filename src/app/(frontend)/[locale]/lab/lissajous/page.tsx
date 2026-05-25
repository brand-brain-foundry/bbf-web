/**
 * BBF Lissajous Lab — Wave 11.8-B
 *
 * QA visual page para todas las variantes Lissajous registradas.
 * NO link público — accesible solo via URL directa /lab/lissajous.
 *
 * Note: usa inline style fallbacks para tokens --bbf-surface-ink /
 * --bbf-text-on-ink-* que aún no existen en semantic/colors.css.
 * Pendiente: Wave 11.8-B / 11.8-C agregará alias en semantic/colors.css.
 */

import { Lissajous } from '@/components/atoms/Lissajous';
import { getAllLissajousNames, getLissajousVariant } from '@/lib/motion/lissajous';

export const metadata = {
  title: 'Lissajous Lab — BBF',
  robots: { index: false, follow: false },
};

export default function LissajousLabPage() {
  const names = getAllLissajousNames();

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--bbf-surface-ink, var(--bbf-surface-black))' }}
    >
      <h1
        className="mb-2 text-3xl"
        style={{
          color: 'var(--bbf-text-on-ink, var(--bbf-text-on-black))',
          fontFamily: 'var(--bbf-font-display)',
        }}
      >
        Lissajous Variants Lab
      </h1>
      <p
        className="mb-8 text-sm"
        style={{ color: 'var(--bbf-text-on-ink-muted, var(--bbf-text-on-black-muted))' }}
      >
        {names.length} variantes registradas — D-BBF-WEB-QQ
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {names.map((name) => {
          const variant = getLissajousVariant(name);
          return (
            <div
              key={name}
              className="overflow-hidden rounded-lg"
              style={{ border: '1px solid var(--bbf-border-on-black)' }}
            >
              <div
                className="relative aspect-square"
                style={{ color: 'var(--bbf-motion-lissajous-curva)' }}
              >
                <Lissajous name={name} />
              </div>
              <div className="p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
                <code
                  className="text-xs"
                  style={{ color: 'var(--bbf-text-on-ink, var(--bbf-text-on-black))' }}
                >
                  {name}
                </code>
                <p
                  className="mt-1 text-xs"
                  style={{
                    color: 'var(--bbf-text-on-ink-muted, var(--bbf-text-on-black-muted))',
                  }}
                >
                  {variant.defaultLabel} · {variant.dimension.toUpperCase()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
