interface HeroVideoProps {
  className?: string;
}

/**
 * HeroVideo — Background video del home placeholder.
 *
 * Sirve dual-format: VP9 WebM (modern browsers) + H.264 MP4 (fallback Safari < iOS 17).
 * Auto-play muted loop. Sin audio (track eliminada en Premier).
 *
 * NOTA: el archivo se llama "hero.av1.webm" pero el codec real es VP9
 * (encoder fnord plugin Premier 2026). El type= refleja la realidad técnica.
 *
 * @since B-BBF-08-H1-3-A (2026-05-15)
 */
export function HeroVideo({ className }: HeroVideoProps) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={`absolute inset-0 h-full w-full object-cover ${className ?? ''}`}
      aria-hidden="true"
    >
      {/* VP9 WebM — Chrome/Firefox/Edge/Safari iOS 17+ */}
      <source src="/media/hero/hero.av1.webm" type='video/webm; codecs="vp9"' />
      {/* H.264 MP4 — universal fallback */}
      <source src="/media/hero/hero.h264.mp4" type='video/mp4; codecs="avc1.4D401E,mp4a.40.2"' />
    </video>
  );
}
