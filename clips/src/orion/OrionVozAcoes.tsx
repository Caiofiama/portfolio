import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { AppFrame, Background, Caption, F, Reply, Spoken, T, bevel, ease } from "./hud";

export const ORION_FRAMES = 180;

// One spoken sentence fires a routine: each step checks off, then ORION confirms.
// Frames at 30 fps. The content fades at both ends so the 6-second loop restarts cleanly.
const SAID = 12;
const STEPS: [string, number][] = [
  ["Fechar o Discord", 46],
  ["Silenciar notificações do Windows", 60],
  ["Abrir o Notion na última página", 74],
  ["Tocar a playlist “Foco profundo”", 88],
  ["Lembrar de levantar a cada 50 min", 102],
];
const CONFIRMED = 112;

export const OrionVozAcoes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Background>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(frame, [0, 8, ORION_FRAMES - 14, ORION_FRAMES - 2], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <AppFrame tab="Rotinas" title="Modo foco">
          <div style={{ position: "absolute", left: 40, top: 28 }}>
            <div style={{ fontFamily: F.display, fontSize: 34, fontWeight: 600 }}>Rotinas</div>
            <div style={{ color: T.soft, fontSize: 15 }}>Por horário, por evento ou por uma frase sua.</div>
          </div>

          <div style={{ position: "absolute", left: 40, top: 118, width: 590, padding: 24, background: T.hull, clipPath: bevel(), boxShadow: `inset 0 0 0 1px ${T.hairline}` }}>
            <div style={{ fontFamily: F.display, fontSize: 18, marginBottom: 14 }}>Modo foco · 5 passos</div>
            {STEPS.map(([label, at]) => {
              const pending = frame < at;
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: `1px solid ${T.hairline}` }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      border: `1px solid ${pending ? T.hairline : T.ok}`,
                      background: pending ? "transparent" : "rgba(79,227,168,0.15)",
                      color: T.ok,
                      fontSize: 14,
                      scale: ease(frame, at, at + 10, 0.8, 1),
                    }}
                  >
                    {pending ? "" : "✓"}
                  </div>
                  <div style={{ fontSize: 17, color: pending ? T.muted : T.ink }}>{label}</div>
                  <div style={{ marginLeft: "auto", fontSize: 12, color: pending ? T.muted : T.ok }}>{pending ? "aguardando" : "feito"}</div>
                </div>
              );
            })}
          </div>

          <div style={{ position: "absolute", left: 670, top: 118, right: 36 }}>
            <Spoken text="ativa o modo foco" start={SAID} />
            <Reply
              text="Modo foco ativado: Discord fechado, notificações silenciadas, playlist tocando."
              start={CONFIRMED}
              cps={70}
              style={{ marginTop: 36 }}
            />
          </div>
        </AppFrame>
        <Caption text="Uma frase, vários passos. Nada sai sem você aprovar." />
      </div>
    </Background>
  );
};
