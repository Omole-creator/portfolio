import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1E39",
          deep: "#081527",
          soft: "#12294a",
        },
        ink: "#0A0C10",
        gold: {
          DEFAULT: "#C29A45",
          hover: "#B0883A",
          soft: "#E7D6A8",
        },
        paper: "#FAFAF8",
        muted: "#5B6472",
        line: "#E5E7EB",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      fontVariantNumeric: {
        tabular: "tabular-nums",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      // Long-form article styling. Every value maps back to the token set above,
      // so blog posts stay inside the same palette as the rest of the site.
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#3F4654",
            "--tw-prose-headings": "#0A0C10",
            "--tw-prose-lead": "#5B6472",
            "--tw-prose-links": "#0B1E39",
            "--tw-prose-bold": "#0A0C10",
            "--tw-prose-counters": "#5B6472",
            "--tw-prose-bullets": "#C29A45",
            "--tw-prose-hr": "#E5E7EB",
            "--tw-prose-quotes": "#0A0C10",
            "--tw-prose-quote-borders": "#C29A45",
            "--tw-prose-captions": "#5B6472",
            "--tw-prose-code": "#0A0C10",
            "--tw-prose-pre-code": "#FAFAF8",
            "--tw-prose-pre-bg": "#081527",
            "--tw-prose-th-borders": "#E5E7EB",
            "--tw-prose-td-borders": "#E5E7EB",
            a: {
              fontWeight: "600",
              textDecorationColor: "#C29A45",
              textUnderlineOffset: "3px",
            },
            "a:hover": { color: "#B0883A" },
            "h2, h3, h4": { letterSpacing: "-0.02em" },
            blockquote: {
              fontStyle: "normal",
              fontWeight: "500",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:last-of-type::after": { content: "none" },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            code: {
              backgroundColor: "#F1F1EE",
              borderRadius: "0.25rem",
              padding: "0.15em 0.35em",
              fontWeight: "500",
            },
            img: { borderRadius: "0.75rem" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
