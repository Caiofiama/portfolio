"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import GithubIcon from "./icons/GithubIcon";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-mono text-[#2E75B6] mb-3">04. contato</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#f0f0f0] mb-4">
            Vamos trabalhar juntos
          </h2>
          <p className="text-[#888] mb-10">
            Aberto a oportunidades remotas de front-end.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="mailto:caiofikl9@gmail.com"
            className="flex items-center gap-2 px-6 py-3 bg-[#2E75B6] hover:bg-[#3d85c8] text-white rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto justify-center"
          >
            <Mail size={16} />
            caiofikl9@gmail.com
          </a>

          <a
            href="https://github.com/Caiofiama"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-[#333] hover:border-[#555] text-[#f0f0f0] rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto justify-center"
          >
            <GithubIcon size={16} />
            github.com/Caiofiama
          </a>

          <a
            href="tel:+5521986515747"
            className="flex items-center gap-2 px-6 py-3 border border-[#333] hover:border-[#555] text-[#888] hover:text-[#f0f0f0] rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto justify-center"
          >
            <Phone size={16} />
            +55 21 98651-5747
          </a>
        </motion.div>
      </div>
    </section>
  );
}
