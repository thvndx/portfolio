import type { Metadata } from "next";
import { Download } from "@/components/icons";

export const metadata: Metadata = { title: "Resume", description: "Resume downloads and career summary for Conold Thando Chisinahama." };

export default function ResumePage() {
  return <section className="page shell resume-page"><div className="page-intro"><p className="eyebrow">Resume</p><h1>Customer-led product engineering, from operations to production.</h1><p>Choose the concise software and product profile or the fuller career history. Both versions are ATS-friendly and available as editable Word documents and PDFs.</p></div><div className="resume-downloads">
    <article><span>01</span><p className="eyebrow">Focused version · 1 page</p><h2>Software and product resume</h2><p>For full-stack developer, software developer and product engineer opportunities.</p><div><a className="button" href="/documents/conold-chisinahama-resume-concise.pdf" download><Download /> PDF</a><a className="button button-secondary" href="/documents/conold-chisinahama-resume-concise.docx" download><Download /> DOCX</a></div></article>
    <article><span>02</span><p className="eyebrow">Master version · 2 pages</p><h2>Complete career resume</h2><p>Customer-success leadership, technical experience, product delivery, education and credentials.</p><div><a className="button" href="/documents/conold-chisinahama-resume-master.pdf" download><Download /> PDF</a><a className="button button-secondary" href="/documents/conold-chisinahama-resume-master.docx" download><Download /> DOCX</a></div></article>
  </div><div className="resume-summary"><div><p className="eyebrow">Current focus</p><h2>Full-stack and product roles</h2></div><div><p>I’m looking for teams that value customer understanding, careful automation, trustworthy data and engineers who stay close to the outcome after deployment.</p><p>Johannesburg, South Africa · Open to suitable remote and hybrid opportunities.</p></div></div></section>;
}
