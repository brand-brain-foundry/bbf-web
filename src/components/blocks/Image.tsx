import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';

type MediaRef = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
};

type ImageBlockProps = {
  image: MediaRef | string;
  alt: string;
  caption?: string | null;
  lazyLoad?: boolean | null;
  className?: string;
};

export function ImageBlock({ image, alt, caption, lazyLoad = true, className }: ImageBlockProps) {
  const src = typeof image === 'string' ? image : image.url;
  const width = typeof image === 'object' ? (image.width ?? 1200) : 1200;
  const height = typeof image === 'object' ? (image.height ?? 675) : 675;

  if (!src) return null;

  return (
    <figure data-component="bbf-image" className={cn('my-6', className)}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={lazyLoad ? 'lazy' : 'eager'}
        className="w-full rounded-md object-cover"
      />
      {caption && (
        <figcaption className="mt-2 text-center">
          <Text variant="body-sm" className="text-[var(--bbf-text-on-light-secondary)] italic">
            {caption}
          </Text>
        </figcaption>
      )}
    </figure>
  );
}
