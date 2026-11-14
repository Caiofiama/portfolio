"use client";

// Home page only. One scroll gesture drives two things: the page (Lenis, on wide screens with a
// mouse or trackpad) and the hero camera (ScrollTrigger feeding heroStore.progress).
// Both load after the page is idle, and neither loads under reduced motion.
import { useEffect } from "react";
import { heroStore } from "@/lib/hero-store";
import { canRenderScene, wantsSmoothScroll, whenIdle } from "@/lib/capability";

export default function ScrollEffects() {
  useEffect(() => {
    const scene = canRenderScene();
    const smooth = wantsSmoothScroll();
    if (!scene && !smooth) return;

    let disposed = false;
    const cleanups: (() => void)[] = [];

    const cancel = whenIdle(async () => {
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
    });

    return () => {
      disposed = true;
      cancel();
      cleanups.forEach((cleanup) => cleanup());
      heroStore.setProgress(0);
    };
  }, []);

  return null;
}
