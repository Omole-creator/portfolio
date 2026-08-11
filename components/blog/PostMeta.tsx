import { formatDate } from "@/lib/posts";

export function PostMeta({
  date,
  minutes,
  tags = [],
  tone = "light",
}: {
  date: string | null;
  minutes?: number;
  tags?: string[];
  tone?: "light" | "dark";
}) {
  const text = tone === "dark" ? "text-white/60" : "text-muted";
  const chip =
    tone === "dark"
      ? "border-white/20 bg-white/5 text-white/75"
      : "border-line bg-white text-muted";

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <p className={`text-sm ${text}`}>
        {formatDate(date)}
        {minutes ? (
          <>
            <span aria-hidden="true"> · </span>
            {minutes} min read
          </>
        ) : null}
      </p>
      {tags.length ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${chip}`}
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
