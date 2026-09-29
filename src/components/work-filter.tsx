"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { projectCategories, type Project, type ProjectCategory } from "@/data/projects";

export function WorkFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");
  const visible = filter === "All" ? projects : projects.filter((project) => project.categories.includes(filter));
  return (
    <>
      <div className="filter-row" aria-label="Filter projects">
        {(["All", ...projectCategories] as const).map((category) => <button type="button" key={category} className={filter === category ? "filter-active" : ""} onClick={() => setFilter(category)} aria-pressed={filter === category}>{category}</button>)}
      </div>
      <p className="result-count" aria-live="polite">Showing {visible.length} project{visible.length === 1 ? "" : "s"}</p>
      <div className="work-grid">{visible.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
    </>
  );
}
