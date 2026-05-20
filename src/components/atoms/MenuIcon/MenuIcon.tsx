'use client';

import { cn } from '@/lib/utils';

type MenuIconProps = {
  open: boolean;
  className?: string;
};

/**
 * BBF MenuIcon atom — hamburger canon (D-BBF-KB-107)
 * 3 líneas horizontales que se transforman en X cuando open=true
 * Animación: 280ms cubic-bezier(0.32, 0.72, 0, 1)
 */
export function MenuIcon({ open, className }: MenuIconProps) {
  return (
    <svg
      data-component="bbf-menu-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {/* Top line → rotates to 45deg when open */}
      <line
        x1="3"
        y1={open ? '12' : '6'}
        x2="21"
        y2={open ? '12' : '6'}
        style={{
          transform: open ? 'rotate(45deg)' : 'none',
          transformOrigin: '12px 12px',
          transition:
            'transform 280ms cubic-bezier(0.32, 0.72, 0, 1), y1 280ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />
      {/* Middle line → fades out when open */}
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        style={{
          opacity: open ? 0 : 1,
          transition: 'opacity 200ms ease-out',
        }}
      />
      {/* Bottom line → rotates to -45deg when open */}
      <line
        x1="3"
        y1={open ? '12' : '18'}
        x2="21"
        y2={open ? '12' : '18'}
        style={{
          transform: open ? 'rotate(-45deg)' : 'none',
          transformOrigin: '12px 12px',
          transition:
            'transform 280ms cubic-bezier(0.32, 0.72, 0, 1), y1 280ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />
    </svg>
  );
}
