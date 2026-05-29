"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import GithubIcon from "./icons/GithubIcon";
import { Project } from "@/types";

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-[#333] transition-colors duration-300"
    >
      {/* Thumbnail */}
      <div className={`relative h-36 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
        <span className="text-5xl select-none">{project.icon}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 pt-4">
        <h3 className="text-[#f0f0f0] font-semibold text-lg mb-2 group-hover:text-white transition-colors">
          {project.name}
        </h3>
        <p className="text-[#888] text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2.5 py-1 rounded-full border border-[#2E75B6]/30 text-[#2E75B6] bg-[#2E75B6]/5"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[#f0f0f0] hover:text-[#2E75B6] transition-colors duration-200"
          >
            <ExternalLink size={14} />
            Demo ao vivo
          </a>
          <span className="text-[#333]">·</span>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#f0f0f0] transition-colors duration-200"
          >
            <GithubIcon size={14} />
            Código
          </a>
        </div>
      </div>
    </motion.div>
  );
}
