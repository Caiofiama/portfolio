// Who the site is about and how to reach him. Every value comes from the brief or the résumé.

const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

/** Canonical address: set NEXT_PUBLIC_SITE_URL, else the Vercel production domain, else localhost. */
export const siteUrl = (fromEnv || (fromVercel ? `https://${fromVercel}` : "http://localhost:3000")).replace(/\/$/, "");

export const person = {
  name: "Caio Fiama Jeronimo",
  shortName: "Caio Fiama",
  role: "Desenvolvedor Full Stack",
  city: "Rio de Janeiro",
  /** From the résumé header. */
  availability: "Disponível para PJ e CLT, remoto ou híbrido.",
  lead: "Construí o Iconica, um SaaS B2B com IA que já está no ar, e o ORION AI, assistente para Windows em beta fechado. Da interface à API, com testes automatizados.",
  email: "caiofikl9@gmail.com",
  resume: "/curriculo-caio-fiama.pdf",
  linkedin: "https://www.linkedin.com/in/caiofiamajeronimo",
  github: "https://github.com/Caiofiama",
  whatsapp: "https://wa.me/5521986515747",
} as const;

/** The proof strip under the hero. Every figure comes from the brief or the résumé. */
export const proofs = [
  { value: "~1.000", label: "testes automatizados no Iconica" },
  { value: "11", label: "agentes de IA com aprovação humana" },
  { value: "30+", label: "routers na API, com 49 modelos" },
  { value: "102/105", label: "comandos de voz certos no ORION AI" },
] as const;
