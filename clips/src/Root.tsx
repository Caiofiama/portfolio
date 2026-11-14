import React from "react";
import { Composition } from "remotion";
import { SCREEN_FRAMES, ScreenMove } from "./iconica/ScreenMove";
import { ORION_FRAMES, OrionVozAcoes } from "./orion/OrionVozAcoes";

// Three silent 6-second loops for the portfolio's case pages.
// Render all with `npm run render`; files land in ../public/clips.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="OrionVozAcoes" component={OrionVozAcoes} durationInFrames={ORION_FRAMES} fps={30} width={1280} height={720} />
    <Composition
      id="IconicaEscritorio"
      component={ScreenMove}
      durationInFrames={SCREEN_FRAMES}
      fps={30}
      width={960}
      height={600}
      defaultProps={{ src: "iconica-escritorio.webp", zoom: 1.45, focus: "42% 52%" }}
    />
    <Composition
      id="IconicaAgentes"
      component={ScreenMove}
      durationInFrames={SCREEN_FRAMES}
      fps={30}
      width={960}
      height={600}
      defaultProps={{ src: "iconica-agentes.webp", zoom: 1.2, focus: "0% 42%" }}
    />
  </>
);
