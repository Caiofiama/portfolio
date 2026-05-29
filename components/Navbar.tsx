"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const links: { label: string; id: string }[] = [
  { label: "Sobre", id: "about" },
  { label: "Projetos", id: "projects" },
  { label: "Habilidades", id: "skills" },
  { label: "Contato", id: "contact" },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setVisible(y < lastY || y < 80);
      setLastY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? "bg-[#0a0a0a]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222]"
              : "bg-transparent"
          }`}
        >
          <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-bold text-lg tracking-tight text-[#f0f0f0] hover:text-white transition-colors font-mono"
            >
              CFJ
            </button>

            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-sm text-[#888] hover:text-[#f0f0f0] transition-colors duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <ThemeToggle />
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
