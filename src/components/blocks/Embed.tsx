import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';

type EmbedProps = {
  provider: 'youtube' | 'vimeo' | 'spotify' | 'twitter' | 'other';
  url: string;
  caption?: string | null;
  className?: string;
};

function getEmbedUrl(provider: EmbedProps['provider'], url: string): string | null {
  if (provider === 'youtube') {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/,
    );
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
  }
  if (provider === 'vimeo') {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  }
  if (provider === 'spotify') {
    return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
  }
  return null;
}

export function EmbedBlock({ provider, url, caption, className }: EmbedProps) {
  const embedUrl = getEmbedUrl(provider, url);

  return (
    <figure data-component="bbf-embed" data-provider={provider} className={cn('my-6', className)}>
      {embedUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-md">
          <iframe
            src={embedUrl}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
            loading="lazy"
            title={`${provider} embed`}
          />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-md border border-[var(--bbf-border-subtle-on-sand)] p-4 transition-colors hover:border-[var(--bbf-accent-red)]"
        >
          <Text variant="body-sm">{url}</Text>
        </a>
      )}
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
