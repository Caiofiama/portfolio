// Decides, in the browser, whether this device gets the live 3D scene or the still poster.

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Small screens, weak or data-saving devices and reduced motion keep the poster. */
export function canRenderScene() {
  if (prefersReducedMotion()) return false;
  if (!window.matchMedia("(min-width: 768px)").matches) return false;
  const hints = navigator as NavigatorHints;
  if (hints.connection?.saveData) return false;
  if (typeof hints.deviceMemory === "number" && hints.deviceMemory < 4) return false;
  if (typeof hints.hardwareConcurrency === "number" && hints.hardwareConcurrency < 4) return false;
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

/** Smooth scrolling only where a wheel or trackpad drives a wide screen. */
export function wantsSmoothScroll() {
  return (
    !prefersReducedMotion() &&
    window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches
  );
}

/** Runs once the browser is idle, so the main content paints first. Returns a cancel function. */
export function whenIdle(run: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(run, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(run, 300);
  return () => clearTimeout(id);
}
