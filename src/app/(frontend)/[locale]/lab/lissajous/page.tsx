/**
 * BBF Lissajous Lab — Wave 11.8-B / C1
 *
 * QA visual page para todas las variantes Lissajous registradas.
 * NO link público — accesible solo via URL directa /lab/lissajous.
 * noindex + robots.txt disallow (triple protección).
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
    <div className="min-h-screen [background-color:var(--bbf-surface-ink)] p-8">
      <h1 className="mb-2 [font-family:var(--bbf-font-display)] text-3xl [color:var(--bbf-text-on-ink)]">
        Lissajous Variants Lab
      </h1>
      <p className="mb-8 text-sm [color:var(--bbf-text-on-ink-muted)]">
        {names.length} variantes registradas — D-BBF-WEB-QQ
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {names.map((name) => {
          const variant = getLissajousVariant(name);
          return (
            <div
              key={name}
              className="overflow-hidden rounded-lg [border:1px_solid_var(--bbf-border-on-ink)]"
            >
              <div className="relative aspect-square [color:var(--bbf-motion-lissajous-curva)]">
                <Lissajous name={name} />
              </div>
              <div className="[background-color:var(--bbf-surface-ink-elevated)] p-4">
                <code className="text-xs [color:var(--bbf-text-on-ink)]">{name}</code>
                <p className="mt-1 text-xs [color:var(--bbf-text-on-ink-muted)]">
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
