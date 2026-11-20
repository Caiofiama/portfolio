// The same cards without WebGL, for phones, weak devices and reduced motion: each card is two
// stacked images (front and back) moved with CSS 3D transforms. It takes the same screen-space
// states as the WebGL stage, and the container's perspective matches that stage's camera, so both
// put a card in the same place.
import type { CardState, DrawItem } from "./card-scene";
import { CARD_ASPECT } from "./constants";

export interface Stage {
  resize(vw: number, vh: number, dpr: number): void;
  draw(items: DrawItem[]): void;
  render(): void;
  pick(clientX: number, clientY: number): number;
  dispose(): void;
}

type Slot = { el: HTMLElement; front: HTMLElement; back: HTMLElement; project: number; state: CardState | null };

export class DomStage implements Stage {
  private slots: Slot[] = [];

  constructor(
    private container: HTMLElement,
    private fronts: string[],
    private backs: string[],
    pool: number,
  ) {
    for (let i = 0; i < pool; i++) {
      const el = document.createElement("div");
      el.className = "lab-dom__card";
      const front = document.createElement("div");
      front.className = "lab-dom__face";
      const back = document.createElement("div");
      back.className = "lab-dom__face lab-dom__face--back";
      el.append(front, back);
      el.hidden = true;
      container.appendChild(el);
      this.slots.push({ el, front, back, project: -1, state: null });
    }
  }

  resize(vw: number, vh: number) {
    const d = Math.min(2200, Math.max(1000, 1500 * Math.min(vw / 1440, vh / 900)));
    this.container.style.perspective = `${d}px`;
  }

  draw(items: DrawItem[]) {
    this.slots.forEach((slot, i) => {
      const item = items[i];
      if (!item || item.state.op <= 0.01) {
        slot.el.hidden = true;
        slot.state = null;
        return;
      }
      const { state: st, project } = item;
      // Faces are painted by a pseudo-element (see lab.css), set through a custom property. The back
      // is only fetched once the card turns far enough to show it.
      if (slot.project !== project) {
        slot.project = project;
        slot.front.style.setProperty("--face", `url(${this.fronts[project]})`);
        slot.back.style.removeProperty("--face");
      }
      const turn = ((st.ry % 360) + 360) % 360;
      if (turn > 60 && turn < 300 && !slot.back.style.getPropertyValue("--face")) {
        slot.back.style.setProperty("--face", `url(${this.backs[project]})`);
      }
      const w = st.h / CARD_ASPECT;
      slot.el.hidden = false;
      slot.state = st;
      slot.el.style.width = `${w}px`;
      slot.el.style.height = `${st.h}px`;
      slot.el.style.opacity = String(Math.min(1, st.op));
      slot.el.style.zIndex = String(Math.round(1000 + st.z));
      slot.el.style.transform = `translate3d(${st.x - w / 2}px, ${st.y - st.h / 2}px, ${st.z}px) rotateZ(${st.rz}deg) rotateY(${st.ry}deg) rotateX(${st.rx}deg)`;
    });
  }

  render() {}

  /** The item under a viewport point, nearest first, or -1. */
  pick(clientX: number, clientY: number) {
    let best = -1;
    let bestZ = -Infinity;
    this.slots.forEach((slot, i) => {
      if (!slot.state) return;
      const r = slot.el.getBoundingClientRect();
      const inside = clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
      if (inside && slot.state.z >= bestZ) {
        best = i;
        bestZ = slot.state.z;
      }
    });
    return best;
  }

  dispose() {
    this.container.replaceChildren();
  }
}
