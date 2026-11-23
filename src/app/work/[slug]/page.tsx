import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { ProjectWalkthrough } from "@/components/project-visual";
import { hasWalkthrough } from "@/data/project-walkthroughs";
import { featuredProjects, projectBySlug } from "@/data/projects";

export function generateStaticParams() { return featuredProjects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug.get(slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug.get(slug);
  if (!project?.featured || !project.sections) notFound();
  const currentIndex = featuredProjects.findIndex((item) => item.slug === project.slug);
  const next = featuredProjects[(currentIndex + 1) % featuredProjects.length];
  const structured = { "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, author: { "@type": "Person", name: "Conold Thando Chisinahama" }, dateCreated: project.year, description: project.summary };
  return <>
    <article className="case-study">
      <header className="case-hero shell"><Link className="back-link" href="/work">← All work</Link><p className="eyebrow">{project.eyebrow}</p><h1>{project.title}</h1><p className="case-summary">{project.summary}</p><div className="case-meta"><div><span>Role</span><b>{project.role}</b></div><div><span>Year</span><b>{project.year}</b></div><div><span>Status</span><b>{project.status}</b></div></div></header>
      {hasWalkthrough(project.visual) && <ProjectWalkthrough type={project.visual} />}
      <div className="shell case-content">
        <aside><p className="eyebrow">Technology</p><div className="stack-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></aside>
        <div className="case-sections">{project.sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}</div>
      </div>
      <section className="outcome-panel"><div className="shell"><p className="eyebrow">Selected outcomes</p><div className="outcome-grid">{project.outcomes.map((outcome) => <p key={outcome}>{outcome}</p>)}</div></div></section>
    </article>
    <section className="next-project shell"><p className="eyebrow">Next case study</p><Link href={`/work/${next.slug}`}><span>{next.title}</span><ArrowRight /></Link></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
  </>;
}
