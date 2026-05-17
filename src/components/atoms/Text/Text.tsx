import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('font-body', {
  variants: {
    variant: {
      body: 'text-[var(--bbf-text-base)] leading-[var(--bbf-leading-relaxed)]',
      caption: 'text-[var(--bbf-text-sm)] leading-[var(--bbf-leading-normal)]',
      overline: [
        'text-[var(--bbf-text-xs)] leading-[var(--bbf-leading-normal)]',
        'uppercase tracking-[var(--bbf-tracking-eyebrow)] font-semibold',
      ],
      label: 'text-[var(--bbf-text-sm)] leading-[var(--bbf-leading-tight)] font-medium',
    },
    color: {
      default: 'text-[var(--bbf-text-on-light)]',
      muted: 'text-[var(--bbf-text-on-light-muted)]',
      onDark: 'text-[var(--bbf-text-on-dark)]',
      onDarkMuted: 'text-[var(--bbf-text-on-dark-secondary)]',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'default',
  },
});

const variantToTag: Record<NonNullable<VariantProps<typeof textVariants>['variant']>, string> = {
  body: 'p',
  caption: 'span',
  overline: 'span',
  label: 'label',
};

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>, VariantProps<typeof textVariants> {
  asChild?: boolean;
}

export function Text({ variant = 'body', color, asChild, className, ...props }: TextProps) {
  const Comp = asChild ? Slot : variantToTag[variant ?? 'body'];
  return <Comp className={cn(textVariants({ variant, color }), className)} {...props} />;
}
