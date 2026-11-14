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
  lead: "Entrego aplicações web completas, da interface à API e ao deploy, com testes automatizados e IA com saída validada.",
  email: "caiofikl9@gmail.com",
  resume: "/curriculo-caio-fiama.pdf",
  linkedin: "https://www.linkedin.com/in/caiofiamajeronimo",
  github: "https://github.com/Caiofiama",
  whatsapp: "https://wa.me/5521986515747",
} as const;
