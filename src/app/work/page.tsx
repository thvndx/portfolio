import type { Metadata } from "next";
import { WorkFilter } from "@/components/work-filter";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Work", description: "Eleven products spanning support operations, AI, analytics, mobile planning, commerce and client delivery." };

export default function WorkPage() {
  return <section className="page shell"><div className="page-intro"><p className="eyebrow">Project index · 2024–2026</p><h1>Work shaped by real users and real constraints.</h1><p>Five detailed case studies and six supporting projects. Professional systems use sanitized names and fictional interface data; collaborative work is credited explicitly.</p></div><WorkFilter projects={projects} /></section>;
}
