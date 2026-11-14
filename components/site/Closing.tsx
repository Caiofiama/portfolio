import { Download } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import WhatsappIcon from "@/components/icons/WhatsappIcon";
import { person } from "@/content/site";
import SectionTitle from "@/components/site/SectionTitle";

// The contact block and the footer are one closing section.
export default function Closing() {
  const year = new Date().getFullYear();
  return (
    <footer id="contato" className="closing section flex flex-col">
      <div className="wrap flex flex-1 flex-col">
        <SectionTitle label="Contato" title="Vamos conversar sobre a sua vaga." />
        <a
          className="mt-8 inline-flex min-h-[44px] w-fit items-center break-all text-[clamp(24px,4.6vw,64px)] font-bold leading-tight tracking-tight text-accent underline decoration-1 underline-offset-[0.18em] lg:mt-12"
          href={`mailto:${person.email}`}
        >
          {person.email}
        </a>
        <p className="mt-6 max-w-[34em] text-lg text-muted lg:text-xl">
          {person.city}, RJ. {person.availability}
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-1 lg:mt-8">
          <li>
            <a className="link-draw" href={person.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedinIcon size={18} />
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a className="link-draw" href={person.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon size={18} />
              <span>GitHub</span>
            </a>
          </li>
          <li>
            <a className="link-draw" href={person.whatsapp} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon size={18} />
              <span>WhatsApp</span>
            </a>
          </li>
          <li>
            <a className="link-draw" href={person.resume} download>
              <Download size={18} aria-hidden="true" />
              <span>Baixar currículo</span>
            </a>
          </li>
        </ul>

        <div className="mt-auto flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-line pt-6 text-sm text-muted">
          <p>
            © {year} {person.name}
          </p>
          <p>Modelos 3D de Kenney, em domínio público (CC0).</p>
        </div>
      </div>
    </footer>
  );
}
