import Image from "next/image";
import type { ReactNode } from "react";
import type { FeaturedProject, ProjectDiagram, ProjectImage, ProjectSnippet } from "@/content/projects";

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

// Comments, strings, a few keywords and HTTP status lines, in that order of precedence.
const TOKEN = /(\/\/.*$|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'[^']*'|`[^`]*`)|\b(POST|GET|PATCH|PUT|DELETE|await|try|catch)\b|^(\d{3} [A-Z][a-z]+)/g;
const TOKEN_CLASS = ["code__comment", "code__string", "code__keyword", "code__status"];

function highlight(line: string) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(line.slice(last, at));
    const group = match.slice(1).findIndex((part) => part !== undefined);
    parts.push(
      <span key={at} className={TOKEN_CLASS[group]}>
        {match[0]}
      </span>,
    );
    last = at + match[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

/** A real excerpt from the repository, in an editor-like frame. Read out as one picture. */
export function Snippet({ snippet, round = false }: { snippet: ProjectSnippet; round?: boolean }) {
  return (
    <div className={`frame frame--code${round ? " frame--round" : ""}`} role="img" aria-label={snippet.label}>
      <p className="code__tab" aria-hidden="true">
        <span className="code__dot" />
        {snippet.source}
      </p>
      <pre className="code" aria-hidden="true">
        <code>
          {snippet.code.split("\n").map((line, i) => (
            <span key={i} className="code__line">
              {highlight(line)}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
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
  if (project.snippet) return <Snippet snippet={project.snippet} round={round} />;
  if (project.diagram) return <Diagram diagram={project.diagram} round={round} />;
  return null;
}
