import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = { title: "About", description: "Conold Chisinahama leads e-commerce support and customer operations and builds software for the teams doing that work." };

const capabilities = ["Customer success", "Team development", "Support operations", "Quality assurance", "Customer feedback", "Operational analytics", "Product development", "Full-stack development"];

export default function AboutPage() {
  return <>
    <section className="page shell about-page"><div className="page-intro"><p className="eyebrow">About</p><h1>Supporting customers, developing teams and improving how work gets done.</h1></div><div className="about-story"><div className="portrait-frame portrait-large"><Image src="/conold-thando-chisinahama.jpg" alt="Portrait of Conold Thando Chisinahama" width={1000} height={1000} priority /></div><div className="story-copy"><p className="lead">I’m Conold Thando Chisinahama, an E-Commerce Support Manager based in Johannesburg. I lead customer operations and build tools that help support teams do their work.</p><p>I lead support across the online store and Amazon. I coach the team, oversee service quality and step in on complex cases where customers need a clear next step and someone to see it through.</p><p>I work with Product, Fulfillment and Operations to turn recurring feedback, reviews and returns into practical changes. My background in technical support helps me understand both what the customer is trying to do and where the process gets in the way.</p><p>I take a hands-on role in defining and building internal products. That includes tools for finding customer context, reviewing support quality and reporting on team performance.</p></div></div></section>
    <section className="principles compact-section"><div className="shell two-column"><div><p className="eyebrow">Capabilities</p><h2>Where I do my best work.</h2></div><div className="capability-list">{capabilities.map((item) => <span key={item}>{item}</span>)}</div></div></section>
    <section className="section shell journey"><div><p className="eyebrow">Selected journey</p><h2>Technology has always been part of the work.</h2></div><div className="timeline-list">
      <article><span>Nov 2026–present</span><div><h3>E-Commerce Support Manager</h3><p>Lead online store and Amazon support, coach the team and bring customer feedback into decisions with Product, Fulfillment and Operations.</p></div></article>
      <article><span>2023–2026</span><div><h3>Customer Success Lead</h3><p>Led customer service delivery and built internal tools for customer context, quality and performance reporting.</p></div></article>
      <article><span>2024–2026</span><div><h3>Returns analytics collaboration</h3><p>Co-built an early Python returns-rate dashboard over roughly two to three months and later made a bounded contribution to the production platform.</p></div></article>
      <article><span>2020–2023</span><div><h3>Technical sales and support</h3><p>Helped customers solve connectivity problems remotely, joining technical diagnosis with commercially useful advice.</p></div></article>
      <article><span>2017</span><div><h3>SlykPark university capstone</h3><p>Built a wallet-funded parking product where number-plate recognition connected entry, time on site and automated payment.</p></div></article>
    </div></section>
    <section className="credential-band"><div className="shell two-column"><div><p className="eyebrow">Education and credential</p><h2>Business context, technical depth.</h2></div><div><p><strong>National Diploma, Business Information Technology</strong><br />University of Johannesburg · 2014–2018</p><p><strong>Peplink Certified Engineer</strong><br />Awarded 17 November 2025 · Valid through 17 November 2027</p><Link className="text-link" href="/resume">View resume <ArrowRight /></Link></div></div></section>
  </>;
}
