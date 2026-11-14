"use client";

// The hero's picture: a still poster of the office first, then the live 3D scene on devices
// that can afford it, plus the card pinned above the desk in focus.
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { featuredProjects, type FeaturedProject } from "@/content/projects";
import { heroStore, useActiveProject, usePinned } from "@/lib/hero-store";
import { canRenderScene, whenIdle } from "@/lib/capability";

const OfficeScene = dynamic(() => import("@/components/scene/OfficeScene"), { ssr: false });

/** If the scene fails (no WebGL, a model that did not load), the poster simply stays. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function DeskCard({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const slug = useActiveProject();
  const pinned = usePinned();
  const project = featuredProjects.find((p) => p.slug === slug) ?? null;
  // Keeps the last project on the card while it fades out.
  const [last, setLast] = useState<FeaturedProject | null>(null);
  if (project && project !== last) setLast(project);
  const shown = project ?? last;

  useEffect(() => {
    heroStore.card = ref.current;
    return () => {
      heroStore.card = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      className="desk-card"
      data-open={ready && project !== null}
      data-pinned={pinned}
      aria-hidden={!pinned}
    >
      <div className="desk-card__box">
        {shown && (
          <>
            <p className="font-mono text-[13px] leading-5 text-signal">{shown.status}</p>
            <p className="mt-1 text-xl font-bold leading-7 tracking-tight">{shown.name}</p>
            <p className="mt-1 text-sm leading-5 text-muted">{shown.kind}</p>
            <p className="mt-3 text-sm font-medium leading-5">{shown.fact}</p>
            {pinned && (
              <Link className="link-draw mt-1 text-sm text-accent" href={`/projetos/${shown.slug}`}>
                <span>Ver o caso</span>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function HeroVisual() {
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  // Set when the scene fails after starting; from then on the poster stays.
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  // A click on a desk opens the project page without a full reload.
  useEffect(() => {
    const previous = heroStore.open;
    heroStore.open = (slug) => router.push(`/projetos/${slug}`);
    return () => {
      heroStore.open = previous;
      heroStore.setActive(null);
    };
  }, [router]);

  useEffect(() => {
    if (!canRenderScene()) return;
    return whenIdle(() => setLive(true));
  }, []);

  return (
    <div className="hero__visual" data-ready={ready && !failed}>
      <picture>
        <source media="(min-width: 1024px)" srcSet="/office/poster-desktop.webp" width={2400} height={1500} />
        {/* eslint-disable-next-line @next/next/no-img-element -- art-directed poster, already sized and compressed */}
        <img
          className="hero__poster"
          src="/office/poster-mobile.webp"
          width={1300}
          height={1000}
          alt="Escritório em 3D com quatro mesas, uma para cada projeto em destaque, com os monitores acesos."
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      {live && (
        <div className="hero__canvas" aria-hidden="true">
          <SceneBoundary onError={() => setFailed(true)}>
            <OfficeScene onReady={() => setReady(true)} onLost={() => setFailed(true)} />
          </SceneBoundary>
        </div>
      )}
      <DeskCard ready={ready && !failed} />
    </div>
  );
}
