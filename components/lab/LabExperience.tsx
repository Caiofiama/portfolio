"use client";

// Lab: the new design under test.
// Stage 1, the hero: the four featured projects as 3D cards on an arc. Drag, flick, click a card,
// use the arrow button or the arrow keys; the centred project's colour grows out from behind its
// card and its name rises in letter by letter. Clicking the centred card opens its case page.
// Stage 2, "Por dentro": scrolling lifts the selected card out of the arc into a pinned section.
// Each of the four steps (problem, what was built, result, stack) flips it 180°, and at the end the
// project's stack bursts outward once while the card spins.
// Stage 3, "Projetos": the card lands on its own project in the grid and stays there, tilting with
// the grid card under the pointer. The other cards show a flat picture of their 3D card.
// The 3D code (three.js) loads only after the page has painted. Under reduced motion nothing
// floats, flips animate instantly and the stack burst is skipped.
import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionTitle from "@/components/site/SectionTitle";
import { ArrowRight, BarChart3, Download, Layers, Target, Wrench } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import { featuredProjects, type FeaturedProject } from "@/content/projects";
import { person } from "@/content/site";
import { cardFace } from "./constants";
import { themeOf } from "./themes";
import { iconFor } from "./stack-icons";
import { canRenderScene, wantsSmoothScroll } from "@/lib/capability";
import type { CardState, DrawItem } from "./card-scene";
import type { Stage } from "./dom-stage";

const N = featuredProjects.length;
const mod = (j: number) => ((j % N) + N) % N;
const theme = (j: number) => themeOf(featuredProjects[mod(j)].slug);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Arc slots by distance from the centre, in hero units (1 unit = 1px on a 1440 × 900 screen). */
const SLOTS = [
  { dx: 0, dy: 0, h: 440, rz: 0, ry: 0 },
  { dx: 330, dy: 34, h: 340, rz: 5, ry: 18 },
  { dx: 600, dy: 80, h: 300, rz: 10, ry: 30 },
  { dx: 820, dy: 130, h: 270, rz: 14, ry: 38 },
];

/** The four steps of "Por dentro" and the card's angle at each: front, back, front, front again. */
const STEPS = ["O problema", "O que construí", "Resultado", "Stack"];
const STEP_ANGLES = [0, 180, 360, 720];
const STEP_ICONS = [Target, Wrench, BarChart3, Layers];
const STORM_PIECES = 20;

type Layout = { vw: number; vh: number; heroH: number; u: number; cx: number; cy: number; spread: number; phone: boolean };

/** A cubic-bezier easing, solved by bisection. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (a: number, b: number, t: number) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2;
      if (at(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return at(y1, y2, (lo + hi) / 2);
  };
}
const glide = bezier(0.25, 0.75, 0.2, 1);

function arc(k: number, L: Layout, heroTop: number): CardState {
  const a = Math.min(Math.abs(k), 3);
  const i = Math.floor(a);
  const f = a - i;
  const s0 = SLOTS[i];
  const s1 = SLOTS[Math.min(i + 1, 3)];
  const mix = (p: number, q: number) => p + (q - p) * f;
  const sign = k < 0 ? -1 : 1;
  const ak = Math.abs(k);
  return {
    x: L.cx + sign * mix(s0.dx, s1.dx) * L.u * L.spread,
    y: heroTop + L.cy + mix(s0.dy, s1.dy) * L.u,
    h: mix(s0.h, s1.h) * L.u,
    rz: sign * mix(s0.rz, s1.rz),
    ry: sign * mix(s0.ry, s1.ry),
    rx: 0,
    z: -ak * 34 * L.u,
    // Four projects: at rest only three cards show, so no project appears on both sides at once.
    op: ak <= 1.35 ? 1 : ak >= 1.95 ? 0 : 1 - (ak - 1.35) / 0.6,
    shadow: 1,
  };
}

function lerpState(a: CardState, b: CardState, t: number): CardState {
  const m = (p: number, q: number) => p + (q - p) * t;
  return {
    x: m(a.x, b.x),
    y: m(a.y, b.y),
    h: m(a.h, b.h),
    rz: m(a.rz, b.rz),
    ry: m(a.ry, b.ry),
    rx: m(a.rx, b.rx),
    z: m(a.z, b.z),
    op: m(a.op, b.op),
    shadow: m(a.shadow, b.shadow),
  };
}

/** The body text of one step, built from the project's own content. */
function stepBody(project: FeaturedProject, step: number) {
  const box = document.createDocumentFragment();
  const add = <K extends keyof HTMLElementTagNameMap>(tag: K, text: string, parent: Node = box, className?: string) => {
    const el = document.createElement(tag);
    el.textContent = text;
    if (className) el.className = className;
    parent.appendChild(el);
    return el;
  };
  if (step === 0) {
    add("p", project.problem);
  } else if (step === 1) {
    const list = add("ul", "");
    project.built.forEach((item) => add("li", item, list));
  } else if (step === 2) {
    if (project.results.length) {
      const list = add("dl", "");
      project.results.forEach((r) => {
        const row = add("div", "", list);
        add("dt", r.value, row);
        add("dd", r.label, row);
      });
    } else if (project.resultsNote) {
      add("p", project.resultsNote);
    }
  } else {
    const list = add("ul", "", box, "lab-in-chips");
    project.stack.forEach((item) => add("li", item, list));
    const link = document.createElement("a");
    link.className = "lab-in-link link-draw";
    link.href = `/projetos/${project.slug}`;
    add("span", `Ver o caso completo do ${project.name}`, link);
    box.appendChild(link);
  }
  return box;
}

