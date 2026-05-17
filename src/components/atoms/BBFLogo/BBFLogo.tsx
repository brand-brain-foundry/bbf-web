import fs from 'node:fs';
import path from 'node:path';

interface BBFLogoProps {
  size?: number | string;
  className?: string;
}

/**
 * BBFLogo — Brand Brain Foundry logo stamp.
 *
 * Lee el SVG master desde public/logos/BBF-Logo-Stamp.svg al render time
 * (Server Component). Lo inyecta inline para que CSS pueda animar el #circle.
 *
 * @see globals.css — .bbf-logo-stamp #circle { animation: bbf-logo-rotate ... }
 * @since B-BBF-08-H1-3-A (2026-05-15)
 */
export function BBFLogo({ size, className }: BBFLogoProps) {
  const svgPath = path.join(process.cwd(), 'public', 'logos', 'BBF-Logo-Stamp.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  const enrichedSvg = svgContent.replace(
    /<svg\s/i,
    `<svg class="bbf-logo-stamp ${className ?? ''}" aria-label="Brand Brain Foundry" role="img" `,
  );

  const computedSize = size ?? 'var(--bbf-logo-size-hero)';

  return (
    <div
      style={{ width: computedSize, height: computedSize }}
      // SVG injected inline to enable CSS animation access to #circle id
      dangerouslySetInnerHTML={{ __html: enrichedSvg }}
    />
  );
}
