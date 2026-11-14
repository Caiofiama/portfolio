// Shared state between the hero's HTML (tabs, card, scroll) and its 3D scene.
// The scene reads `progress` every frame; `active` is the project whose desk is in focus.
import { useSyncExternalStore } from "react";

type Listener = () => void;

let active: string | null = null;
let pinned = false;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((listener) => listener());

export const heroStore = {
  /** 0 at the top of the page, 1 when the hero has scrolled away. */
  progress: 0,
  /** Asks the scene for a new frame; the scene installs it. */
  invalidate: (() => {}) as () => void,
  /** Opens a project page; the hero installs the router version. */
  open: ((slug: string) => window.location.assign(`/projetos/${slug}`)) as (slug: string) => void,
  /** The card element the scene positions above the desk in focus. */
  card: null as HTMLElement | null,

  getActive: () => active,
  isPinned: () => pinned,
  /** `pin` keeps the card open and clickable (touch) until another call clears it. */
  setActive(slug: string | null, pin = false) {
    const nextPinned = slug !== null && pin;
    if (slug === active && nextPinned === pinned) return;
    active = slug;
    pinned = nextPinned;
    emit();
    heroStore.invalidate();
  },
  setProgress(value: number) {
    heroStore.progress = value;
    heroStore.invalidate();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

const noProject = () => null;
const notPinned = () => false;

export function useActiveProject() {
  return useSyncExternalStore(heroStore.subscribe, heroStore.getActive, noProject);
}

export function usePinned() {
  return useSyncExternalStore(heroStore.subscribe, heroStore.isPinned, notPinned);
}
