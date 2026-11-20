// Stack names from content/projects.ts → icon files in public/stack (simple-icons, CC0).
// Names without an icon (OpenAI, C#, xUnit…) are shown as text chips instead.
const ICONS: Record<string, string> = {
  React: "react",
  "Next.js": "nextdotjs",
  TypeScript: "typescript",
  "Node.js": "nodedotjs",
  Express: "express",
  Prisma: "prisma",
  PostgreSQL: "postgresql",
  Redis: "redis",
  Docker: "docker",
  "GitHub Actions": "githubactions",
  Electron: "electron",
  Vite: "vite",
  Supabase: "supabase",
  "Anthropic API": "anthropic",
  "Gemini API": "googlegemini",
  Ollama: "ollama",
  "ASP.NET Core": "dotnet",
  "C# e .NET": "dotnet",
};

/** "React 19" → "/stack/react.svg"; null when there is no icon. */
export function iconFor(item: string) {
  const name = item.replace(/\s+\d+$/, "");
  const file = ICONS[name];
  return file ? `/stack/${file}.svg` : null;
}
