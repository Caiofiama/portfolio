import Image from "next/image";
import type { FeaturedProject, ProjectDiagram, ProjectImage } from "@/content/projects";

/** A real screen of the product, in a frame. `natural` keeps the picture's own proportions. */
export function Picture({
  image,
  sizes,
  priority = false,
  natural = false,
  round = false,
}: {
  image: ProjectImage;
  sizes: string;
  priority?: boolean;
  natural?: boolean;
  round?: boolean;
}) {
  return (
    <div
      className={`frame${round ? " frame--round" : ""}`}
      style={natural ? { aspectRatio: `${image.width} / ${image.height}` } : undefined}
    >
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} priority={priority} />
    </div>
  );
}

/** Boxes and arrows, for a project with no screen to show. Read out as one picture. */
export function Diagram({ diagram, round = false }: { diagram: ProjectDiagram; round?: boolean }) {
  return (
    <div className={`frame frame--diagram${round ? " frame--round" : ""}`} role="img" aria-label={diagram.label}>
      <p className="diagram__title label" aria-hidden="true">
        {diagram.title}
      </p>
      <div className="diagram" aria-hidden="true">
        {diagram.boxes.map((box) => (
          <div key={box.name} className="contents">
            {box.arrow && <span className="diagram__arrow">{box.arrow === "right" ? "→" : "←"}</span>}
            <div className="diagram__box">
              <span className="text-sm font-bold leading-5 tracking-tight">{box.name}</span>
              <span className="mt-1 text-[13px] leading-[18px] text-muted">{box.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectVisual({
  project,
  sizes,
  priority,
  round,
}: {
  project: FeaturedProject;
  sizes: string;
  priority?: boolean;
  round?: boolean;
}) {
  if (project.image) return <Picture image={project.image} sizes={sizes} priority={priority} round={round} />;
  if (project.diagram) return <Diagram diagram={project.diagram} round={round} />;
  return null;
}
