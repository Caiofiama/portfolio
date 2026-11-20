// Colours for each project's 3D card and for the hero behind it.
// Iconica and ORION AI use their own brand files (~/.claude/skills/video-molde-orion/marcas).
// TeamTask API and B2B Flow have no brand of their own: they use this site's greys, with its cyan
// and orange as accents, and a background tinted 8% toward that accent.
export type LabTheme = {
  /** Hero background while the project is centred. */
  bg: string;
  cardTop: string;
  cardBottom: string;
  line: string;
  ink: string;
  soft: string;
  accent: string;
};

const SITE = { cardTop: "#1b1b1f", cardBottom: "#131316", line: "#2f2f32", ink: "#f5f5f7", soft: "#9d9da8" };

const THEMES: Record<string, LabTheme> = {
  iconica: {
    bg: "#3a0d22",
    cardTop: "#341624",
    cardBottom: "#220f18",
    line: "#4a2333",
    ink: "#faf6f8",
    soft: "#f2d7c4",
    accent: "#ff8db0",
  },
  "orion-ai": {
    bg: "#0b1a24",
    cardTop: "#10222f",
    cardBottom: "#0b1a24",
    line: "#1c3443",
    ink: "#e6f4fb",
    soft: "#b7c9d4",
    accent: "#5ce1ff",
  },
  "teamtask-api": { ...SITE, bg: "#172329", accent: "#3fe0ff" },
  "b2b-flow": { ...SITE, bg: "#261b1a", accent: "#ff7a45" },
};

export function themeOf(slug: string): LabTheme {
  return THEMES[slug] ?? { ...SITE, bg: "#131316", accent: "#3fe0ff" };
}
