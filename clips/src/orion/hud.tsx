import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadBody } from "@remotion/google-fonts/IBMPlexSans";

// The ORION app's own HUD, copied from the product's site-video project so the clip looks
// like the product. Only the pieces this clip uses; the sidebar shows labels without icons.
export const T = {
  abyss: "#06111a",
  hull: "#0b1a24",
  hairline: "#1c3443",
  ink: "#e6f4fb",
  soft: "#b7c9d4",
  muted: "#7d93a1",
  accent: "#5ce1ff",
  accentRgb: "92, 225, 255",
  ok: "#4fe3a8",
};

const display = loadDisplay("normal", { weights: ["500", "600"], subsets: ["latin"] }).fontFamily;
const body = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;
export const F = { display: `${display}, "Segoe UI", sans-serif`, body: `${body}, "Segoe UI", sans-serif` };

export const bevel = (size = 14) =>
  `polygon(${size}px 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%, 0 ${size}px)`;

/** 0 to 1 between two frames, easing out. */
export const ease = (frame: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(frame, [from, to], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });

/** The part of `text` typed by `frame`, starting at `start`, at `cps` characters per second. */
export const typed = (text: string, frame: number, start: number, cps = 26, fps = 30) =>
  text.slice(0, Math.max(0, Math.floor(((frame - start) / fps) * cps)));

export const Background: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      fontFamily: F.body,
      color: T.ink,
      background: `linear-gradient(rgba(${T.accentRgb}, 0.04) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(${T.accentRgb}, 0.04) 1px, transparent 1px) 0 0 / 48px 48px, radial-gradient(900px 500px at 70% -10%, rgba(20, 90, 130, 0.5), transparent 70%), ${T.abyss}`,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Logo: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <Img src={staticFile("orion-ai-simbolo.svg")} style={{ width: size, height: size }} />
);

const Chip: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", padding: "6px 12px", fontSize: 12, color: T.soft, background: T.hull, border: `1px solid ${T.hairline}`, borderRadius: 8 }}>
    {children}
  </span>
);

const TABS = ["Conversa", "Voz", "Globo", "Finanças", "Rotinas", "Sistema"];

/** The app window: sidebar with tabs, top bar, content area. */
export const AppFrame: React.FC<{ tab: string; title: string; children?: React.ReactNode }> = ({ tab, title, children }) => (
  <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "96px 1fr", gridTemplateRows: "64px 1fr" }}>
    <div style={{ gridRow: "1 / span 2", borderRight: `1px solid ${T.hairline}`, background: "rgba(6,17,26,0.9)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, gap: 8 }}>
      <Logo size={44} />
      <div style={{ height: 14 }} />
      {TABS.map((name) => (
        <div
          key={name}
          style={{
            width: 76,
            padding: "10px 0",
            textAlign: "center",
            fontSize: 12,
            color: name === tab ? T.accent : T.muted,
            border: name === tab ? `1px solid rgba(${T.accentRgb},0.6)` : "1px solid transparent",
            borderRadius: 8,
            background: name === tab ? `rgba(${T.accentRgb},0.08)` : "transparent",
          }}
        >
          {name}
        </div>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 28px", borderBottom: `1px solid ${T.hairline}`, background: "rgba(6,17,26,0.85)" }}>
      <div>
        <div style={{ fontFamily: F.display, letterSpacing: "0.3em", fontSize: 16, color: T.ink }}>ORION</div>
        <div style={{ fontSize: 11, color: T.accent, marginTop: -2 }}>Assistente pessoal</div>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
        <Chip>IA · neste PC</Chip>
        <Chip>{title}</Chip>
      </div>
    </div>
    <div style={{ position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

export const Wave: React.FC<{ active: boolean; bars?: number; height?: number }> = ({ active, bars = 7, height = 26 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: active ? height * (0.25 + 0.75 * Math.abs(Math.sin(frame / 3 + i * 1.3))) : height * 0.18,
            borderRadius: 3,
            background: T.accent,
            boxShadow: active ? `0 0 8px ${T.accent}` : "none",
          }}
        />
      ))}
    </div>
  );
};

/** A line the person says, with a waveform while it is being said. */
export const Spoken: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const frame = useCurrentFrame();
  const shown = typed(text, frame, start, 22);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: ease(frame, start, start + 8) }}>
      <Wave active={frame >= start && shown.length < text.length} />
      <div style={{ fontSize: 30, color: T.ink }}>
        “{shown}
        {shown.length === text.length ? "”" : ""}
      </div>
    </div>
  );
};

/** ORION's reply streaming in, in the app's chat style. */
export const Reply: React.FC<{ text: string; start: number; cps?: number; style?: React.CSSProperties }> = ({ text, start, cps = 40, style }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 14, alignItems: "start", ...style }}>
      <Logo size={30} />
      <div style={{ borderLeft: `2px solid ${T.accent}`, paddingLeft: 14 }}>
        <div style={{ fontFamily: F.display, fontSize: 13, letterSpacing: "0.12em", color: T.accent }}>ORION</div>
        <div style={{ fontSize: 22, lineHeight: 1.5, color: T.ink, marginTop: 4 }}>{typed(text, frame, start, cps)}</div>
      </div>
    </div>
  );
};

/** The burned-in caption at the foot of the clip. */
export const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 36, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: F.display, fontSize: 24, color: T.ink, background: "rgba(6,17,26,0.85)", padding: "10px 22px", border: `1px solid rgba(${T.accentRgb},0.4)`, clipPath: bevel(10) }}>
      {text}
    </div>
  </div>
);
