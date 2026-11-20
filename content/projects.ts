// Every project on the site. The facts come from the brief, the résumé and each repository's
// README; nothing here is estimated or invented.

export type ProjectLink = { label: string; href: string };

export type ProjectImage = { src: string; alt: string; width: number; height: number };

/** A short silent loop in public/clips: `<name>.mp4`, `<name>.webm` and the poster `<name>.jpg`. */
export type ProjectClip = {
  name: string;
  /** Smaller file first: the browser plays the first one it supports. */
  sources: ("mp4" | "webm")[];
  width: number;
  height: number;
  /** What the clip shows, for people who cannot see it. */
  alt: string;
};

/** A small architecture diagram, for projects with no screen to show. */
export type ProjectDiagram = {
  /** Short title shown inside the frame. */
  title: string;
  /** The whole diagram in one sentence, for screen readers. */
  label: string;
  /** Boxes left to right; `arrow` is the arrow drawn before the box. */
  boxes: { name: string; detail: string; arrow?: "right" | "left" }[];
};

/** A real excerpt from the project's repository, shown in a code frame. */
export type ProjectSnippet = {
  /** Where the excerpt comes from, shown as the frame's tab. */
  source: string;
  /** What the excerpt shows, in one sentence, for screen readers. */
  label: string;
  /** The excerpt; lines elided from the original are marked with an ellipsis comment. */
  code: string;
};

