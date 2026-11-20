"use client";

// Development only: draws every card face with the site's fonts and exposes them as WebP data
// URLs on window.__labCards, so they can be saved to public/lab once instead of being drawn in
// every visitor's browser. Run it again whenever a project's text or picture changes.
import { useEffect, useState } from "react";
import { featuredProjects } from "@/content/projects";
import { themeOf } from "./themes";
import { drawBack, drawFront, loadFonts, loadImage, readFonts } from "./card-textures";

type Sheet = Record<string, { front: string; back: string }>;

export default function CardSheet() {
  const [sheet, setSheet] = useState<Sheet | null>(null);

  useEffect(() => {
    void (async () => {
      const fonts = readFonts();
      await loadFonts(fonts);
      await document.fonts.ready;
      const out: Sheet = {};
      for (const project of featuredProjects) {
        const theme = themeOf(project.slug);
        const image = project.image ? await loadImage(project.image.src) : null;
        out[project.slug] = {
          front: drawFront(project, theme, fonts, image).toDataURL("image/webp", 0.82),
          back: drawBack(project, theme, fonts).toDataURL("image/webp", 0.82),
        };
      }
      (window as unknown as { __labCards: Sheet }).__labCards = out;
      setSheet(out);
    })();
  }, []);

  if (!sheet) return <p className="p-8">Desenhando…</p>;
  return (
    <div className="flex flex-wrap gap-4 p-8" data-ready="true">
      {Object.entries(sheet).flatMap(([slug, faces]) =>
        (["front", "back"] as const).map((side) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`${slug}-${side}`} src={faces[side]} alt={`${slug} ${side}`} width={180} height={288} />
        )),
      )}
    </div>
  );
}
