"use client";

// The four featured projects as links at the foot of the hero. Hovering or focusing one
// lights its desk in the scene, so the keyboard reaches everything the mouse does.
import Link from "next/link";
import { featuredProjects } from "@/content/projects";
import { heroStore, useActiveProject } from "@/lib/hero-store";

export default function HeroTabs() {
  const active = useActiveProject();
  return (
    <nav className="hero__tabs" aria-label="Projetos em destaque">
      {featuredProjects.map((project) => (
        <Link
          key={project.slug}
          href={`/projetos/${project.slug}`}
          className="hero-tab"
          data-active={active === project.slug}
          onPointerEnter={(e) => {
            if (e.pointerType !== "touch") heroStore.setActive(project.slug);
          }}
          onPointerLeave={() => heroStore.setActive(null)}
          onFocus={() => heroStore.setActive(project.slug)}
          onBlur={() => heroStore.setActive(null)}
        >
          <span className="hero-tab__name">{project.name}</span>
          <span className="hero-tab__kind">{project.kind}</span>
        </Link>
      ))}
    </nav>
  );
}