type Tween = { from: number; to: number; start: number; dur: number; ease: (t: number) => number; fired: boolean; dir: number };
type Piece = { el: HTMLElement; a: number; ph: number; spin: number; size: number };

export default function LabExperience() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const caseRef = useRef<HTMLAnchorElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const autoRef = useRef<HTMLButtonElement>(null);
  const domRef = useRef<HTMLDivElement>(null);
  const insideRef = useRef<HTMLElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const cardBoxRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const frontFrameRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLParagraphElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const stormRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const revealEl = revealRef.current;
    const arcEl = arcRef.current;
    const title = titleRef.current;
    const count = countRef.current;
    const caseLink = caseRef.current;
    const next = nextRef.current;
    const auto = autoRef.current;
    const domLayer = domRef.current;
    const inside = insideRef.current;
    const dark = darkRef.current;
    const num = numRef.current;
    const cardBox = cardBoxRef.current;
    const front = frontRef.current;
    const frontFrame = frontFrameRef.current;
    const head = headRef.current;
    const body = bodyRef.current;
    const cap = capRef.current;
    const steps = stepsRef.current;
    const storm = stormRef.current;
    const shop = shopRef.current;
    const grid = gridRef.current;
    if (
      !root || !canvas || !hero || !revealEl || !arcEl || !title || !count || !caseLink || !next || !auto ||
      !domLayer || !inside || !dark || !num || !cardBox || !front || !frontFrame || !head || !body || !cap ||
      !steps || !storm || !shop || !grid
    )
      return;
    const cards = Array.from(grid.querySelectorAll<HTMLAnchorElement>(".lab-card"));
    const slots = cards.map((c) => c.querySelector<HTMLElement>(".lab-pk") as HTMLElement);
    const tilt = cards.map(() => ({ x: 0, y: 0 }));
    let centredStrip = false;
    const stepButtons = Array.from(steps.querySelectorAll<HTMLButtonElement>("button"));
    const heroUi = Array.from(hero.querySelectorAll<HTMLElement>(".lab-title, .lab-count, .lab-next, .lab-auto, .lab-case, .lab-links"));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let disposed = false;
    let raf = 0;
    let stage: Stage | null = null;
    let lenis: { raf: (time: number) => void; scrollTo: (target: number) => void; destroy: () => void } | null = null;
    let sansFont = "system-ui, sans-serif";

    // Hero state. The arc starts at rest: the centred card is already in the page as a picture
    // (the fastest thing to show), and the 3D card takes its place without moving.
    let pos = 0;
    let target = 0;
    let active = 0;
    let tween: Tween | null = null;
    let reveal: { start: number; color: string } | null = null;
    let autoplay = !reduced;
    let autoTurns = 0;
    let lastInteract = performance.now();
    let heroRatio = 1;
    let drawn: number[] = [];
    let hover: { x: number; y: number } | null = null;
    let drag: { id: number; x0: number; pos0: number; active: boolean; lastX: number; lastT: number; v: number } | null = null;

    // "Por dentro" state
    let step = 0;
    let angle = 0;
    let flip: { from: number; to: number; start: number; dur: number } | null = null;
    let swapToken = 0;
    let frontOn: boolean | null = null;
    let stormShown = true;
    const pieces: Piece[] = [];

    const layout = (): Layout => {
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const heroH = hero.clientHeight;
      const phone = vw < 820;
      const u = phone ? Math.min(vw / 560, heroH / 980) : Math.min(vw / 1440, heroH / 900);
      return { vw, vh, heroH, u, cx: vw / 2, cy: phone ? heroH * 0.42 : heroH / 2 - 70 * u, spread: phone ? 1.02 : 1, phone };
    };
    let L = layout();
    const scaleFrames = () => {
      const k = L.phone ? Math.min(L.vw / 390, L.vh / 780) : Math.min(L.vw / 1440, L.vh / 900);
      root.style.setProperty("--k", String(k));
      root.classList.toggle("lab-root--phone", L.phone);
    };
    scaleFrames();

    // ---- Hero title, counter and case link ----
    const measure = document.createElement("canvas").getContext("2d");
    const fitTitle = (name: string) => {
      if (!measure) return;
      measure.font = `700 100px ${sansFont}`;
      if (L.phone) {
        const longest = Math.max(...name.split(" ").map((w) => measure.measureText(w).width));
        const base = Math.min(56, Math.max(36, L.vw * 0.11));
        title.style.fontSize = `${Math.min(base, ((L.vw - 36) * 100) / longest)}px`;
      } else {
        const w = measure.measureText(name).width;
        title.style.fontSize = `${Math.min(64 * L.u, (760 * L.u * 100) / w)}px`;
      }
    };

    const buildLayer = (name: string) => {
      const layer = document.createElement("span");
      layer.className = "lab-title__layer";
      name.split(" ").forEach((word, wi) => {
        if (wi) layer.append(" ");
        const w = document.createElement("span");
        w.className = "lab-word";
        for (const ch of word) {
          const c = document.createElement("span");
          c.className = "lab-ch";
          c.textContent = ch;
          w.append(c);
        }
        layer.append(w);
      });
      return layer;
    };

    const setTitle = (name: string, dir: number, animate: boolean) => {
      fitTitle(name);
      const old = title.querySelector<HTMLElement>(".lab-title__layer:last-of-type");
      const layer = buildLayer(name);
      title.setAttribute("aria-label", name);
      title.append(layer);
      if (!animate || !old) {
        title.querySelectorAll(".lab-title__layer").forEach((el) => el !== layer && el.remove());
        return;
      }
      const oldChars = old.querySelectorAll<HTMLElement>(".lab-ch");
      oldChars.forEach((c, i) =>
        c.animate(
          [{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${-110 * dir}%)`, opacity: 0 }],
          { duration: 300, easing: "cubic-bezier(.45,0,.75,.3)", delay: i * 11, fill: "forwards" },
        ),
      );
      window.setTimeout(() => old.remove(), 300 + oldChars.length * 11 + 40);
      layer.querySelectorAll<HTMLElement>(".lab-ch").forEach((c, i) =>
        c.animate(
          [{ transform: `translateY(${110 * dir}%)`, opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          { duration: 620, easing: "cubic-bezier(.22,1,.36,1)", delay: 120 + i * 22, fill: "backwards" },
        ),
      );
    };

    /** Drift up and fade, swap, then rise from below and fade in. */
    const crossfade = (els: HTMLElement[], write: () => void, outMs: number, inMs: number, gap: number) => {
      const token = ++swapToken;
      if (reduced) {
        write();
        return;
      }
      els.forEach((el) =>
        el.animate([{ translate: "0 0", opacity: 1 }, { translate: "0 -10px", opacity: 0 }], {
          duration: outMs,
          easing: "cubic-bezier(.5,0,.75,0)",
          fill: "forwards",
        }),
      );
      window.setTimeout(() => {
        if (token !== swapToken) return;
        write();
        els.forEach((el) =>
          el.animate([{ translate: "0 14px", opacity: 0 }, { translate: "0 0", opacity: 1 }], {
            duration: inMs,
            easing: "cubic-bezier(.22,1,.36,1)",
            fill: "forwards",
          }),
        );
      }, outMs + gap);
    };

    const setCount = (n: number, animate: boolean) => {
      const text = String(n + 1).padStart(2, "0");
      if (!animate) {
        count.textContent = text;
        return;
      }
      count
        .animate([{ translate: "0 0", opacity: 1 }, { translate: "0 -10px", opacity: 0 }], {
          duration: 220,
          easing: "cubic-bezier(.5,0,.75,0)",
          fill: "forwards",
        })
        .finished.then(() => {
          window.setTimeout(() => {
            count.textContent = text;
            count.animate([{ translate: "0 14px", opacity: 0 }, { translate: "0 0", opacity: 1 }], {
              duration: 380,
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "forwards",
            });
          }, 60);
        })
        .catch(() => undefined);
    };

    // ---- "Por dentro" text and stack burst ----
    const writeStep = (s: number) => {
      const project = featuredProjects[active];
      num.textContent = `0${s + 1}`;
      head.textContent = s === 3 ? project.name : STEPS[s];
      head.classList.toggle("lab-in-head--name", s === 3);
      body.replaceChildren(stepBody(project, s));
      if (frontOn === false) body.querySelectorAll("a").forEach((a) => (a.tabIndex = -1));
      cap.textContent = `${s + 1} de 4 · ${STEPS[s]}`;
      stepButtons.forEach((b, i) => b.setAttribute("aria-current", i === s ? "step" : "false"));
    };

    const fillStorm = () => {
      const stack = featuredProjects[active].stack;
      pieces.forEach((piece, i) => {
        const item = stack[i % stack.length];
        const icon = iconFor(item);
        piece.el.className = icon ? "lab-piece lab-piece--icon" : "lab-piece lab-piece--chip";
        piece.el.textContent = icon ? "" : item;
        piece.el.style.setProperty("--icon", icon ? `url(${icon})` : "none");
      });
    };

    const buildStorm = () => {
      // A fixed seed, so the burst looks the same on every visit.
      let seed = 7;
      const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
      for (let i = 0; i < STORM_PIECES; i++) {
        const el = document.createElement("span");
        el.setAttribute("aria-hidden", "true");
        storm.appendChild(el);
        pieces.push({
          el,
          a: rand() * Math.PI * 2,
          ph: i / STORM_PIECES + rand() * 0.03,
          spin: (rand() < 0.5 ? -1 : 1) * 360 * (0.5 + rand() * 0.5),
          size: 0.7 + rand() * 0.7,
        });
      }
      fillStorm();
    };

    const goStep = (s: number) => {
      step = s;
      const to = STEP_ANGLES[s];
      if (reduced) {
        angle = to;
        flip = null;
        writeStep(s);
        return;
      }
      const halfTurns = Math.min(2, Math.max(0.4, Math.abs(to - angle) / 180));
      const dur = 720 * halfTurns;
      flip = { from: angle, to, start: performance.now(), dur };
      window.setTimeout(() => crossfade([head, body, num, cap], () => writeStep(s), 240, 460, 40), 0.38 * Math.min(dur, 720));
    };

    // ---- Changing project ----
    /** The selected project's grid card hides its flat picture: the 3D card lands there instead. */
    const setLive = () => cards.forEach((c, i) => c.classList.toggle("live", Boolean(stage) && i === active));

    const finishReveal = () => {
      if (!reveal) return;
      root.style.setProperty("--flav", reveal.color);
      revealEl.style.background = "transparent";
      revealEl.style.maskImage = revealEl.style.webkitMaskImage = "";
      reveal = null;
    };

    const change = (idx: number, dir: number) => {
      if (idx === active) return;
      active = idx;
      const project = featuredProjects[idx];
      const color = themeOf(project.slug).bg;
      if (reduced) {
        root.style.setProperty("--flav", color);
      } else {
        finishReveal();
        reveal = { start: performance.now(), color };
        revealEl.style.background = color;
        revealEl.style.maskImage = revealEl.style.webkitMaskImage = "radial-gradient(circle, #000 0, transparent 0)";
      }
      setTitle(project.name, dir, !reduced);
      setCount(idx, !reduced);
      caseLink.href = `/projetos/${project.slug}`;
      caseLink.setAttribute("aria-label", `Ver o caso: ${project.name}`);
      crossfade([head, body], () => writeStep(step), 240, 460, 40);
      fillStorm();
      setLive();
    };

    const goTo = (to: number, dur?: number, immediate = false) => {
      const d = dur ?? 650 + 160 * Math.max(0, Math.abs(to - target) - 1);
      const dir = to >= pos ? 1 : -1;
      target = to;
      if (reduced) {
        pos = to;
        tween = null;
        change(mod(to), dir);
        return;
      }
      tween = { from: pos, to, start: performance.now(), dur: d, ease: glide, fired: immediate, dir };
      if (immediate) change(mod(to), dir);
    };

    // ---- Frame loop ----
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      lenis?.raf(now);
      // Every measurement first, before any style is written: one layout per frame.
      const sec = inside.getBoundingClientRect();
      const heroTop = hero.getBoundingClientRect().top;
      const shopBox = shop.getBoundingClientRect();
      const box = cardBox.getBoundingClientRect();
      const slot = slots[mod(target)].getBoundingClientRect();
      if (tween) {
        const t = Math.min(1, (now - tween.start) / tween.dur);
        pos = tween.from + (tween.to - tween.from) * tween.ease(t);
        if (!tween.fired && t >= 0.12) {
          tween.fired = true;
          change(mod(tween.to), tween.dir);
        }
        if (t >= 1) tween = null;
      }
      if (reveal) {
        const t = Math.min(1, (now - reveal.start) / 420);
        const far = Math.max(
          Math.hypot(L.cx, L.cy),
          Math.hypot(L.vw - L.cx, L.cy),
          Math.hypot(L.cx, L.heroH - L.cy),
          Math.hypot(L.vw - L.cx, L.heroH - L.cy),
        );
        const r = 1.45 * far * glide(t);
        const f = Math.max(60, 0.35 * r);
        const mask = `radial-gradient(circle at ${L.cx}px ${L.cy}px, #000 ${Math.max(0, r - f)}px, transparent ${r}px)`;
        revealEl.style.maskImage = revealEl.style.webkitMaskImage = mask;
        if (t >= 1) finishReveal();
      }
      // The first automatic turn waits 6 s, so the page settles before anything changes.
      const wait = autoTurns === 0 ? 6000 : 3200;
      if (autoplay && !drag?.active && !tween && now - lastInteract > wait && heroRatio >= 0.6 && !document.hidden) {
        autoTurns++;
        lastInteract = now;
        goTo(target + 1);
      }

      // Scroll through "Por dentro": which step, how far into the stack burst.
      const span = Math.max(1, sec.height - L.vh);
      const p = clamp01(-sec.top / span);
      const q = clamp01((p - 0.76) / 0.24);
      const s = Math.floor(Math.min(p, 0.759) / 0.19);
      if (s !== step) goStep(s);
      if (flip) {
        const t = Math.min(1, (now - flip.start) / flip.dur);
        angle = flip.from + (flip.to - flip.from) * (-(Math.cos(Math.PI * t) - 1) / 2);
        if (t >= 1) flip = null;
      }

      // The front layer copies the pinned section's movement, above the canvas.
      const visible = sec.top < L.vh && sec.bottom > 0;
      const pinY = sec.top > 0 ? sec.top : sec.bottom < L.vh ? sec.bottom - L.vh : 0;
      // Off screen it only fades out, so screen readers can still reach its text.
      if (frontOn !== visible) {
        frontOn = visible;
        front.classList.toggle("lab-front--off", !visible);
        // Its buttons and link leave the tab order while the section is off screen.
        front.querySelectorAll<HTMLElement>("button, a").forEach((el) => (el.tabIndex = visible ? 0 : -1));
      }
      front.style.transform = `translateY(${pinY}px)`;
      const fade = String(1 - clamp01(4 * q));
      frontFrame.style.opacity = fade;
      num.style.opacity = fade;
      dark.style.opacity = String(clamp01(3.5 * q) * 0.42);

      const R = 0.55 * Math.hypot(L.vw, L.vh);
      const base = 0.085 * Math.min(L.vw, L.vh);
      const stormLive = !reduced && visible && q > 0 && q < 1;
      // Outside the burst, the pieces are written once to hide them and then left alone.
      if (stormLive || stormShown) for (const piece of pieces) {
        const sp = clamp01((q - 0.45 * piece.ph) / 0.55);
        if (reduced || !visible || q <= 0 || q >= 1 || sp <= 0 || sp >= 1) {
          piece.el.style.opacity = "0";
          continue;
        }
        const radius = (0.06 + Math.pow(sp, 1.5) * 0.95) * R;
        const x = L.vw / 2 + Math.cos(piece.a) * radius;
        const y = L.vh / 2 + Math.sin(piece.a) * radius * 0.8;
        const scale = ((0.2 + 1.7 * sp) * piece.size * base) / 64;
        piece.el.style.opacity = String(Math.sin(Math.PI * sp) * clamp01(5 * q) * clamp01(6 * (1 - q)));
        piece.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale}) rotate(${piece.spin * sp}deg)`;
      }
      stormShown = stormLive;

      if (!stage) return;

      // Cards: the arc, then the selected card (the traveller) on its way into "Por dentro".
      const heroVisible = heroTop < L.vh && heroTop + L.heroH > 0;
      const p1 = clamp01(1 - sec.top / L.vh);
      // The hero's words and buttons step aside while the card travels up through them.
      const heroFade = String(1 - clamp01(2.2 * p1));
      if (heroUi[0].style.opacity !== heroFade) heroUi.forEach((el) => (el.style.opacity = heroFade));
      const items: DrawItem[] = [];
      drawn = [];
      const floatAt = (state: CardState, j: number) => {
        if (reduced) return state;
        const b = Math.sin((now / 4600) * Math.PI * 2 + 1.37 * j);
        state.y -= (0.5 * b + 0.5) * 9 * L.u;
        state.rz += 0.4 * b;
        return state;
      };
      if (heroVisible) {
        const others = 1 - clamp01(1.6 * p1);
        for (let j = Math.floor(pos) - 3; j <= Math.floor(pos) + 4; j++) {
          const k = j - pos;
          if (j === target || Math.abs(k) > 1.95) continue;
          const state = floatAt(arc(k, L, heroTop), j);
          state.op *= others;
          items.push({ project: mod(j), state });
          drawn.push(j);
        }
      }
      const shopVisible = shopBox.top < L.vh && shopBox.bottom > 0;
      const p3 = clamp01((L.vh - shopBox.top) / (0.7 * L.vh));
      if (p3 > 0 && L.phone && !centredStrip) {
        // On phones the grid is a sideways strip: bring the selected card to the middle once.
        centredStrip = true;
        const card = cards[active].parentElement as HTMLElement;
        grid.scrollTo({ left: card.offsetLeft - (grid.clientWidth - card.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
      }
      if (heroVisible || visible || shopVisible) {
        let state = floatAt(arc(target - pos, L, heroTop), target);
        if (p1 > 0) {
          const bob = reduced ? 0 : Math.sin((now / 2600) * Math.PI * 2) * 6;
          const inSection: CardState = {
            x: box.left + box.width / 2,
            y: box.top + box.height / 2 + bob,
            h: box.height,
            rz: 8,
            ry: angle + (reduced ? 0 : 720 * q),
            rx: 0,
            z: 0,
            op: 1,
            shadow: 1,
          };
          state = lerpState(state, inSection, easeInOut(p1));
        }
        if (p3 > 0) {
          const t = tilt[mod(target)];
          const onCard: CardState = {
            x: slot.left + slot.width / 2,
            y: slot.top + slot.height / 2,
            h: slot.height,
            rz: 0,
            ry: Math.round(state.ry / 360) * 360 + t.x * 14,
            rx: -t.y * 14,
            z: 30,
            op: 1,
            shadow: 0.7,
          };
          state = lerpState(state, onCard, easeInOut(p3));
        }
        items.push({ project: mod(target), state });
        drawn.push(target);
      }
      stage.draw(items);
      stage.render();

      if (hover && finePointer && !drag?.active) {
        const hit = stage.pick(hover.x, hover.y);
        arcEl.style.cursor = hit >= 0 ? "pointer" : "";
        hover = null;
      }
    };

    // ---- Pointer on the arc: drag, flick and tap ----
    const slotPx = () => 330 * L.u * L.spread;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag = { id: e.pointerId, x0: e.clientX, pos0: pos, active: false, lastX: e.clientX, lastT: performance.now(), v: 0 };
      lastInteract = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) {
        if (e.pointerType === "mouse") hover = { x: e.clientX, y: e.clientY };
        return;
      }
      const now = performance.now();
      if (!drag.active) {
        if (Math.abs(e.clientX - drag.x0) <= 6) return;
        drag.active = true;
        drag.x0 = e.clientX;
        drag.pos0 = pos;
        tween = null;
        arcEl.setPointerCapture(e.pointerId);
        document.body.classList.add("lab-dragging");
      }
      pos = drag.pos0 - (e.clientX - drag.x0) / slotPx();
      const dt = now - drag.lastT;
      if (dt > 0) {
        const instant = -(e.clientX - drag.lastX) / slotPx() / dt;
        drag.v += (instant - drag.v) * 0.4;
      }
      drag.lastX = e.clientX;
      drag.lastT = now;
      lastInteract = now;
    };
    const release = (e: PointerEvent, cancelled: boolean) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      document.body.classList.remove("lab-dragging");
      lastInteract = performance.now();
      if (d.active) {
        if (cancelled && Math.abs(pos - Math.round(pos)) <= 0.02) return;
        const to = Math.round(pos + Math.max(-2, Math.min(2, d.v * 220)));
        goTo(to, Math.max(380, 650 * Math.min(1, Math.abs(to - pos) + 0.35)), true);
        return;
      }
      if (cancelled || !stage) return;
      const hit = stage.pick(e.clientX, e.clientY);
      if (hit < 0) return;
      const j = drawn[hit];
      if (j === target && !tween) router.push(`/projetos/${featuredProjects[mod(j)].slug}`);
      else goTo(j);
    };
    const onUp = (e: PointerEvent) => release(e, false);
    const onCancel = (e: PointerEvent) => release(e, true);
    arcEl.addEventListener("pointerdown", onDown);
    arcEl.addEventListener("pointermove", onMove);
    arcEl.addEventListener("pointerup", onUp);
    arcEl.addEventListener("pointercancel", onCancel);

    // ---- Buttons and keys ----
    const onNext = () => {
      lastInteract = performance.now();
      goTo(target + 1);
    };
    const setAuto = (on: boolean) => {
      autoplay = on;
      auto.setAttribute("aria-pressed", String(on));
      lastInteract = performance.now();
    };
    const onAuto = () => setAuto(!autoplay);
    const onKey = (e: KeyboardEvent) => {
      if (heroRatio < 0.5 || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        lastInteract = performance.now();
        goTo(target + (e.key === "ArrowRight" ? 1 : -1));
      }
    };
    // A step button scrolls to the middle of its step.
    const onStep = (e: Event) => {
      const i = stepButtons.indexOf(e.currentTarget as HTMLButtonElement);
      const span = inside.offsetHeight - window.innerHeight;
      const top = inside.getBoundingClientRect().top + window.scrollY + (i + 0.5) * 0.19 * span;
      if (lenis) lenis.scrollTo(top);
      else window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    };
    next.addEventListener("click", onNext);
    auto.addEventListener("click", onAuto);
    window.addEventListener("keydown", onKey);
    stepButtons.forEach((b) => b.addEventListener("click", onStep));
    setAuto(autoplay);

    // Grid cards tilt toward a mouse pointer; the landed 3D card tilts with its own.
    const onTilt = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduced) return;
      const card = e.currentTarget as HTMLAnchorElement;
      const i = cards.indexOf(card);
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt[i] = { x, y };
      card.style.transform = `translateY(-8px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
    };
    const onUntilt = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLAnchorElement;
      tilt[cards.indexOf(card)] = { x: 0, y: 0 };
      card.style.transform = "";
    };
    if (finePointer) {
      cards.forEach((c) => {
        c.addEventListener("pointermove", onTilt);
        c.addEventListener("pointerleave", onUntilt);
      });
    }

    const observer = new IntersectionObserver(([entry]) => (heroRatio = entry.intersectionRatio), {
      threshold: [0, 0.25, 0.5, 0.6, 0.75, 1],
    });
    observer.observe(hero);

    const onResize = () => {
      L = layout();
      scaleFrames();
      stage?.resize(L.vw, L.vh, Math.min(window.devicePixelRatio || 1, L.phone ? 1.75 : 2));
      fitTitle(featuredProjects[active].name);
    };
    window.addEventListener("resize", onResize);

    // ---- First paint: text, colour, then the 3D scene ----
    root.style.setProperty("--flav", theme(0).bg);
    title.textContent = "";
    setTitle(featuredProjects[0].name, 1, false);
    setCount(0, false);
    writeStep(0);
    buildStorm();
    raf = requestAnimationFrame(frame);

    // The title's size depends on the site font: measure again once it has loaded.
    sansFont = getComputedStyle(document.body).getPropertyValue("--font-sans").trim() || sansFont;
    void document.fonts.ready.then(() => !disposed && fitTitle(featuredProjects[active].name));

    void (async () => {
      // The card faces are pre-rendered files (public/lab), not drawn here.
      const frontUrls = featuredProjects.map((p) => cardFace(p.slug, "front"));
      const backUrls = featuredProjects.map((p) => cardFace(p.slug, "back"));

      // WebGL on capable wide screens; CSS 3D cards on phones, weak devices and reduced motion.
      const domModule = await import("./dom-stage");
      if (disposed) return;
      const startDomStage = () => {
        stage = new domModule.DomStage(domLayer, frontUrls, backUrls, 9);
        domLayer.hidden = false;
      };
      // No test context here: the scene's own renderer is the test, and the CSS cards take over if
      // it fails.
      if (canRenderScene({ probe: false }) && L.vw >= 820) {
        let scene: import("./card-scene").CardStage | null = null;
        try {
          const load = (src: string) => {
            const img = new Image();
            img.src = src;
            return img.decode().then(() => img);
          };
          const [{ CardStage }, fronts, backs] = await Promise.all([
            import("./card-scene"),
            Promise.all(frontUrls.map(load)),
            Promise.all(backUrls.map(load)),
          ]);
          if (disposed) return;
          // The poster stays on screen until the scene is fully built.
          scene = new CardStage(canvas, fronts, backs, 9);
          if (!(await scene.prepare(() => disposed))) {
            scene.dispose();
            return;
          }
          stage = scene;
        } catch {
          scene?.dispose();
          startDomStage();
        }
      } else {
        startDomStage();
      }
      onResize();
      setLive();
      root.dataset.stage = stage instanceof domModule.DomStage ? "dom" : "webgl";

      // Smooth scrolling where a wheel or trackpad drives a wide screen, as on the home page.
      if (wantsSmoothScroll()) {
        const { default: Lenis } = await import("lenis");
        if (disposed) return;
        lenis = new Lenis({ autoRaf: false, anchors: true });
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      arcEl.removeEventListener("pointerdown", onDown);
      arcEl.removeEventListener("pointermove", onMove);
      arcEl.removeEventListener("pointerup", onUp);
      arcEl.removeEventListener("pointercancel", onCancel);
      next.removeEventListener("click", onNext);
      auto.removeEventListener("click", onAuto);
      window.removeEventListener("keydown", onKey);
      stepButtons.forEach((b) => b.removeEventListener("click", onStep));
      cards.forEach((c) => {
        c.removeEventListener("pointermove", onTilt);
        c.removeEventListener("pointerleave", onUntilt);
      });
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("lab-dragging");
      storm.replaceChildren();
      lenis?.destroy();
      stage?.dispose();
    };
  }, [router]);

  const first = featuredProjects[0];
  return (
    <div ref={rootRef} className="lab-root">
      <canvas ref={canvasRef} className="lab-canvas" aria-hidden="true" />
      <div ref={domRef} className="lab-dom" aria-hidden="true" hidden />

      <section ref={heroRef} className="lab-hero" aria-label="Início">
        <div ref={revealRef} className="lab-reveal" aria-hidden="true" />
        <div className="lab-rings" aria-hidden="true" />
        {/* The centred card as a plain picture: painted first, then replaced by the 3D card. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lab-poster" src={cardFace(first.slug, "front")} alt="" width={360} height={576} fetchPriority="high" decoding="async" />
        <div ref={arcRef} className="lab-arc" aria-hidden="true" />

        <div className="lab-intro">
          <h1 className="lab-intro__name">{person.name}</h1>
          <p className="lab-intro__role">
            {person.role} no {person.city}
          </p>
        </div>

        <span ref={countRef} className="lab-count" aria-hidden="true">
          01
        </span>
        <button ref={nextRef} type="button" className="lab-next" aria-label="Próximo projeto">
          <ArrowRight size={20} strokeWidth={1.9} aria-hidden="true" />
        </button>
        <button ref={autoRef} type="button" className="lab-auto" aria-pressed="true">
          <span className="lab-auto__ring" aria-hidden="true">
            <span className="lab-auto__pause" />
            <span className="lab-auto__play" />
          </span>
          Automático
        </button>

        <p ref={titleRef} className="lab-title" aria-live="polite">
          {first.name}
        </p>
        <a ref={caseRef} className="lab-case link-draw" href={`/projetos/${first.slug}`} aria-label={`Ver o caso: ${first.name}`}>
          <span>Ver o caso</span>
          <ArrowRight size={16} aria-hidden="true" />
        </a>

        <ul className="lab-links">
          <li>
            <a className="link-draw" href={person.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedinIcon size={16} />
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a className="link-draw" href={person.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon size={16} />
              <span>GitHub</span>
            </a>
          </li>
          <li>
            <a className="link-draw" href={person.resume} download>
              <Download size={16} aria-hidden="true" />
              <span>Baixar currículo</span>
            </a>
          </li>
        </ul>
      </section>

      {/* Pinned section. Its back layer (step number, card slot) sits under the 3D canvas. */}
      <section ref={insideRef} id="por-dentro" className="lab-inside" aria-labelledby="por-dentro-titulo">
        <div className="lab-pin">
          <div ref={darkRef} className="lab-dark" aria-hidden="true" />
          <div className="lab-frame" aria-hidden="true">
            <span ref={numRef} className="lab-in-num">
              01
            </span>
            <div ref={cardBoxRef} className="lab-in-card" />
          </div>
        </div>
      </section>

      {/* Its front layer: fixed above the canvas, moved each frame to follow the pinned section. */}
      <div ref={frontRef} className="lab-front">
        <div ref={frontFrameRef} className="lab-frame">
          <h2 id="por-dentro-titulo" ref={headRef} className="lab-in-head">
            {STEPS[0]}
          </h2>
          <div ref={bodyRef} className="lab-in-body" />
          <div ref={stepsRef} className="lab-in-steps">
            {STEPS.map((label, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <button key={label} type="button" aria-label={`Passo ${i + 1}: ${label}`} aria-current={i === 0 ? "step" : "false"}>
                  <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <p ref={capRef} className="lab-in-cap" />
        </div>
        <div ref={stormRef} className="lab-storm" />
      </div>

      {/* The grid where the travelling card lands on its own project. */}
      <section ref={shopRef} id="projetos" className="lab-shop section">
        <div className="wrap">
          <SectionTitle label="Projetos em destaque" title="Dois produtos no ar e dois códigos abertos." />
          <ul ref={gridRef} className="lab-grid">
            {featuredProjects.map((project) => {
              const t = themeOf(project.slug);
              return (
                <li key={project.slug}>
                  <Link
                    href={`/projetos/${project.slug}`}
                    className="lab-card"
                    style={{ "--card-bg": t.bg, "--card-accent": t.accent } as CSSProperties}
                  >
                    <span className="lab-card__status">{project.status}</span>
                    <span className="lab-card__name">{project.name}</span>
                    <span className="lab-card__kind">{project.kind}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="lab-pk" src={cardFace(project.slug, "front")} alt="" width={180} height={288} loading="lazy" decoding="async" />
                    <span className="lab-card__go">
                      Ver o caso
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
