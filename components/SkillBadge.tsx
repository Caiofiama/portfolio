"use client";

import { motion } from "framer-motion";

interface Props {
  skill: string;
  index: number;
}

export default function SkillBadge({ skill, index }: Props) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-[#222] bg-[#111] text-[#888] hover:border-[#2E75B6]/50 hover:text-[#f0f0f0] transition-all duration-200 cursor-default"
    >
      {skill}
    </motion.span>
  );
}
