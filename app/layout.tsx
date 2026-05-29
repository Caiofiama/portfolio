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
  title: "Caio Fiama Jeronimo — Engenheiro Front-End",
  description:
    "Engenheiro Front-End e Especialista em Desenvolvimento Assistido por IA. Construindo interfaces de produção com React, TypeScript e Next.js.",
  keywords: ["Engenheiro Front-End", "React", "TypeScript", "Next.js", "Portfólio"],
  authors: [{ name: "Caio Fiama Jeronimo" }],
  openGraph: {
    title: "Caio Fiama Jeronimo — Engenheiro Front-End",
    description: "Construindo interfaces de produção — usando IA como ferramenta de alta performance.",
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
