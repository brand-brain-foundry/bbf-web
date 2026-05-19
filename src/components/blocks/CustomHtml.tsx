import { cn } from '@/lib/utils';

type CustomHtmlProps = {
  html: string;
  label?: string | null;
  className?: string;
};

// Designated escape hatch — html must be sanitized server-side before this component receives it.
// Wire up sanitize-html or DOMPurify (JSDOM) in the data-fetching layer before passing `html` here.
export function CustomHtmlBlock({ html, label, className }: CustomHtmlProps) {
  return (
    <div
      data-component="bbf-custom-html"
      data-label={label ?? undefined}
      className={cn('my-6', className)}
       
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
