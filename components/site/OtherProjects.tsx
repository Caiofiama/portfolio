import { ArrowUpRight } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { otherProjects } from "@/content/projects";

// Smaller projects, as a compact grid: what each one is, its stack and where to open it.
export default function OtherProjects() {
  return (
    <section id="outros-projetos" className="section">
      <div className="wrap">
        <h2 className="h2">Outros projetos</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:grid-cols-3">
          {otherProjects.map((project) => (
            <li key={project.name} className="card p-6">
              <h3 className="text-xl font-bold leading-7 tracking-tight">{project.name}</h3>
              <p className="mt-2 text-[15px] leading-6 text-muted">{project.description}</p>
              <p className="label mt-4 hidden text-muted sm:block">{project.stack.join(" · ")}</p>
              <div className="mt-auto flex flex-wrap gap-x-6 pt-4">
                <a
                  className="link-draw text-[15px]"
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir demo: ${project.name}`}
                >
                  <span>Abrir demo</span>
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
                  <span>Ver código</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
