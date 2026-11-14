import { ArrowDown, Download } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import HeroTabs from "@/components/site/HeroTabs";
import HeroVisual from "@/components/site/HeroVisual";
import { person } from "@/content/site";

export default function Hero() {
  return (
    <section id="inicio" className="hero" data-enter>
      <div className="wrap hero__inner">
        <div className="hero__text">
          <h1 className="hero__name">
            {person.name}
            <span className="hero__role">
              {person.role.replace(/ Stack$/, "\u00a0Stack")} <span className="whitespace-nowrap">no {person.city}</span>
            </span>
          </h1>
          <p className="hero__lead">{person.lead}</p>
          <div className="mt-7 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <a className="btn btn--primary" href="#projetos">
              Ver projetos
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a className="btn btn--ghost" href={person.resume} download>
              Baixar currículo
              <Download size={16} aria-hidden="true" />
            </a>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-6">
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
          </ul>
        </div>
        <HeroVisual />
        <HeroTabs />
      </div>
    </section>
  );
}
