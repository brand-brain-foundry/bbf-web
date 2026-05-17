import { type LucideIcon, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps extends LucideProps {
  icon: LucideIcon;
  size?: number | string;
  label?: string;
}

export function Icon({ icon: LucideComp, size = 20, label, className, ...props }: IconProps) {
  return (
    <LucideComp
      size={size}
      aria-label={label}
      aria-hidden={!label}
      className={cn('shrink-0', className)}
      {...props}
    />
  );
}
