// Draws each project's 3D card faces on a canvas: the front shows the real product (its screen, or
// the real code excerpt for projects with no screen), the back is a fact sheet with the real
// numbers and stack. Every word comes from content/projects.ts.
import type { FeaturedProject } from "@/content/projects";
import type { LabTheme } from "./themes";

import { CARD_ASPECT } from "./constants";
const W = 720;
const H = Math.round(W * CARD_ASPECT);
const PAD = 56;

export type Fonts = { sans: string; mono: string };

/** The site's own fonts, as next/font names them. */
export function readFonts(): Fonts {
  const style = getComputedStyle(document.body);
  return {
    sans: style.getPropertyValue("--font-sans").trim() || "system-ui, sans-serif",
    mono: style.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace",
  };
}

export async function loadFonts(fonts: Fonts) {
  await Promise.all([
    document.fonts.load(`700 40px ${fonts.sans}`),
    document.fonts.load(`400 24px ${fonts.sans}`),
    document.fonts.load(`400 20px ${fonts.mono}`),
  ]).catch(() => undefined);
}

export async function loadImage(src: string): Promise<HTMLImageElement | null> {
  const img = new Image();
  img.src = src;
  try {
    await img.decode();
    return img;
  } catch {
    return null;
  }
}

function alpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > max) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** As many items as fit on one line, joined by a dot. */
function fitList(ctx: CanvasRenderingContext2D, items: string[], max: number) {
  let out = "";
  for (const item of items) {
    const next = out ? `${out} · ${item}` : item;
    if (ctx.measureText(next).width > max) break;
    out = next;
  }
  return out;
}

