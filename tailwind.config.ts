import type { Config } from "tailwindcss";

// Identity read from orionai.com.br (black ground, off-white text, cyan action, orange signal).
// The values live in app/globals.css as CSS variables.
const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        signal: "var(--signal)",
      },
    },
  },
  plugins: [],
};

export default config;