export type FeaturedProject = {
  slug: string;
  name: string;
  /** What it is, in a few words. */
  kind: string;
  /** Where it stands today. */
  status: string;
  /** One sentence on what was built. */
  summary: string;
  /** The one number or fact worth remembering. */
  fact: string;
  image?: ProjectImage;
  secondImage?: ProjectImage;
  /** Shown on the case page in place of `image` and `secondImage`. */
  clip?: ProjectClip;
  secondClip?: ProjectClip;
  /** Shown on the card and the case hero when there is no screen; the diagram then moves lower on the case page. */
  snippet?: ProjectSnippet;
  diagram?: ProjectDiagram;
  links: ProjectLink[];
  problem: string;
  built: string[];
  /** Heading for the results block: "Resultado" or, for a prototype, "Estado atual". */
  resultsTitle: string;
  results: { value: string; label: string }[];
  /** Used instead of numbers when there are none to show. */
  resultsNote?: string;
  /** Problems found and how each was fixed. */
  fixes?: { problem: string; fix: string }[];
  stack: string[];
};

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "iconica",
    name: "Iconica",
    kind: "SaaS B2B de gestão e marketing com IA",
    status: "No ar em iconicflow.com.br",
    summary:
      "API com mais de 30 routers, 49 modelos e 44 migrations, e 11 agentes de IA com saída validada e aprovação humana.",
    fact: "Cerca de 1.000 testes",
    image: {
      src: "/projetos/iconica-escritorio.webp",
      alt: "Painel do Iconica com o escritório 3D: cada agente de IA em sua mesa, com o estado atual ao lado do nome.",
      width: 1600,
      height: 1000,
    },
    secondImage: {
      src: "/projetos/iconica-agentes.webp",
      alt: "Tela de agentes de IA do Iconica, com a cota do mês e os agentes disponíveis no plano.",
      width: 1600,
      height: 999,
    },
    clip: {
      name: "iconica-escritorio",
      sources: ["webm", "mp4"],
      width: 960,
      height: 600,
      alt: "Clipe de 6 segundos: a câmera se aproxima do escritório 3D do Iconica, onde cada agente de IA aparece em sua mesa com o estado atual ao lado do nome.",
    },
    secondClip: {
      name: "iconica-agentes",
      sources: ["mp4", "webm"],
      width: 960,
      height: 600,
      alt: "Clipe de 6 segundos: a câmera percorre a tela de agentes de IA do Iconica, com a cota do mês e os cartões de cada agente.",
    },
    links: [{ label: "Abrir iconicflow.com.br", href: "https://iconicflow.com.br" }],
    problem:
      "Reunir gestão e marketing de várias empresas em um produto só, com os dados de cada empresa isolados e agentes de IA que nunca publicam, enviam ou gastam sem a aprovação de uma pessoa.",
    built: [
      "API em Express 5 com mais de 30 routers, 49 modelos Prisma e 44 migrations.",
      "Painel em Next.js 15 com BFF e tokens em cookies HttpOnly.",
      "Módulos de CRM, ponto, RH, campanhas, recrutamento, documentos, chat e assinaturas.",
      "11 agentes de IA com saída validada por schema, aprovação humana, remoção de dados pessoais e controle de custo por plano.",
      "Escritório 3D ligado ao estado real dos agentes.",
      "Cobrança com Mercado Pago e uploads com quarentena de antivírus, processados em fila.",
    ],
    resultsTitle: "Resultado",
    results: [
      { value: "~1.000", label: "testes: unitários, de contrato, E2E com PostgreSQL e Playwright" },
      { value: "11", label: "agentes de IA com aprovação humana" },
      { value: "30+", label: "routers na API, com 49 modelos e 44 migrations" },
    ],
    fixes: [
      {
        problem: "Um usuário conseguia aprovar o próprio ponto e o próprio salário.",
        fix: "A regra passou a ser aplicada no servidor e a tentativa agora recebe 403. A autenticação usa refresh rotativo, papéis e isolamento de dados por empresa.",
      },
      {
        problem: "Erros 500 intermitentes causados por condições de corrida.",
        fix: "Atualizações condicionais, ON CONFLICT e auditoria gravada na mesma transação da mudança.",
      },
      {
        problem: "Uma rodada de testes de ataque achou falhas em limites de entrada e na paginação.",
        fix: "Todas foram fechadas: limite de payload antes da autenticação e cursores de paginação assinados.",
      },
    ],
    stack: [
      "React 19",
      "Next.js 15",
      "TypeScript",
      "Node.js",
      "Express 5",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "OpenAI API",
      "Docker",
      "GitHub Actions",
    ],
  },
  {
    slug: "orion-ai",
    name: "ORION AI",
    kind: "Assistente com IA para Windows",
    status: "No ar, só Windows",
    summary:
      "Agente com ciclo de ferramentas, memória e aprovação do usuário, com proteção contra prompt injection e 313 testes.",
    fact: "102 de 105 comandos de voz certos",
    image: {
      src: "/projetos/orion-voz.webp",
      alt: "ORION AI em uma conversa por voz: a pessoa pergunta o tempo de amanhã e o assistente responde falando.",
      width: 1280,
      height: 720,
    },
    secondImage: {
      src: "/projetos/orion-voz.webp",
      alt: "ORION AI em uma conversa por voz: a pessoa pergunta o tempo de amanhã e o assistente responde falando.",
      width: 1280,
      height: 720,
    },
    clip: {
      name: "orion-voz-acoes",
      sources: ["mp4", "webm"],
      width: 1280,
      height: 720,
      alt: "Clipe de 6 segundos: a pessoa diz “ativa o modo foco” e o ORION AI marca cinco passos como feitos, um a um, e confirma.",
    },
    links: [
      { label: "Ver a página do ORION AI", href: "https://orion.orionai.com.br/" },
      { label: "Baixar para Windows", href: "https://github.com/caiofikl9-ui/orion-releases/releases/latest" },
    ],
    problem:
      "Deixar um assistente agir no computador, na agenda, no e-mail e no WhatsApp sem que um texto lido de fora consiga dar ordens a ele, e entender comandos de voz em português com poucos erros.",
    built: [
      "Aplicativo desktop em Electron e React 19, com chat e voz em português.",
      "Agente com ciclo de ferramentas e memória, que controla o PC e pede aprovação antes de agir.",
      "Guarda contra prompt injection: depois de ler conteúdo externo, toda ação com efeito exige aprovação.",
      "Agente de código em sandbox, CSP e IPC validado.",
      "Instalador com atualização automática. Ele ainda não tem assinatura digital: na primeira execução, o Windows mostra o aviso do SmartScreen.",
      "Venda aberta com os planos Pessoal e Pro, com 14 dias grátis no cartão ou pagamento avulso com Pix.",
    ],
    resultsTitle: "Resultado",
    results: [
      { value: "102 de 105", label: "comandos de voz certos na bateria de teste; eram 78 antes de reescrever o roteamento" },
      { value: "640 ms", label: "de silêncio para detectar o fim da fala; eram 900 ms" },
      { value: "313", label: "testes automatizados" },
    ],
    stack: [
      "Electron",
      "React 19",
      "TypeScript",
      "Vite",
      "Node.js",
      "Supabase",
      "Anthropic API",
      "Gemini API",
      "Ollama",
      "Whisper",
    ],
  },
  // From the orion-cobra repository (README, docs/plano-mvp.md, docs/telas). Private code, not yet
  // deployed: no public link. The 199 unit tests were counted with `npm test` on 2026-11-20.
  {
    slug: "orion-cobra",
    name: "Orion Cobra",
    kind: "Cobrança automática para pequenas empresas",
    status: "Em desenvolvimento",
    summary:
      "Régua de cobrança por e-mail e WhatsApp, com PIX e cartão pelo Mercado Pago e os dados de cada empresa isolados até no banco.",
    fact: "199 testes unitários",
    image: {
      src: "/projetos/orion-cobra-painel.webp",
      alt: "Painel do Orion Cobra no tema escuro, com dados de demonstração: R$ 10.783,15 em 22 faturas abertas, divididos em uma régua por tempo de atraso.",
      width: 1280,
      height: 800,
    },
    secondImage: {
      src: "/projetos/orion-cobra-regua.webp",
      alt: "Tela da régua do Orion Cobra: lembretes em D-3, D0, D+3, D+7 e D+15, cada passo por e-mail, WhatsApp ou os dois.",
      width: 1280,
      height: 720,
    },
    links: [],
    problem:
      "Pequenas empresas cobram fatura vencida na mão e perdem dinheiro. O sistema precisa lembrar o cliente na hora certa, por e-mail e WhatsApp, dentro das regras do Código de Defesa do Consumidor, receber por PIX ou cartão e nunca misturar os dados de uma empresa com os de outra.",
    built: [
      "API em Express 5 e TypeScript, com validação em Zod, e painel em Next.js 15.",
      "Régua padrão em D-3, D0, D+3, D+7 e D+15, com textos editáveis. As mensagens só saem das 8h às 20h, de segunda a sábado, fora de feriado, e no máximo uma por dia em cada canal.",
      "Filas com BullMQ e Redis: um worker agenda a régua e outro envia por e-mail e WhatsApp.",
      "Cobrança pelo Mercado Pago da própria empresa, conectado por OAuth, com PIX, boleto e link. Os tokens ficam cifrados com AES-256-GCM.",
      "Cada empresa isolada no código e no banco: as relações usam chave composta com o id da empresa.",
      "Página onde o cliente paga a fatura, com multa e juros dentro do limite legal ou um acordo em parcelas.",
      "Pronto em modo simulado: painel, página do cliente e assinatura por cartão. Falta o deploy e o primeiro cliente.",
    ],
    resultsTitle: "Estado atual",
    results: [
      { value: "199", label: "testes unitários passando, mais 27 arquivos de teste de integração com PostgreSQL e Redis" },
      { value: "25", label: "modelos no banco, em 23 migrations" },
      { value: "D-3 a D+15", label: "régua padrão com 9 textos cordiais, que a empresa pode editar" },
    ],
    stack: ["Express 5", "TypeScript", "Zod", "Next.js 15", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Mercado Pago", "Docker"],
  },
  {
    slug: "teamtask-api",
    name: "TeamTask API",
    kind: "API de tarefas em ASP.NET Core 8",
    status: "Código público",
    summary: "Clean Architecture, CQRS e JWT, testada com xUnit e Testcontainers.",
    fact: "Mais de 50 testes",
    // From the "Exemplos de Request / Response" section of the repository's README.
    snippet: {
      source: "README · criar tarefa",
      label: "Exemplo do README da TeamTask API: um POST em /api/tasks com token Bearer cria a tarefa e a API responde 201 Created com o id, o status e a data de criação.",
      code: `POST /api/tasks
Authorization: Bearer <token>
{ "title": "Implementar endpoint de relatório",
  "priority": 3,
  "dueDate": "2026-07-01T00:00:00Z" }

201 Created
{ "id": "...", "status": 1, "priority": 3,
  "createdAt": "2026-06-04T10:00:00Z" }`,
    },
    diagram: {
      title: "Camadas e dependências",
      label: "As quatro camadas da TeamTask API: a Api depende da Application, que depende do Domain; a Infrastructure também depende do Domain.",
      boxes: [
        { name: "Api", detail: "Controllers e middlewares" },
        { name: "Application", detail: "Handlers CQRS e validadores", arrow: "right" },
        { name: "Domain", detail: "Entidades e regras", arrow: "right" },
        { name: "Infrastructure", detail: "EF Core, JWT e Outbox", arrow: "left" },
      ],
    },
    links: [{ label: "Ver o código no GitHub", href: "https://github.com/Caiofiama/TeamTask-API" }],
    problem:
      "Uma API para times organizarem projetos, tarefas e comentários, em que a regra de negócio não mora no controller e os testes de integração rodam contra um PostgreSQL de verdade.",
    built: [
      "ASP.NET Core 8 em quatro camadas: Api, Application, Domain e Infrastructure.",
      "CQRS com MediatR e validação com FluentValidation.",
      "JWT com refresh token.",
      "Entity Framework Core com PostgreSQL, logs com Serilog e documentação em Swagger.",
      "Times, projetos, tarefas com filtros, comentários e relatórios de produtividade.",
      "Docker e docker-compose para subir tudo com um comando.",
    ],
    resultsTitle: "Resultado",
    results: [
      { value: "50+", label: "testes com xUnit; os de integração sobem PostgreSQL com Testcontainers" },
      { value: "26", label: "endpoints em 6 grupos" },
      { value: "4", label: "camadas, com a dependência sempre apontando para o domínio" },
    ],
    stack: [
      "C# 12",
      "ASP.NET Core 8",
      "Entity Framework Core 8",
      "PostgreSQL",
      "MediatR",
      "FluentValidation",
      "xUnit",
      "Testcontainers",
      "Docker",
    ],
  },
  {
    slug: "b2b-flow",
    name: "B2B Flow",
    kind: "Gestão comercial B2B",
    status: "Protótipo",
    summary: "Protótipo com API em .NET 8 e interface em Next.js.",
    fact: ".NET 8 e Next.js",
    // From frontend/src/components/pipeline/KanbanBoard.tsx, handleDragEnd.
    snippet: {
      source: "KanbanBoard.tsx · trecho",
      label: "Trecho do funil Kanban do B2B Flow: o card muda de estágio na tela na hora, a API recebe um PATCH com o novo estágio e, se ela falhar, o funil volta ao estado anterior.",
      code: `// Optimistic UI update
setPipeline((prev) => { /* … */ });

try {
  await apiFetch(\`/opportunities/\${activeId}/stage\`, {
    method: 'PATCH',
    body: JSON.stringify({ stage: targetStage }),
  });
} catch {
  // Rollback on failure
  setPipeline(initialPipeline);
}`,
    },
    diagram: {
      title: "Do navegador ao banco",
      label: "As três partes do B2B Flow: a interface em Next.js chama a API em .NET 8, que grava no PostgreSQL.",
      boxes: [
        { name: "Next.js 14", detail: "Funil Kanban e dashboard" },
        { name: "API .NET 8", detail: "CQRS e JWT com 3 papéis", arrow: "right" },
        { name: "PostgreSQL", detail: "Entity Framework Core", arrow: "right" },
      ],
    },
    links: [
      { label: "Abrir o protótipo", href: "https://b2b-flow-bay.vercel.app/login" },
      { label: "Ver o código no GitHub", href: "https://github.com/Caiofiama/b2b-flow" },
    ],
    problem:
      "Acompanhar clientes e oportunidades de venda em um funil, com permissões diferentes para quem administra, gerencia e opera.",
    built: [
      "API em .NET 8 com Clean Architecture, CQRS e FluentValidation.",
      "JWT com três papéis: Admin, Manager e Operator.",
      "Valores em dinheiro guardados como inteiros de 64 bits, sem erro de ponto flutuante.",
      "Funil Kanban com atualização otimista e rollback quando a API falha.",
      "Interface em Next.js 14 com autenticação, clientes, oportunidades e dashboard.",
    ],
    resultsTitle: "Estado atual",
    results: [],
    resultsNote:
      "É um protótipo funcional, não uma plataforma pronta para operar. Os dados são de demonstração e alguns recursos respondem com dados simulados.",
    stack: ["C# e .NET 8", "Next.js 14", "PostgreSQL", "Entity Framework Core", "Clean Architecture", "CQRS", "Zustand", "dnd-kit"],
  },
];

