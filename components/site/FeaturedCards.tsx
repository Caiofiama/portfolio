import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Clip from "@/components/site/Clip";
import ProjectVisual from "@/components/site/ProjectVisual";
import { featuredProjects } from "@/content/projects";
import SectionTitle from "@/components/site/SectionTitle";

// The four featured projects. Each card is one link to the project's own page.
export default function FeaturedCards() {
  return (
    <section id="projetos" className="section">
      <div className="wrap">
        <SectionTitle label="Projetos em destaque" title="Dois no ar, um em construção e dois códigos abertos." />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-14">
          {featuredProjects.map((project) => (
            <li key={project.slug} className="flex min-w-0" data-reveal>
              <Link href={`/projetos/${project.slug}`} className="card w-full min-w-0">
                {project.clip ? (
                  <Clip clip={project.clip} sizes="(min-width: 768px) 50vw, 100vw" bare />
                ) : (
                  <ProjectVisual project={project} sizes="(min-width: 768px) 50vw, 100vw" />
                )}
                <div className="flex flex-1 flex-col p-6 lg:p-8">
                  <p className="label text-accent">{project.status}</p>
                  <h3 className="h3 mt-2">{project.name}</h3>
                  <p className="mt-1 text-muted">{project.kind}</p>
                  <p className="mt-4 max-w-[34em]">{project.summary}</p>
                  <p className="card__go mt-auto pt-6">
                    <span>Ver o caso</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
