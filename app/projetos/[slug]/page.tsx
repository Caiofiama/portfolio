import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Clip from "@/components/site/Clip";
import Closing from "@/components/site/Closing";
import Nav from "@/components/site/Nav";
import ProjectVisual, { Picture } from "@/components/site/ProjectVisual";
import { featuredProjects, getProject } from "@/content/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.name}: ${project.kind}`;
  const description = `${project.summary} ${project.status}.`;
  return {
    title,
    description,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: { type: "article", title, description, url: `/projetos/${project.slug}` },
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = featuredProjects.indexOf(project);
  const next = featuredProjects[(index + 1) % featuredProjects.length];

  return (
    <>
      <Nav />
      <main id="conteudo" tabIndex={-1}>
        <section className="case-hero">
          <div className="wrap grid items-start gap-x-6 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Link href="/#projetos" className="link-draw text-sm text-muted">
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Voltar aos projetos</span>
              </Link>
              <h1 className="case-title mt-6">{project.name}</h1>
              <p className="mt-4 text-xl leading-[1.4] lg:text-2xl">{project.kind}</p>
              <p className="label mt-4 text-accent">{project.status}</p>
              <ul className="mt-8 flex flex-wrap gap-3">
                {project.links.map((link, i) => (
                  <li key={link.href}>
                    <a
                      className={`btn ${i === 0 ? "btn--primary" : "btn--ghost"}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              {project.clip ? (
                <Clip clip={project.clip} sizes="(min-width: 1024px) 58vw, 100vw" priority round />
              ) : (
                <ProjectVisual project={project} sizes="(min-width: 1024px) 58vw, 100vw" priority round />
              )}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap grid gap-x-6 gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="h3">Problema</h2>
              <p className="mt-4 max-w-[30em] text-lg leading-[1.6] text-muted">{project.problem}</p>
            </div>
            <div className="lg:col-span-7">
              <h2 className="h3">O que construí</h2>
              <ul className="mt-4 grid gap-3">
                {project.built.map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-accent"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-12">
              <h2 className="h3">{project.resultsTitle}</h2>
              {project.results.length > 0 && (
                <dl className="mt-6 grid gap-6 sm:grid-cols-3">
                  {project.results.map((result) => (
                    <div key={result.label} className="card p-6 lg:p-8">
                      <dt className="order-2 mt-2 text-[15px] leading-6 text-muted">{result.label}</dt>
                      <dd className="stat__value order-1">{result.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {project.resultsNote && <p className="mt-4 max-w-[40em] text-lg leading-[1.6] text-muted">{project.resultsNote}</p>}
            </div>
          </div>
        </section>

        {(project.fixes || project.secondClip || project.secondImage) && (
          <section className="section">
            <div className="wrap grid gap-x-6 gap-y-12 lg:grid-cols-12">
              {project.fixes && (
                <div className="lg:col-span-5">
                  <h2 className="h3">Falhas achadas e corrigidas</h2>
                  <ol className="mt-6 grid gap-8">
                    {project.fixes.map((item) => (
                      <li key={item.problem}>
                        <p className="font-medium">{item.problem}</p>
                        <p className="mt-2 text-muted">{item.fix}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {(project.secondClip || project.secondImage) && (
                <div className={project.fixes ? "lg:col-span-7" : "lg:col-span-8"}>
                  {project.secondClip ? (
                    <Clip clip={project.secondClip} sizes="(min-width: 1024px) 58vw, 100vw" round />
                  ) : (
                    project.secondImage && (
                      <Picture image={project.secondImage} sizes="(min-width: 1024px) 58vw, 100vw" natural round />
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="pb-24 pt-8 lg:pb-32">
          <div className="wrap grid gap-x-6 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="h3">Stack</h2>
              <p className="label mt-4 leading-7 text-muted">{project.stack.join(" · ")}</p>
            </div>
            <div className="lg:col-span-5">
              <h2 className="h3">Próximo projeto</h2>
              <Link href={`/projetos/${next.slug}`} className="link-draw mt-2 text-xl text-accent">
                <span>
                  {next.name}: {next.kind}
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Closing />
    </>
  );
}
