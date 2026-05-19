import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';

type GalleryImage = {
  image: { url?: string | null; width?: number | null; height?: number | null } | string;
  alt: string;
  caption?: string | null;
};

type GalleryProps = {
  images: GalleryImage[];
  layout?: 'grid' | 'carousel' | null;
  className?: string;
};

export function GalleryBlock({ images, layout = 'grid', className }: GalleryProps) {
  return (
    <div
      data-component="bbf-gallery"
      data-layout={layout ?? 'grid'}
      className={cn(
        'my-6',
        layout === 'grid' ? 'grid grid-cols-2 gap-3 md:grid-cols-3' : 'flex gap-3 overflow-x-auto',
        className,
      )}
    >
      {images.map((item, i) => {
        const src = typeof item.image === 'string' ? item.image : item.image.url;
        const width = typeof item.image === 'object' ? (item.image.width ?? 800) : 800;
        const height = typeof item.image === 'object' ? (item.image.height ?? 600) : 600;
        if (!src) return null;
        return (
          <figure key={i} className="overflow-hidden rounded-md">
            <NextImage
              src={src}
              alt={item.alt}
              width={width}
              height={height}
              loading="lazy"
              className="w-full object-cover"
            />
            {item.caption && (
              <figcaption className="mt-1 text-center">
                <Text
                  variant="body-sm"
                  className="text-[var(--bbf-text-on-light-secondary)] italic"
                >
                  {item.caption}
                </Text>
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
