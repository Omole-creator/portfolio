import type { Config } from "tailwindcss";

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
    },
  },
  plugins: [],
};

export default config;