export function getProject(slug: string) {
  return featuredProjects.find((project) => project.slug === slug);
}

export type OtherProject = {
  name: string;
  description: string;
  stack: string[];
  live: string;
  github: string;
};

export const otherProjects: OtherProject[] = [
  {
    name: "DevLinks",
    description: "Link-in-bio com planos Free e Pro via Stripe, webhooks, portal do cliente e contagem de cliques.",
    stack: ["Next.js 14", "PostgreSQL", "Prisma", "Stripe"],
    live: "https://devlinks1.vercel.app/login",
    github: "https://github.com/Caiofiama/devlinks",
  },
  {
    name: "FinTrack Pro",
    description: "Finanças pessoais com login, dashboard, orçamentos e metas.",
    stack: ["Next.js 14", "PostgreSQL", "Prisma", "Recharts"],
    live: "https://fintrack-pro-nu.vercel.app/login",
    github: "https://github.com/Caiofiama/fintrack-pro",
  },
  {
    name: "CryptoScope",
    description: "Painel de criptomoedas em tempo real, com gráficos e página de detalhe por moeda.",
    stack: ["React", "TypeScript", "Recharts", "React Query"],
    live: "https://cryptoscope-tau.vercel.app",
    github: "https://github.com/Caiofiama/cryptoscope",
  },
  {
    name: "UI Component Library",
    description: "14 componentes documentados no Storybook, com design tokens.",
    stack: ["React", "TypeScript", "TailwindCSS", "Storybook"],
    live: "https://6a185189b3e066aa91ec5715-irgrcxocyp.chromatic.com/",
    github: "https://github.com/Caiofiama/ui-component-library",
  },
  {
    name: "CineSearch",
    description: "Busca de filmes com filtros e estado sincronizado na URL, sobre a API do TMDB.",
    stack: ["React", "TypeScript", "Zustand", "React Query"],
    live: "https://movie-search-ivory-eight.vercel.app",
    github: "https://github.com/Caiofiama/Movie-search",
  },
  {
    name: "Kanban Board",
    description: "Quadro de tarefas com arrastar e soltar, prioridades e colunas editáveis.",
    stack: ["React", "TypeScript", "dnd-kit", "Zustand"],
    live: "https://kanban-board-xi-pearl-65.vercel.app",
    github: "https://github.com/Caiofiama/kanban-board",
  },
];
