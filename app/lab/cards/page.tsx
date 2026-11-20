import { notFound } from "next/navigation";
import CardSheet from "@/components/lab/CardSheet";

// Development only: the sheet that draws the card faces saved in public/lab.
export const metadata = { robots: { index: false, follow: false } };

export default function CardsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <CardSheet />;
}
