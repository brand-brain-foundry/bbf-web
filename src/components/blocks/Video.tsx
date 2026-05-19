import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';

type MediaRef = { url?: string | null };

type VideoBlockProps = {
  video: MediaRef | string;
  poster?: MediaRef | string | null;
  caption?: string | null;
  autoplay?: boolean | null;
  loop?: boolean | null;
  muted?: boolean | null;
  className?: string;
};

export function VideoBlock({
  video,
  poster,
  caption,
  autoplay = false,
  loop = false,
  muted = true,
  className,
}: VideoBlockProps) {
  const src = typeof video === 'string' ? video : video.url;
  const posterSrc =
    poster == null ? undefined : typeof poster === 'string' ? poster : (poster.url ?? undefined);

  if (!src) return null;

  return (
    <figure data-component="bbf-video" className={cn('my-6', className)}>
      <video
        src={src}
        poster={posterSrc}
        autoPlay={autoplay ?? false}
        loop={loop ?? false}
        muted={muted ?? true}
        playsInline
        controls={!autoplay}
        className="w-full rounded-md"
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
