import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = { title: "About", description: "Customer-success leader and full-stack developer building practical, secure operational products." };

const capabilities = ["Product strategy", "Full-stack TypeScript", "Operational analytics", "AI-assisted workflows", "API and provider integrations", "PostgreSQL data modeling", "Security-minded UX", "Testing and deployment"];

export default function AboutPage() {
  return <>
    <section className="page shell about-page"><div className="page-intro"><p className="eyebrow">About</p><h1>A customer-success foundation became a product-engineering advantage.</h1></div><div className="about-story"><div className="portrait-frame portrait-large"><Image src="/conold-thando-chisinahama.jpg" alt="Portrait of Conold Thando Chisinahama" width={1000} height={1000} priority /></div><div className="story-copy"><p className="lead">I’m Conold Thando Chisinahama, a Customer Success Lead and hands-on full-stack developer based in Johannesburg.</p><p>I spent years close to customers, support queues and technical systems before expanding that work into product design and software delivery. That path taught me to ask a useful question early: what must be true for this product to work on a difficult Tuesday, not just in a demo?</p><p>I now build operational tools, analytics products, AI-assisted workflows and commerce experiences. I use modern development assistance transparently, but I keep responsibility human: defining the problem, choosing the architecture, verifying the behavior and owning the release.</p><p>In my current role I lead two direct reports within a four-person support operation. The systems I’ve built are used across the full team and by adjacent departments.</p></div></div></section>
    <section className="principles compact-section"><div className="shell two-column"><div><p className="eyebrow">Capabilities</p><h2>Where I do my best work.</h2></div><div className="capability-list">{capabilities.map((item) => <span key={item}>{item}</span>)}</div></div></section>
    <section className="section shell journey"><div><p className="eyebrow">Selected journey</p><h2>Technology has always been part of the work.</h2></div><div className="timeline-list">
      <article><span>2023–now</span><div><h3>Customer Success Lead</h3><p>Leading service delivery while defining and shipping internal products for customer context, quality, experience and performance operations.</p></div></article>
      <article><span>2024–2026</span><div><h3>Returns analytics collaboration</h3><p>Co-built an early Python returns-rate dashboard over roughly two to three months and later made a bounded contribution to the production platform.</p></div></article>
      <article><span>2020–2023</span><div><h3>Technical sales and support</h3><p>Helped customers solve connectivity problems remotely, joining technical diagnosis with commercially useful advice.</p></div></article>
      <article><span>2017</span><div><h3>SlykPark university capstone</h3><p>Built a wallet-funded parking product where number-plate recognition connected entry, time on site and automated payment.</p></div></article>
    </div></section>
    <section className="credential-band"><div className="shell two-column"><div><p className="eyebrow">Education and credential</p><h2>Business context, technical depth.</h2></div><div><p><strong>National Diploma, Business Information Technology</strong><br />University of Johannesburg · 2014–2018</p><p><strong>Peplink Certified Engineer</strong><br />Awarded 17 November 2025 · Valid through 17 November 2027</p><Link className="text-link" href="/resume">View resume <ArrowRight /></Link></div></div></section>
  </>;
}
