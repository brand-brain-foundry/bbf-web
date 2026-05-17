import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('font-display', {
  variants: {
    level: {
      h1: 'text-[var(--bbf-text-h1)] tracking-[var(--bbf-tracking-display)] leading-[var(--bbf-leading-tight)]',
      h2: 'text-[var(--bbf-text-h2)] tracking-[var(--bbf-tracking-display)] leading-[var(--bbf-leading-tight)]',
      h3: 'text-[var(--bbf-text-h3)] leading-[var(--bbf-leading-snug)]',
      h4: 'text-[var(--bbf-text-h4)] leading-[var(--bbf-leading-snug)]',
      h5: 'text-[var(--bbf-text-h5)] leading-[var(--bbf-leading-normal)]',
      h6: 'text-[var(--bbf-text-h6)] leading-[var(--bbf-leading-normal)]',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    color: {
      default: 'text-[var(--bbf-text-on-light)]',
      muted: 'text-[var(--bbf-text-on-light-secondary)]',
      onDark: 'text-[var(--bbf-text-on-dark)]',
      accent: 'text-[var(--bbf-accent-red)]',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    level: 'h2',
    weight: 'bold',
    color: 'default',
    align: 'left',
  },
});

const levelToTag: Record<NonNullable<VariantProps<typeof headingVariants>['level']>, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

interface HeadingProps
  extends
    Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

export function Heading({
  level = 'h2',
  weight,
  color,
  align,
  asChild,
  className,
  ...props
}: HeadingProps) {
  const Comp = asChild ? Slot : levelToTag[level ?? 'h2'];
  return (
    <Comp className={cn(headingVariants({ level, weight, color, align }), className)} {...props} />
  );
}
