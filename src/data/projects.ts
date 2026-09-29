export type ProjectCategory = "Operations" | "AI & data" | "Mobile" | "Commerce" | "Client work";
export type ProjectVisual = "quality" | "workbench" | "performance" | "campaign" | "mobile" | "experience" | "returns" | "marketplace" | "storefront" | "event";

export interface ProjectSection {
  title: string;
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  eyebrow: string;
  year: string;
  status: string;
  role: string;
  summary: string;
  categories: ProjectCategory[];
  stack: string[];
  outcomes: string[];
  featured: boolean;
  visual: ProjectVisual;
  disclosure: "sanitized-professional" | "public-personal" | "credited-collaboration";
  repositoryUrl?: string;
  liveUrl?: string;
  sections?: ProjectSection[];
}

export const projects: Project[] = [
  {
    slug: "support-quality-platform",
    title: "Support Quality Platform",
    eyebrow: "AI-assisted quality operations",
    year: "2026",
    status: "Production system",
    role: "Product strategy, full-stack delivery and operational rollout",
    summary: "A quality platform that turns customer conversations into evidence-backed coaching, while keeping manual review permissions, automated sampling and reporting controls deliberately separate.",
    categories: ["Operations", "AI & data"],
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "OpenAI", "Railway", "Playwright"],
    outcomes: ["Cut QA selection and report compilation from about 2 hours to about 1 minute", "Retained human review for consequential scoring", "Adopted across the full four-person support operation"],
    featured: true,
    visual: "quality",
    disclosure: "sanitized-professional",
    sections: [
      { title: "The operational problem", body: "Quality review was valuable but expensive to coordinate. Sampling, channel-specific scoring, eligibility and reporting lived across manual processes, making consistent coaching hard to sustain." },
      { title: "My responsibility", body: "I defined the operating model, translated support policy into product behavior, built the web and API surfaces, tested failure modes, and carried releases through production verification." },
      { title: "System design", body: "The platform normalizes conversations, applies channel-aware rubrics, records evidence, and provides manager reporting. Manual QA permission, dashboard access and automation eligibility are modeled as independent controls rather than one broad role." },
      { title: "Safety by design", body: "Automation can be disabled globally, historical changes require a fresh preview and confirmation, and incomplete or ineligible interactions never silently become score-bearing reviews." },
      { title: "Outcome", body: "Selection and report compilation fell from roughly two hours to about one minute, while human judgment remained part of the review process. The product became part of the support team’s normal operating rhythm." },
      { title: "What I learned", body: "A trustworthy operations product needs explicit boundaries more than impressive automation. The strongest design decision was separating what a person may do manually from what the system may do automatically." }
    ]
  },
  {
    slug: "customer-operations-workbench",
    title: "Customer Operations Workbench",
    eyebrow: "A single, safer customer view",
    year: "2026",
    status: "Production system",
    role: "Product strategy, integration architecture and full-stack delivery",
    summary: "A narrow support workspace that brings identity, conversation history, calls, orders and next actions together without hiding uncertainty or merging conflicting customers.",
    categories: ["Operations", "AI & data"],
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Redis", "Front", "Shopify", "Aircall"],
    outcomes: ["Reduced customer-context gathering from about 20 minutes to about 30 seconds", "Made identity conflicts visible and reviewable", "Supported cross-department workflows without exposing raw customer data publicly"],
    featured: true,
    visual: "workbench",
    disclosure: "sanitized-professional",
    sections: [
      { title: "The operational problem", body: "Agents had to search several systems to understand one customer. A fast answer could still be unsafe if matching details belonged to different people." },
      { title: "My responsibility", body: "I shaped the workflow with support users, designed the integration and identity rules, implemented the application, and diagnosed issues through the real embedded production path." },
      { title: "System design", body: "The workbench composes customer details, recent interactions, call context, order information and follow-ups inside the support tool. Bounded caching and request coalescing keep provider usage controlled." },
      { title: "Safety by design", body: "Ambiguous matches pause commerce context. Agents can review candidates and make an explicit conversation-scoped selection; partial evidence never silently chooses a customer." },
      { title: "Outcome", body: "Gathering useful customer context fell from around twenty minutes to roughly thirty seconds per interaction, with uncertainty made clearer instead of being optimized away." },
      { title: "What I learned", body: "The correct integration is not always the one with the most data. It is the one that makes provenance, confidence and the next safe action understandable at a glance." }
    ]
  },
  {
    slug: "operations-performance-hub",
    title: "Operations Performance Hub",
    eyebrow: "Decision-ready support analytics",
    year: "2026",
    status: "Production system",
    role: "Product direction, data modeling and full-stack delivery",
    summary: "A manager-facing performance product that normalizes provider data, separates raw activity from KPI eligibility, and makes data coverage and freshness explicit.",
    categories: ["Operations", "AI & data"],
    stack: ["TypeScript", "React", "PostgreSQL", "Aircall", "Front", "Railway", "Zod"],
    outcomes: ["Cut report generation from about 2 hours to about 1 minute", "Separated raw call outcomes from agent KPI attribution", "Introduced persisted, budget-aware provider synchronization"],
    featured: true,
    visual: "performance",
    disclosure: "sanitized-professional",
    sections: [
      { title: "The operational problem", body: "Managers needed a coherent view of calls, messages, response times and workload, but provider systems used different grains, classifications and freshness windows." },
      { title: "My responsibility", body: "I defined useful manager questions, modeled the KPI rules, built the dashboard and provider adapters, and verified the deployed system against real operational constraints." },
      { title: "System design", body: "Raw outcomes are stored separately from KPI eligibility. One validated server payload drives cards, tables and charts, while data-source states explain whether a view is live, stale, partial or demo-backed." },
      { title: "Safety by design", body: "Sensitive call context is represented with digests rather than raw phone numbers or recordings. Request budgets and persisted snapshots reduce load on shared provider limits." },
      { title: "Outcome", body: "A recurring KPI report that previously took about two hours can now be generated in about one minute. Managers gain a responsive view without pretending incomplete data is decision-grade." },
      { title: "What I learned", body: "Analytics earns trust when it explains its denominator. Separating raw operational truth from performance eligibility prevented simple charts from producing misleading conclusions." }
    ]
  },
  {
    slug: "promostudio",
    title: "PromoStudio",
    eyebrow: "Approval-first campaign automation",
    year: "2026",
    status: "Working product",
    role: "Product design and full-stack development",
    summary: "A hosted campaign workspace that turns brand briefs into AI-generated, approval-ready social campaigns with scheduling and controlled publishing.",
    categories: ["AI & data", "Client work"],
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "OAuth", "Vercel", "OpenAI"],
    outcomes: ["Designed approval gates before external publishing", "Built secure account connections and scheduled execution", "Focused v1 on one network before broadening channel scope"],
    featured: true,
    visual: "campaign",
    disclosure: "public-personal",
    sections: [
      { title: "The product opportunity", body: "Independent promoters need to turn incomplete brand briefs into consistent campaign content without losing control of what reaches a public account." },
      { title: "My responsibility", body: "I scoped the first useful workflow, designed the campaign model, built the product and authentication surfaces, and implemented the scheduling and provider boundaries." },
      { title: "System design", body: "Briefs become structured campaigns, generated posts and suggested engagement actions. Private storage, row-level access controls and secure scheduled routes keep account data on the server." },
      { title: "Safety by design", body: "Generation does not equal publication. External actions require approval, provider credentials stay server-side, and the product narrows automation scope when a network’s rules demand it." },
      { title: "Outcome", body: "The result is a coherent working SaaS product rather than a prompt wrapper: authentication, persisted campaigns, review states, scheduling and real provider integration share one operating model." },
      { title: "What I learned", body: "A smaller honest integration is stronger than a broad roadmap presented as complete. Tightening v1 around one channel made the product safer and easier to explain." }
    ]
  },
  {
    slug: "recalibrate",
    title: "Recalibrate",
    eyebrow: "Planning that survives real life",
    year: "2026",
    status: "Local-first MVP",
    role: "Product strategy, interaction design and application development",
    summary: "An iOS-first daily planning product built around a humane loop: set intentions, shape a workable day, recover when plans change, and reflect without judgment.",
    categories: ["Mobile", "AI & data"],
    stack: ["React Native", "Expo", "TypeScript", "Local storage", "Scheduling engine"],
    outcomes: ["Built a complete local-first planning loop", "Kept the MVP usable without accounts or cloud dependencies", "Separated adaptive guidance from irreversible automation"],
    featured: true,
    visual: "mobile",
    disclosure: "public-personal",
    sections: [
      { title: "The product opportunity", body: "Most planning tools assume a stable day. Recalibrate starts from the opposite premise: plans change, capacity varies and recovery should feel useful rather than punitive." },
      { title: "My responsibility", body: "I defined the product principles, built the mobile-first interaction model and scheduling engine, and shaped a narrow MVP around the core daily loop." },
      { title: "System design", body: "Plan, Today and Insights share a local domain model. Work rhythms and intentions shape the day without requiring authentication, cloud sync or an AI dependency to make the core product function." },
      { title: "Safety by design", body: "User data stays local in the MVP. Suggestions remain supervised, and future automation is kept distinct from the dependable offline planning experience." },
      { title: "Outcome", body: "The MVP demonstrates an end-to-end planning experience with a clear point of view, responsive mobile interaction and a technical foundation that can grow without invalidating the local-first promise." },
      { title: "What I learned", body: "Product restraint is an engineering decision. Removing premature accounts, subscriptions and remote intelligence created more room to prove the behavior that makes the app distinct." }
    ]
  },
  {
    slug: "customer-experience-intelligence",
    title: "Customer Experience Intelligence",
    eyebrow: "Evidence-backed CSAT",
    year: "2026",
    status: "Internal product",
    role: "Product design and full-stack contribution",
    summary: "A support-side intelligence tool that gathers relevant customer interactions and separates product experience from support experience before producing a composite view.",
    categories: ["Operations", "AI & data"],
    stack: ["TypeScript", "React", "PostgreSQL", "Front", "Background jobs"],
    outcomes: ["Reduced CSAT investigation and calculation from about 30 minutes to about 1 minute", "Made score provenance visible", "Used across the full support operation"],
    featured: false,
    visual: "experience",
    disclosure: "sanitized-professional"
  },
  {
    slug: "returns-intelligence-contribution",
    title: "Returns Intelligence Contribution",
    eyebrow: "Collaborative commerce analytics",
    year: "2024–2026",
    status: "Credited collaboration",
    role: "Early Python co-builder and later bounded product contribution",
    summary: "A collaborative effort to turn multi-provider return data into product-level reporting. My earlier Python implementation was built with a colleague over roughly two to three months; the later production platform was primarily engineered by that colleague.",
    categories: ["AI & data", "Commerce"],
    stack: ["Python", "Next.js", "PostgreSQL", "Shopify", "Amazon", "Railway"],
    outcomes: ["Built an early working Python reporting path with a colleague", "Contributed a bounded refinement to the later platform", "Kept public credit aligned with the implementation record"],
    featured: false,
    visual: "returns",
    disclosure: "credited-collaboration"
  },
  {
    slug: "nomayini",
    title: "Nomayini",
    eyebrow: "A marketplace for local services",
    year: "2026",
    status: "Product prototype",
    role: "Product design and full-stack development",
    summary: "A mobile-first South African marketplace where customers can post work or browse service providers using trust, location and capability signals.",
    categories: ["Commerce", "Mobile"],
    stack: ["Next.js", "TypeScript", "Supabase", "Internationalization"],
    outcomes: ["Designed two complementary discovery paths", "Created a five-language interface shell", "Made provider trust signals understandable on mobile"],
    featured: false,
    visual: "marketplace",
    disclosure: "public-personal"
  },
  {
    slug: "rowb-atelier",
    title: "ROWB Atelier",
    eyebrow: "Editorial commerce experience",
    year: "2026",
    status: "Storefront and theme prototype",
    role: "Frontend development and Shopify theme translation",
    summary: "A fashion storefront that carries an editorial design direction into a responsive Shopify Online Store 2.0 foundation.",
    categories: ["Commerce", "Client work"],
    stack: ["React", "TypeScript", "Shopify Liquid", "CSS"],
    outcomes: ["Translated a visual prototype into a theme architecture", "Improved mobile navigation and storefront polish", "Created a reusable brand asset system"],
    featured: false,
    visual: "storefront",
    disclosure: "public-personal"
  },
  {
    slug: "dst-bresciani",
    title: "DST Bresciani",
    eyebrow: "Digital flagship for premium menswear",
    year: "2026",
    status: "Client storefront foundation",
    role: "Commerce architecture, design system and theme development",
    summary: "A premium Shopify storefront foundation designed to feel like a digital flagship rather than a discount catalogue.",
    categories: ["Commerce", "Client work"],
    stack: ["Shopify", "Liquid", "JavaScript", "CSS", "Theme Check"],
    outcomes: ["Established a documented theme architecture", "Built reusable design tokens and brand assets", "Improved responsive navigation without touching the live theme"],
    featured: false,
    visual: "storefront",
    disclosure: "public-personal"
  },
  {
    slug: "your-favorite-run",
    title: "Your Favorite Run",
    eyebrow: "Event experience and capacity operations",
    year: "2026",
    status: "Event product",
    role: "Design and full-stack development",
    summary: "A responsive event landing experience paired with a private capacity-management panel for organizers.",
    categories: ["Client work", "Mobile"],
    stack: ["Next.js", "TypeScript", "Email workflows", "Vercel"],
    outcomes: ["Paired public storytelling with private operations", "Built responsive brand-first event pages", "Supported applicant and capacity-management workflows"],
    featured: false,
    visual: "event",
    disclosure: "public-personal"
  }
];

export const featuredProjects = projects.filter((project) => project.featured);
export const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
export const projectCategories: ProjectCategory[] = ["Operations", "AI & data", "Mobile", "Commerce", "Client work"];
