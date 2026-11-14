"use client";

// Development only (see app/poster/page.tsx): the office alone on black, camera at the
// top-of-page view, so a headless browser can shoot the hero's still poster.
import { useState } from "react";
import dynamic from "next/dynamic";

const OfficeScene = dynamic(() => import("@/components/scene/OfficeScene"), { ssr: false });

export default function PosterStage() {
  const [ready, setReady] = useState(false);
  return (
    <div className="fixed inset-0 bg-bg" data-ready={ready}>
      <OfficeScene still onReady={() => setReady(true)} />
    </div>
  );
}
