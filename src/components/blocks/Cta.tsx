import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';

type CtaProps = {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'ghost';
  external?: boolean | null;
  className?: string;
};

const intentMap: Record<CtaProps['variant'], 'primary' | 'secondary' | 'ghost'> = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
};

export function CtaBlock({ text, href, variant, external, className }: CtaProps) {
  return (
    <div data-component="bbf-cta" className={cn('my-6', className)}>
      <Button asChild intent={intentMap[variant]}>
        <Link href={href} external={external ?? false}>
          {text}
        </Link>
      </Button>
    </div>
  );
}
