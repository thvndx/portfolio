import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { profile } from "@/data/profile";
import { featuredProjects } from "@/data/projects";

const proof = [
  ["20 min → 30 sec", "Customer context"],
  ["2 hrs → 1 min", "KPI report generation"],
  ["2 hrs → 1 min", "QA sampling and compilation"],
  ["30 min → 1 min", "CSAT investigation"],
];

export default function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-kicker"><span className="availability-dot" /> {profile.role} at Waveform · Johannesburg, South Africa</div>
        <h1>Customer support that <em>earns trust.</em></h1>
        <div className="hero-bottom">
          <p>{profile.description}</p>
          <div className="hero-actions"><Link className="button" href="/work">Explore my work <ArrowRight /></Link><a className="text-link" href="mailto:cthandoc@gmail.com">Start a conversation <ArrowUpRight /></a></div>
        </div>
      </section>

      <section className="proof-band" aria-label="Selected outcomes from internal tools"><div className="shell proof-grid">{proof.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

      <section className="section shell">
        <div className="section-heading"><div><p className="eyebrow">Selected work</p><h2>See what the work changed.</h2></div><Link className="text-link" href="/work">View all projects <ArrowRight /></Link></div>
        <div className="featured-grid">{featuredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
      </section>

      <section className="principles section"><div className="shell"><p className="eyebrow">How I work</p><h2>Customer empathy, engineering discipline.</h2><div className="principle-grid">
        <article><span>01</span><h3>Start with the operating truth</h3><p>I trace how work actually moves—across people, providers and edge cases—before deciding what the software should automate.</p></article>
        <article><span>02</span><h3>Make safety a product behavior</h3><p>Ambiguous identity, incomplete data and consequential actions become visible review points, not hidden implementation details.</p></article>
        <article><span>03</span><h3>Own the last mile</h3><p>I carry work from product definition through code, testing, deployment and verification in the environment where people use it.</p></article>
      </div></div></section>

      <section className="section shell about-preview">
        <div className="portrait-frame"><Image src="/conold-thando-chisinahama.jpg" alt="Conold Thando Chisinahama" width={1000} height={1000} sizes="(max-width: 760px) 88vw, 38vw" /></div>
        <div><p className="eyebrow">About me</p><h2>From customer feedback to better workflows.</h2><p className="lead">At Waveform, I lead support for customers across our website and Amazon, from pre-purchase advice through delivery and returns.</p><p>I coach the people doing the work and partner with other teams to fix recurring customer problems. When a workflow needs a better tool, I bring hands-on product and software experience.</p><Link className="button button-secondary" href="/about">More about my path <ArrowRight /></Link></div>
      </section>
    </>
  );
}
