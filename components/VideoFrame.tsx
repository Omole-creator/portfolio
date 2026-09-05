// Self-hosted video, styled to match BrowserFrame's chrome so a video slot
// sits at home next to a screenshot slot in the same case study.
export function VideoFrame({
  src,
  poster,
  alt,
}: {
  src: string;
  poster?: string;
  alt: string;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_20px_50px_-24px_rgba(11,30,57,0.45)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-[#f3f4f6] px-4 py-3" aria-hidden="true">
        <span className="h-3 w-3 rounded-full bg-[#e0605e]" />
        <span className="h-3 w-3 rounded-full bg-[#e7bd52]" />
        <span className="h-3 w-3 rounded-full bg-[#66c56b]" />
      </div>
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="h-auto w-full bg-black"
      >
        <track kind="captions" />
      </video>
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}
