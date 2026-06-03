"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import GithubIcon from "./icons/GithubIcon";

const TITLE = "Engenheiro Full Stack";

export default function Hero() {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        indexRef.current += 1;
        setDisplayed(TITLE.slice(0, indexRef.current));
        if (indexRef.current >= TITLE.length) clearInterval(interval);
      }, 35);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2E75B6]/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#111] dark:text-[#f0f0f0] mb-4">
            Caio Fiama Jeronimo
          </h1>
        </motion.div>

        <div className="h-8 mb-6">
          <p className="text-lg md:text-xl text-[#2E75B6] font-mono">
            {displayed}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="text-[#555] dark:text-[#888] text-lg max-w-xl mx-auto mb-10"
        >
          Construo aplicações full stack completas — usando IA como ferramenta de alta performance em engenharia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-3 bg-[#2E75B6] hover:bg-[#3d85c8] text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            Ver Projetos
            <ArrowDown size={16} />
          </button>

          <a
            href="/cv.pdf"
            download
            className="px-6 py-3 border border-[#d0d0d0] dark:border-[#333] hover:border-[#999] dark:hover:border-[#555] text-[#111] dark:text-[#f0f0f0] rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            Baixar CV
            <Download size={16} />
          </a>

          <a
            href="https://github.com/Caiofiama"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center border border-[#d0d0d0] dark:border-[#333] hover:border-[#999] dark:hover:border-[#555] text-[#555] dark:text-[#888] hover:text-[#111] dark:hover:text-[#f0f0f0] rounded-lg transition-all duration-200"
            aria-label="GitHub"
          >
            <GithubIcon size={20} />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={20} className="text-[#bbb] dark:text-[#444]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
