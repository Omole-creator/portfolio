import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders a post's Markdown. react-markdown does not render raw HTML, so
// nothing in the database can inject markup into the page.
export function PostBody({ body }: { body: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            const external = Boolean(href && /^https?:\/\//.test(href));
            return (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
