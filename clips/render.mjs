// Renders every clip into ../public/clips as MP4 (H.264), WebM (VP9) and a JPEG poster.
// Usage: npm run render [-- OrionVozAcoes IconicaEscritorio ...]
import { execSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";

// Composition id, output name, the frame used as the poster, and the H.264 and VP9 quality (CRF).
// The agents panel is dense text, so it takes a higher CRF to stay near the others in size.
const clips = [
  ["OrionVozAcoes", "orion-voz-acoes", 150, 30, 46],
  ["IconicaEscritorio", "iconica-escritorio", 0, 30, 46],
  ["IconicaAgentes", "iconica-agentes", 0, 33, 50],
];

const wanted = process.argv.slice(2);
const out = "../public/clips";
mkdirSync(out, { recursive: true });

const run = (command) => execSync(command, { stdio: "inherit" });

for (const [id, name, posterFrame, h264, vp9] of clips) {
  if (wanted.length && !wanted.includes(id)) continue;
  run(`npx remotion render src/index.ts ${id} ${out}/${name}.mp4 --codec h264 --pixel-format yuv420p --crf ${h264} --muted --log=error`);
  run(`npx remotion render src/index.ts ${id} ${out}/${name}.webm --codec vp9 --crf ${vp9} --muted --log=error`);
  run(`npx remotion still src/index.ts ${id} ${out}/${name}.jpg --frame=${posterFrame} --image-format=jpeg --jpeg-quality=78 --log=error`);
  for (const ext of ["mp4", "webm", "jpg"]) {
    console.log(`${name}.${ext}`, Math.round(statSync(`${out}/${name}.${ext}`).size / 1024), "KB");
  }
}
