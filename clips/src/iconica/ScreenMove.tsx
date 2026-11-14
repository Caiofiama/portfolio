import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const SCREEN_FRAMES = 180;

// A slow push into a real screen of the product and back out again. The first and last frames
// are the same picture, so the loop has no cut. Nothing is drawn on top of the screen.
export const ScreenMove: React.FC<{
  /** File in public/. */
  src: string;
  /** How far the camera pushes in at the middle of the clip. */
  zoom: number;
  /** The point the camera pushes towards, as CSS transform-origin. */
  focus: string;
}> = ({ src, zoom, focus }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const half = durationInFrames / 2;
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a0c13" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: focus,
          scale: interpolate(frame, [0, half, durationInFrames], [1, zoom, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          }),
        }}
      />
    </AbsoluteFill>
  );
};
