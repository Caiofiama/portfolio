import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { person } from "@/content/site";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Exists only in development, to shoot app/opengraph-image.png at 1200x630. In production it is a 404.
export default function OgStage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="fixed inset-0 z-[100] flex bg-bg">
      <div className="flex w-[640px] shrink-0 flex-col justify-center pl-[72px]">
        <p className="text-[64px] font-bold leading-[1.02] tracking-[-0.035em]">{person.name}</p>
        <p className="mt-6 whitespace-nowrap text-[28px] font-medium leading-[1.2] tracking-[-0.015em]">
          {person.role} no {person.city}
        </p>
        <p className="mt-8 whitespace-nowrap font-mono text-[18px] text-accent">Iconica · ORION AI · TeamTask API · B2B Flow</p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- dev-only stage for a screenshot */}
      <img src="/office/poster-mobile.webp" alt="" className="h-full w-[560px] object-contain" />
    </div>
  );
}
