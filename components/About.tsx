"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-mono text-[#2E75B6] mb-3">01. sobre</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-[#f0f0f0] mb-8">
            Um pouco sobre mim
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#555] dark:text-[#888] leading-relaxed"
          >
            Apaixonado por computação e tecnologia desde os 12 anos de idade.
            Brasileiro, morando no Rio de Janeiro, me especializo em construir interfaces
            polidas e performáticas com React, TypeScript e ferramentas modernas.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#555] dark:text-[#888] leading-relaxed"
          >
            Minha abordagem com desenvolvimento assistido por IA trata Claude e Cursor
            como ferramentas de alta performance — eu defino a arquitetura, tomo cada
            decisão e reviso cada linha. O trabalho é meu.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl border border-[#e5e5e5] dark:border-[#222] bg-[#f8f8f8] dark:bg-[#111] text-center"
            >
              <p className="text-2xl font-bold text-[#2E75B6] mb-1">{stat.value}</p>
              <p className="text-xs text-[#555] dark:text-[#888] leading-tight">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
