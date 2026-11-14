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
            <li key={project.name} className="row grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 lg:grid-cols-12 lg:gap-x-6">
              <h3 className="self-center text-lg font-bold leading-6 tracking-tight lg:col-span-3">{project.name}</h3>
              <p className="col-span-2 text-[15px] leading-6 text-muted lg:col-span-5">{project.description}</p>
              <p className="label col-span-2 mt-1 hidden text-muted sm:block lg:col-span-2 lg:mt-0">{project.stack.join(" · ")}</p>
              <div className="col-start-2 row-start-1 flex gap-x-4 lg:col-span-2 lg:col-start-auto lg:row-start-auto lg:justify-end lg:gap-x-6">
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
