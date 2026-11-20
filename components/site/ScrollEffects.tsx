"use client";

// Home page only. Motion below the hero, on every device that has not asked for reduced motion:
// content rises into view, the proof numbers count up and, with a mouse, a light follows the
// pointer inside the cards. These use the browser alone (IntersectionObserver, CSS transitions,
// requestAnimationFrame), so phones download nothing extra. Every element is fully visible until
// the script runs, and it only hides what is still below the screen.
// On wide screens, one scroll gesture also drives the page (Lenis) and the hero camera
// (ScrollTrigger feeding heroStore.progress); those load GSAP after the page is idle.
import { useEffect } from "react";
import { heroStore } from "@/lib/hero-store";
import { canRenderScene, prefersReducedMotion, wantsSmoothScroll, whenIdle } from "@/lib/capability";

/** "~1.000" → ["~", 1000, ""], "102/105" → ["", 102, "/105"]. */
function splitCount(text: string): [string, number, string] | null {
  const match = text.match(/^(\D*)([\d.]+)(.*)$/);
  if (!match) return null;
  return [match[1], Number(match[2].replace(/\./g, "")), match[3]];
}

const STAGGER_MS = 70;
const COUNT_MS = 1200;

function revealOnScroll(cleanups: (() => void)[]) {
  const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;

  // Content rises 12px into view, a few pieces at a time. The classes go away once it has
  // arrived, so no style is left behind to fight hover rules.
  const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(below);
  items.forEach((el) => el.classList.add("will-reveal"));
  const revealer = new IntersectionObserver(
    (entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        revealer.unobserve(el);
        el.style.setProperty("--reveal-delay", `${order++ * STAGGER_MS}ms`);
        // Transitions inside the element (a hover, say) bubble up here too: wait for its own.
        const done = (event: TransitionEvent) => {
          if (event.target !== el) return;
          el.removeEventListener("transitionend", done);
          el.classList.remove("will-reveal", "is-in");
          el.style.removeProperty("--reveal-delay");
        };
        el.addEventListener("transitionend", done);
        el.classList.add("is-in");
      }
    },
    { rootMargin: "0px 0px -5% 0px" },
  );
  items.forEach((el) => revealer.observe(el));
  cleanups.push(() => {
    revealer.disconnect();
    items.forEach((el) => {
      el.classList.remove("will-reveal", "is-in");
      el.style.removeProperty("--reveal-delay");
    });
  });

  // The proof numbers count up once, when they come into view.
  const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]")).filter(below);
  const frames = new Set<number>();
  const finals = new Map<HTMLElement, string>();
  const counter = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      counter.unobserve(el);
      const parts = splitCount(finals.get(el) ?? "");
      if (!parts) continue;
      const [before, target, after] = parts;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / COUNT_MS);
        const eased = 1 - (1 - t) * (1 - t);
        el.textContent = `${before}${Math.round(target * eased).toLocaleString("pt-BR")}${after}`;
        if (t < 1) frames.add(requestAnimationFrame(step));
      };
      frames.add(requestAnimationFrame(step));
    }
  });
  counters.forEach((el) => {
    const final = el.textContent ?? "";
    const parts = splitCount(final);
    if (!parts) return;
    finals.set(el, final);
    el.textContent = `${parts[0]}0${parts[2]}`;
    counter.observe(el);
  });
  cleanups.push(() => {
    counter.disconnect();
    frames.forEach((id) => cancelAnimationFrame(id));
    finals.forEach((final, el) => {
      el.textContent = final;
    });
  });
}

function pointerLight(cleanups: (() => void)[]) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  // The light inside a card follows the pointer through two CSS variables.
  const onMove = (event: PointerEvent) => {
    const card = (event.target as Element | null)?.closest<HTMLElement>(".card");
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - box.left}px`);
    card.style.setProperty("--my", `${event.clientY - box.top}px`);
  };
  document.addEventListener("pointermove", onMove, { passive: true });
  cleanups.push(() => document.removeEventListener("pointermove", onMove));
}

/** `driveScroll: false` keeps only the motion below the hero, for a page that runs its own scroll. */
export default function ScrollEffects({ driveScroll = true }: { driveScroll?: boolean }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let disposed = false;
    const cleanups: (() => void)[] = [];
    // Measuring every element forces a layout: wait until the first paint and hydration are done.
    const cancelReveal = whenIdle(() => {
      if (disposed) return;
      revealOnScroll(cleanups);
      pointerLight(cleanups);
    });
    cleanups.push(cancelReveal);

    const scene = driveScroll && canRenderScene();
    const smooth = driveScroll && wantsSmoothScroll();
    const cancel =
      scene || smooth
        ? whenIdle(async () => {
            const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
            if (disposed) return;
            gsap.registerPlugin(ScrollTrigger);

            const hero = document.getElementById("inicio");
            if (scene && hero) {
              const trigger = ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom top",
                onUpdate: (self) => heroStore.setProgress(self.progress),
              });
              cleanups.push(() => trigger.kill());
            }

            if (smooth) {
              const { default: Lenis } = await import("lenis");
              if (disposed) return;
              // A single loop: GSAP's ticker drives Lenis, and Lenis tells ScrollTrigger when it moved.
              const lenis = new Lenis({ autoRaf: false, anchors: true });
              lenis.on("scroll", ScrollTrigger.update);
              const tick = (time: number) => lenis.raf(time * 1000);
              gsap.ticker.add(tick);
              gsap.ticker.lagSmoothing(0);
              cleanups.push(() => {
                gsap.ticker.remove(tick);
                lenis.destroy();
              });
            }
          })
        : () => {};

    return () => {
      disposed = true;
      cancel();
      cleanups.forEach((cleanup) => cleanup());
      heroStore.setProgress(0);
    };
  }, [driveScroll]);

  return null;
}