/** The card shape: rounded corners stay transparent, so the 3D card follows them. */
function base(theme: LabTheme): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d canvas unavailable");
  const fill = ctx.createLinearGradient(0, 0, 0, H);
  fill.addColorStop(0, theme.cardTop);
  fill.addColorStop(1, theme.cardBottom);
  ctx.beginPath();
  ctx.roundRect(3, 3, W - 6, H - 6, 44);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const glow = ctx.createRadialGradient(W * 0.18, 0, 0, W * 0.18, 0, W);
  glow.addColorStop(0, alpha(theme.accent, 0.16));
  glow.addColorStop(1, alpha(theme.accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  ctx.lineWidth = 3;
  ctx.strokeStyle = theme.line;
  ctx.stroke();
  return [canvas, ctx];
}

function label(ctx: CanvasRenderingContext2D, theme: LabTheme, fonts: Fonts, text: string) {
  ctx.fillStyle = theme.accent;
  ctx.beginPath();
  ctx.arc(PAD + 6, 88, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `400 22px ${fonts.mono}`;
  ctx.fillText(text, PAD + 22, 96);
}

// Comments, strings, a few keywords and HTTP status lines, as in the site's code frames.
const TOKEN = /(\/\/.*$|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'[^']*'|`[^`]*`)|\b(POST|GET|PATCH|PUT|DELETE|await|try|catch)\b|^(\d{3} [A-Z][a-z]+)/g;

function drawCode(ctx: CanvasRenderingContext2D, code: string, x: number, y: number, fonts: Fonts, theme: LabTheme) {
  const colors = ["#8a8a94", theme.accent, theme.ink, "#ff7a45"];
  code.split("\n").forEach((line, row) => {
    let cx = x;
    const cy = y + row * 26;
    const put = (text: string, color: string, bold = false) => {
      ctx.font = `${bold ? 700 : 400} 18px ${fonts.mono}`;
      ctx.fillStyle = color;
      ctx.fillText(text, cx, cy);
      cx += ctx.measureText(text).width;
    };
    let last = 0;
    for (const match of line.matchAll(TOKEN)) {
      const at = match.index ?? 0;
      if (at > last) put(line.slice(last, at), theme.ink);
      const group = match.slice(1).findIndex((part) => part !== undefined);
      put(match[0], colors[group], group >= 2);
      last = at + match[0].length;
    }
    if (last < line.length) put(line.slice(last), theme.ink);
  });
}

export function drawFront(project: FeaturedProject, theme: LabTheme, fonts: Fonts, image: HTMLImageElement | null) {
  const [canvas, ctx] = base(theme);
  label(ctx, theme, fonts, project.status);

  ctx.fillStyle = theme.ink;
  ctx.font = `700 64px ${fonts.sans}`;
  ctx.fillText(project.name, PAD, 176);
  ctx.fillStyle = theme.soft;
  ctx.font = `400 26px ${fonts.sans}`;
  wrap(ctx, project.kind, W - PAD * 2)
    .slice(0, 2)
    .forEach((line, i) => ctx.fillText(line, PAD, 222 + i * 34));

  // The product itself: its screen, or the real code excerpt.
  const vx = 36;
  const vy = 280;
  const vw = W - 72;
  const vh = Math.round(vw * 0.625);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(vx, vy, vw, vh, 22);
  ctx.clip();
  if (image) {
    const scale = Math.max(vw / image.naturalWidth, vh / image.naturalHeight);
    const iw = image.naturalWidth * scale;
    const ih = image.naturalHeight * scale;
    ctx.drawImage(image, vx + (vw - iw) / 2, vy, iw, ih);
  } else if (project.snippet) {
    ctx.fillStyle = "#0c0c0e";
    ctx.fillRect(vx, vy, vw, vh);
    ctx.fillStyle = "#ff7a45";
    ctx.beginPath();
    ctx.arc(vx + 30, vy + 30, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9d9da8";
    ctx.font = `400 17px ${fonts.mono}`;
    ctx.fillText(project.snippet.source, vx + 46, vy + 36);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(vx, vy + 58, vw, 2);
    drawCode(ctx, project.snippet.code, vx + 28, vy + 96, fonts, theme);
  }
  ctx.restore();
  ctx.strokeStyle = alpha(theme.ink, 0.12);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(vx, vy, vw, vh, 22);
  ctx.stroke();

  const fy = vy + vh + 84;
  ctx.fillStyle = theme.ink;
  let size = 44;
  do {
    ctx.font = `700 ${size}px ${fonts.sans}`;
  } while (ctx.measureText(project.fact).width > W - PAD * 2 && --size > 24);
  ctx.fillText(project.fact, PAD, fy);
  ctx.fillStyle = theme.soft;
  ctx.font = `400 25px ${fonts.sans}`;
  wrap(ctx, project.summary, W - PAD * 2)
    .slice(0, 4)
    .forEach((line, i) => ctx.fillText(line, PAD, fy + 52 + i * 36));

  ctx.fillStyle = alpha(theme.ink, 0.14);
  ctx.fillRect(PAD, H - 110, W - PAD * 2, 2);
  ctx.fillStyle = theme.soft;
  ctx.font = `400 20px ${fonts.mono}`;
  ctx.fillText(fitList(ctx, project.stack, W - PAD * 2), PAD, H - 62);
  return canvas;
}

export function drawBack(project: FeaturedProject, theme: LabTheme, fonts: Fonts) {
  const [canvas, ctx] = base(theme);
  label(ctx, theme, fonts, "FICHA TÉCNICA");
  ctx.fillStyle = theme.ink;
  ctx.font = `700 54px ${fonts.sans}`;
  ctx.fillText(project.name, PAD, 168);

  let y = 236;
  if (project.results.length) {
    for (const result of project.results) {
      ctx.fillStyle = theme.ink;
      ctx.font = `700 52px ${fonts.sans}`;
      ctx.fillText(result.value, PAD, y + 50);
      ctx.fillStyle = theme.soft;
      ctx.font = `400 23px ${fonts.sans}`;
      const lines = wrap(ctx, result.label, W - PAD * 2).slice(0, 3);
      lines.forEach((line, i) => ctx.fillText(line, PAD, y + 90 + i * 32));
      y += 90 + lines.length * 32 + 30;
    }
  } else if (project.resultsNote) {
    ctx.fillStyle = theme.ink;
    ctx.font = `700 40px ${fonts.sans}`;
    ctx.fillText(project.resultsTitle, PAD, y + 44);
    ctx.fillStyle = theme.soft;
    ctx.font = `400 25px ${fonts.sans}`;
    const lines = wrap(ctx, project.resultsNote, W - PAD * 2).slice(0, 7);
    lines.forEach((line, i) => ctx.fillText(line, PAD, y + 96 + i * 36));
    y += 96 + lines.length * 36 + 20;
  }

  // Stack chips, as many rows as fit above the footer.
  let row = Math.max(y + 10, H - 340);
  ctx.fillStyle = theme.accent;
  ctx.font = `400 20px ${fonts.mono}`;
  ctx.fillText("STACK", PAD, row);
  row += 22;
  let x = PAD;
  ctx.font = `400 21px ${fonts.sans}`;
  for (const item of project.stack) {
    const w = ctx.measureText(item).width + 32;
    if (x + w > W - PAD) {
      x = PAD;
      row += 52;
    }
    if (row + 40 > H - 130) break;
    ctx.beginPath();
    ctx.roundRect(x, row, w, 40, 20);
    ctx.strokeStyle = alpha(theme.ink, 0.28);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = theme.ink;
    ctx.fillText(item, x + 16, row + 27);
    x += w + 10;
  }

  ctx.fillStyle = alpha(theme.ink, 0.14);
  ctx.fillRect(PAD, H - 110, W - PAD * 2, 2);
  ctx.fillStyle = theme.soft;
  ctx.font = `400 20px ${fonts.mono}`;
  ctx.fillText(`Caso completo em /projetos/${project.slug}`, PAD, H - 62);
  return canvas;
}
