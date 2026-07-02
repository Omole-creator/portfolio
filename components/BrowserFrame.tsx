import Image from "next/image";

export function BrowserFrame({
  url,
  src,
  alt,
}: {
  url: string;
  src: string;
  alt: string;
}) {
  const shownUrl = url.replace(/^https?:\/\//, "");

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_20px_50px_-24px_rgba(11,30,57,0.45)]">
      <div className="flex items-center gap-3 border-b border-line bg-[#f3f4f6] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#e0605e]" />
          <span className="h-3 w-3 rounded-full bg-[#e7bd52]" />
          <span className="h-3 w-3 rounded-full bg-[#66c56b]" />
        </div>
        <div className="flex min-w-0 items-center gap-2 rounded-md border border-line bg-white px-3 py-1 text-xs text-muted">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#66c56b]/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#66c56b]" />
          </span>
          <span className="truncate">{shownUrl}</span>
        </div>
      </div>
      <Image
        src={src}
        alt={alt}
        width={2528}
        height={1165}
        className="h-auto w-full"
        sizes="(max-width: 1024px) 100vw, 640px"
      />
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}
