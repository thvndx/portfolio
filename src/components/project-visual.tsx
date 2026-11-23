import type { ProjectVisual as ProjectVisualType } from "@/data/projects";
import { hasWalkthrough, walkthroughs, type WalkthroughType } from "@/data/project-walkthroughs";

const archiveVisuals = {
  experience: { title: "Customer feedback", rows: [["Product experience", "Setup instructions"], ["Support experience", "Helpful walkthrough"]], result: "Two scores, with evidence for each" },
  returns: { title: "Returns by product", rows: [["Antenna kits", "Fit and compatibility"], ["Accessories", "Changed requirements"]], result: "Recurring reasons by category" },
  marketplace: { title: "Find help nearby", rows: [["Browse providers", "Search by location"], ["Post a job", "Describe what you need"]], result: "Nomayini · Local services" },
  storefront: { title: "ROWB Atelier", rows: [["The collection", "Editorial lookbook"], ["Product detail", "Fit and fabric"]], result: "Shopify theme prototype" },
  flagship: { title: "DST Bresciani", rows: [["Explore tailoring", "Collections"], ["Shop the edit", "Premium menswear"]], result: "Shopify flagship concept" },
  event: { title: "Your Favorite Run", rows: [["Find your event", "Public event page"], ["Manage places", "Organizer dashboard"]], result: "Registration and capacity" },
} as const;

function PreviewPanel({ heading, rows, result }: {
  heading: string;
  rows: readonly (readonly [string, string])[];
  result: string;
}) {
  return <div className="preview-panel">
    <strong className="preview-title">{heading}</strong>
    <dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <span className="preview-result">{result}</span>
  </div>;
}

export function ProjectVisual({ type }: { type: ProjectVisualType }) {
  const preview = hasWalkthrough(type)
    ? walkthroughs[type].steps[0]
    : archiveVisuals[type];

  return <div className={`project-visual visual-${type}`} aria-hidden="true">
    <div className="preview-window">
      <div className="preview-toolbar"><span /><span /><span /><b>Illustrative preview</b></div>
      <PreviewPanel heading={"heading" in preview ? preview.heading : preview.title} rows={preview.rows} result={preview.result} />
    </div>
  </div>;
}

export function ProjectWalkthrough({ type }: { type: WalkthroughType }) {
  const walkthrough = walkthroughs[type];

  return <section className={`shell workflow visual-${type}`} aria-labelledby="workflow-title">
    <header className="workflow-heading">
      <p className="eyebrow">Workflow walkthrough</p>
      <h2 id="workflow-title">{walkthrough.title}</h2>
      <p>{walkthrough.value}</p>
    </header>
    <figure>
      <ol className="workflow-steps">
        {walkthrough.steps.map((step) => <li key={step.title}>
          <div className="workflow-screen">
            <div className="preview-toolbar"><b>{step.screen}</b></div>
            <PreviewPanel heading={step.heading} rows={step.rows} result={step.result} />
          </div>
          <div className="workflow-step-copy"><h3>{step.title}</h3><p>{step.description}</p></div>
        </li>)}
      </ol>
      <figcaption>Illustrative reconstruction with fictional data.</figcaption>
    </figure>
  </section>;
}
