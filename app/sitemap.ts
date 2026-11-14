import type { MetadataRoute } from "next";
import { featuredProjects } from "@/content/projects";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...featuredProjects.map((project) => ({
      url: `${siteUrl}/projetos/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
