import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PosterStage from "@/components/scene/PosterStage";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Exists only in development, to shoot public/office/poster-*.webp. In production it is a 404.
export default function PosterPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <PosterStage />;
}
