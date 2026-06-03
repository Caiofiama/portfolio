import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caio Fiama Jeronimo — Engenheiro Full Stack",
  description:
    "Engenheiro Full Stack e Especialista em Desenvolvimento Assistido por IA. Construindo aplicações completas com React, Next.js, PostgreSQL e Stripe.",
  keywords: ["Engenheiro Full Stack", "React", "TypeScript", "Next.js", "PostgreSQL", "Portfólio"],
  authors: [{ name: "Caio Fiama Jeronimo" }],
  openGraph: {
    title: "Caio Fiama Jeronimo — Engenheiro Full Stack",
    description: "Construindo aplicações full stack completas — usando IA como ferramenta de alta performance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
