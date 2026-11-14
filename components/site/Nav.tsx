"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { person } from "@/content/site";

const links = [
  { href: "/#projetos", label: "Projetos" },
  { href: "/#experiencia", label: "Experiência" },
  { href: "/#stack", label: "Stack" },
  { href: "/#contato", label: "Contato" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // The phone menu covers the page: lock the scroll behind it and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    // Nothing behind the open menu can be reached by keyboard or screen reader.
    const behind = document.querySelectorAll<HTMLElement>("main, footer");
    behind.forEach((el) => (el.inert = true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      behind.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="nav fixed inset-x-0 top-0 z-50 h-[var(--nav)] bg-[rgb(0_0_0/0.84)] lg:backdrop-blur-md">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <nav className="wrap flex h-full items-center justify-between gap-6" aria-label="Principal">
        <Link href="/" className="inline-flex min-h-[44px] items-center text-base font-bold tracking-tight">
          {person.shortName}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="link-draw text-sm">
              <span>{link.label}</span>
            </Link>
          ))}
          <a className="btn btn--ghost btn--small" href={person.resume} download>
            Baixar currículo
          </a>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </nav>

      <div id="menu" hidden={!open} className="fixed inset-x-0 bottom-0 top-[var(--nav)] bg-bg md:hidden">
        <div className="wrap flex h-full flex-col pb-8 pt-6">
          <ul>
            {links.map((link) => (
              <li key={link.href} className="border-b border-line">
                <Link
                  href={link.href}
                  className="flex min-h-[64px] items-center text-[28px] font-bold tracking-tight"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <a className="btn btn--primary mt-auto w-full" href={person.resume} download onClick={() => setOpen(false)}>
            Baixar currículo
          </a>
        </div>
      </div>
    </header>
  );
}
