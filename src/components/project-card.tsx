import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { ProjectVisual } from "@/components/project-visual";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const content = (
    <>
      <ProjectVisual type={project.visual} />
      <div className="project-card-body">
        <div className="project-card-meta"><span>{String(index + 1).padStart(2, "0")}</span><span>{project.year}</span></div>
        <p className="eyebrow">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="tag-row">{project.stack.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div>
        {project.featured && <span className="text-link">Read case study <ArrowRight /></span>}
      </div>
    </>
  );
  return project.featured ? <Link href={`/work/${project.slug}`} className="project-card featured-card">{content}</Link> : <article className="project-card archive-card">{content}</article>;
}
