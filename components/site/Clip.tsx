"use client";

// A short silent loop of the product. A still of it shows first, as a normal responsive image;
// the video on top loads only when it scrolls into view, and never starts by itself under
// reduced motion or data saver: there the person presses play.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { ProjectClip } from "@/content/projects";

type NavigatorHints = Navigator & { connection?: { saveData?: boolean } };

const TYPES = { mp4: "video/mp4", webm: "video/webm" } as const;

export default function Clip({
  clip,
  sizes,
  priority = false,
  round = false,
}: {
  clip: ProjectClip;
  /** How wide the clip is on screen, as for an image. */
  sizes: string;
  /** True for the clip at the top of a page. */
  priority?: boolean;
  round?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Once the person pauses, scrolling never restarts the clip behind their back.
  const pausedByPerson = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saving = (navigator as NavigatorHints).connection?.saveData === true;
    if (reduced || saving) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
        else if (!pausedByPerson.current) video.play().catch(() => {});
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      pausedByPerson.current = false;
      video.play().catch(() => {});
    } else {
      pausedByPerson.current = true;
      video.pause();
    }
  };

  return (
    <div className={`frame${round ? " frame--round" : ""}`} style={{ aspectRatio: `${clip.width} / ${clip.height}` }}>
      <Image src={`/clips/${clip.name}.jpg`} alt="" width={clip.width} height={clip.height} sizes={sizes} priority={priority} />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        width={clip.width}
        height={clip.height}
        aria-label={clip.alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {clip.sources.map((ext) => (
          <source key={ext} src={`/clips/${clip.name}.${ext}`} type={TYPES[ext]} />
        ))}
      </video>
      <button type="button" className="clip__toggle" onClick={toggle} aria-label={playing ? "Pausar o clipe" : "Reproduzir o clipe"}>
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
