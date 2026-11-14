import { ArrowUpRight } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { otherProjects } from "@/content/projects";
import SectionTitle from "@/components/site/SectionTitle";

// Smaller projects, as a compact list of rows: what each one is, its stack and where to open it.
export default function OtherProjects() {
  return (
    <section id="outros-projetos" className="section">
      <div className="wrap">
        <SectionTitle label="Outros projetos" title="Projetos menores, todos com demo e código." />
        <ul className="mt-10 border-t border-line lg:mt-14">
          {otherProjects.map((project) => (
            <li key={project.name} className="row">
              <h3 className="text-lg font-bold leading-7 tracking-tight lg:col-span-3">{project.name}</h3>
              <p className="text-[15px] leading-6 text-muted lg:col-span-5">{project.description}</p>
              <p className="label hidden text-muted sm:block lg:col-span-2">{project.stack.join(" · ")}</p>
              <div className="flex flex-wrap gap-x-6 lg:col-span-2 lg:justify-end">
                <a
                  className="link-draw text-[15px]"
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir demo: ${project.name}`}
                >
                  <span>Demo</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <a
                  className="link-draw text-[15px]"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver código: ${project.name}`}
                >
                  <GithubIcon size={16} />
                  <span>Código</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
