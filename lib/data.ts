import { Project, SkillCategory } from "@/types";

export const projects: Project[] = [
  {
    name: "CryptoScope",
    description:
      "Dashboard de análise de criptomoedas em tempo real com gráficos, cards de KPI e páginas de detalhe por moeda.",
    stack: ["React", "TypeScript", "Recharts", "React Query", "Zustand"],
    live: "https://cryptoscope-tau.vercel.app",
    github: "https://github.com/Caiofiama/cryptoscope",
    icon: "📈",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "UI Component Library",
    description:
      "14 componentes prontos para produção com documentação completa no Storybook e sistema de design tokens.",
    stack: ["React", "TypeScript", "TailwindCSS", "Storybook"],
    live: "https://6a185189b3e066aa91ec5715-irgrcxocyp.chromatic.com/",
    github: "https://github.com/Caiofiama/ui-component-library",
    icon: "🧩",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    name: "CineSearch",
    description:
      "App de descoberta de filmes com filtros avançados, estado sincronizado na URL e integração com a API do TMDB.",
    stack: ["React", "TypeScript", "Zustand", "React Query", "TMDB API"],
    live: "https://movie-search-ivory-eight.vercel.app",
    github: "https://github.com/Caiofiama/Movie-search",
    icon: "🎬",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    name: "Kanban Board",
    description:
      "Gerenciador de tarefas com arrastar e soltar, prioridades, gestão de colunas e persistência via localStorage.",
    stack: ["React", "TypeScript", "dnd-kit", "Zustand", "TailwindCSS"],
    live: "https://kanban-board-xi-pearl-65.vercel.app",
    github: "https://github.com/Caiofiama/kanban-board",
    icon: "📋",
    gradient: "from-green-500/20 to-teal-500/20",
  },
  {
    name: "FinTrack Pro",
    description:
      "App de finanças pessoais full-stack com autenticação JWT, dashboard interativo, controle de orçamentos e metas financeiras.",
    stack: ["Next.js 14", "TypeScript", "PostgreSQL", "Prisma", "Recharts", "TailwindCSS", "JWT"],
    live: "https://fintrack-pro-nu.vercel.app/login",
    github: "https://github.com/Caiofiama/fintrack-pro",
    icon: "💰",
    gradient: "from-emerald-500/20 to-green-500/20",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Linguagens & Frameworks",
    skills: ["React 18", "TypeScript", "Next.js", "JavaScript (ES2022+)"],
  },
  {
    name: "Estilização",
    skills: ["TailwindCSS", "Framer Motion", "CSS Modules"],
  },
  {
    name: "Estado & Dados",
    skills: ["Zustand", "TanStack Query", "React Query", "Sincronização via URL"],
  },
  {
    name: "UI & Design",
    skills: ["Storybook", "Design Systems", "Recharts", "Acessibilidade (ARIA)"],
  },
  {
    name: "Ferramentas",
    skills: ["Vite", "Git", "GitHub", "Vercel", "Chromatic", "dnd-kit"],
  },
];

export const stats = [
  { label: "Projetos Entregues", value: "4+" },
  { label: "Deploys em Produção", value: "4" },
  { label: "Biblioteca de Componentes", value: "1" },
  { label: "Componentes Documentados", value: "14+" },
];
