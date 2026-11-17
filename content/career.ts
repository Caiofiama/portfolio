// Experience and stack, condensed from the résumé.

export type Job = {
  role: string;
  company: string;
  /** Kind of company, contract and period, as far as the résumé states them. */
  meta: string;
  points: string[];
};

export const jobs: Job[] = [
  {
    role: "Desenvolvedor Front-End",
    company: "PlugZ",
    meta: "Fintech e marketplace global · contrato · 08/2023 a 06/2026",
    points: [
      "Interfaces em React e TypeScript para um marketplace sobre microsserviços.",
      "Fluxos de verificação de identidade (KYC e KYB) com upload de documentos e status em tempo real.",
      "Telas de escrow e de pagamentos híbridos, em moeda comum e em cripto.",
      "Componentes adaptados à LGPD e às regras de cada país, documentados no Storybook.",
    ],
  },
  {
    role: "Desenvolvedor Full Stack",
    company: "Orion Labs",
    meta: "Produtos próprios",
    points: [
      "Iconica: API, painel e agentes de IA de um SaaS B2B que está no ar.",
      "ORION AI: assistente para Windows, com assinatura aberta.",
      "Integração de LLMs com saída em JSON validada por schema antes de ser aceita.",
      "CI/CD com GitHub Actions e Docker.",
    ],
  },
];

/** Shown beside the jobs. Both come from the dates and stages above, nothing else. */
export const experienceFacts = [
  { value: "Quase 3 anos", label: "como front-end na PlugZ, fintech e marketplace global (08/2023 a 06/2026)" },
  { value: "2", label: "produtos próprios na Orion Labs: os dois no ar, com assinatura aberta" },
];

export type StackGroup = { area: string; items: string[] };

export const stackGroups: StackGroup[] = [
  {
    area: "Front-end",
    items: ["React 18 e 19", "Next.js 14 e 15", "TypeScript", "TailwindCSS", "Zustand", "TanStack Query"],
  },
  {
    area: "Back-end e APIs",
    items: ["Node.js e Express", "C# e ASP.NET Core 8", "Entity Framework Core", "Prisma", "REST e OpenAPI", "JWT e RBAC"],
  },
  {
    area: "Dados e arquitetura",
    items: ["PostgreSQL", "Redis", "Clean Architecture", "CQRS com MediatR", "Microsserviços", "Outbox Pattern"],
  },
  {
    area: "Testes e qualidade",
    items: ["xUnit", "Jest e Testing Library", "Playwright", "Testcontainers", "ESLint e Prettier"],
  },
  {
    area: "DevOps",
    items: ["Git e GitHub Actions", "Docker", "Vercel", "Railway e Render", "Prometheus e Grafana"],
  },
  {
    area: "IA generativa",
    items: ["OpenAI API", "Anthropic API", "Saída estruturada validada por schema", "Engenharia de prompt", "N8N e Make"],
  },
];
