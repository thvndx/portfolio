import type { MetadataRoute } from "next";
import { featuredProjects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://conold-portfolio.vercel.app";
  return ["", "/work", "/about", "/resume", ...featuredProjects.map((project) => `/work/${project.slug}`)].map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "monthly" : "yearly", priority: path === "" ? 1 : path === "/work" ? 0.9 : 0.7 }));
}
