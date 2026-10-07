export const resources = {
  az900: ['AZ-900 · Microsoft Learn', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/'],
  actions: ['GitHub Actions · Microsoft Learn', 'https://learn.microsoft.com/en-us/credentials/certifications/github-actions/'],
  ai200: ['AI-200 · Microsoft Learn', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/'],
  sc900: ['SC-900 · Microsoft Learn', 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-900/'],
  docker: ['Docker · Getting started', 'https://docs.docker.com/get-started/'],
  python: ['Python · Official tutorial', 'https://docs.python.org/3/tutorial/'],
  labs: ['PortSwigger · Free security labs', 'https://portswigger.net/web-security/all-labs'],
  owasp: ['OWASP · Juice Shop', 'https://owasp.org/projects/juice-shop?tab=overview'],
  azure: ['Azure · Developer documentation', 'https://learn.microsoft.com/en-us/azure/developer/'],
};

const task = (id, title, hours, week, criteria, resource, kind = 'learning') => ({ id, title, hours, week, criteria, resource, kind });
export const phases = [
  { id: 'foundation', title: 'Azure foundation', label: '01', weeks: [1, 4], description: 'Finish your foundation and understand what you are deploying.', tasks: [
    task('az-concepts', 'Cloud concepts & shared responsibility', 3, 1, 'Explain IaaS, PaaS, SaaS, availability and shared responsibility without notes.', 'az900'),
    task('az-services', 'Compute, storage & networking', 4, 1, 'Choose suitable Azure compute, storage and networking for the support application; explain tradeoffs.', 'az900'),
    task('az-governance', 'Identity, governance & cost controls', 4, 2, 'Explain Entra ID, RBAC, resource groups and budgets. Record a pricing estimate and cleanup checklist.', 'az900'),
    task('az-deploy', 'First Azure deployment', 5, 3, 'Deploy a small synthetic-data app, capture the service choices and running-cost estimate, then clean up unused resources.', 'azure', 'milestone'),
    task('az-readiness', 'AZ-900 review & exam readiness', 2, 4, 'Cover each current exam objective; record two spaced practice scores of at least 85% and explain the missed answers. Record an exam result separately.', 'az900'),
  ]},
  { id: 'delivery', title: 'Secure software delivery', label: '02', weeks: [5, 12], description: 'Ship reliably, with a pipeline you understand and can troubleshoot.', tasks: [
    task('delivery-plan', 'Define the capstone & synthetic data', 4, 5, 'Describe the support problem, two user roles, minimum workflow and synthetic dataset; create a TypeScript interface and repository.', 'azure', 'milestone'),
    task('delivery-ci', 'Tests & GitHub Actions workflows', 7, 6, 'Build a workflow that runs useful tests and fails on a broken change; understand triggers, caching and artifacts.', 'actions'),
    task('delivery-container', 'Docker & reproducible local startup', 6, 7, 'Build and run a container from a clean checkout; document configuration and health checks.', 'docker'),
    task('delivery-permissions', 'Secure workflow permissions & dependencies', 6, 8, 'Apply least privilege, dependency checks, protected secrets and Azure OIDC; demonstrate that secrets are absent from logs.', 'actions'),
    task('delivery-deploy', 'Azure deployment & approval gate', 7, 10, 'Deploy the capstone through CI with approval and a smoke check. Document how to troubleshoot a failed release.', 'azure', 'milestone'),
    task('delivery-rollback', 'Rehearse rollback & publish delivery evidence', 6, 12, 'Roll back a deliberately failed demonstration release. Save the procedure, test output and a short video; begin suitable applications.', 'actions', 'milestone'),
  ]},
  { id: 'security', title: 'Application-security foundation', label: '03', weeks: [13, 22], description: 'Learn to recognize weaknesses, explain their impact and verify fixes.', tasks: [
    task('security-basics', 'HTTP, sessions, identity & security concepts', 6, 13, 'Explain requests, cookies, sessions, TLS, authentication versus authorization, least privilege and incident basics. Use the current SC-900 guide.', 'sc900'),
    task('security-threats', 'Threat model & abuse cases', 4, 14, 'Map data flow, trust boundaries, assets and five abuse cases for your capstone; record mitigations.', 'owasp', 'milestone'),
    ...Array.from({length: 20}, (_, i) => {
      const topics = ['SQL injection', 'Authentication', 'Access control', 'Cross-site scripting', 'Path traversal'];
      const topic = topics[Math.floor(i / 4)];
      return task(`security-lab-${String(i + 1).padStart(2, '0')}`, `Lab ${String(i + 1).padStart(2, '0')} · ${topic}`, 1, 15 + Math.floor(i / 4), 'Choose a distinct introductory lab in this topic. Record its title, URL, result, cause and defensive lesson. Use only authorized labs.', 'labs', 'lab');
    }),
    ...['Injection', 'Broken access control', 'Cross-site scripting'].map((topic, i) => task(`security-writeup-${i + 1}`, `Write-up ${i + 1} · ${topic}`, 3, 20 + i, 'Publish a concise lab or demo-code write-up: root cause, impact, reproduction, mitigation and a test verifying the fix. Link the evidence.', 'labs', 'writeup')),
    task('security-hardening', 'Harden the capstone & test access boundaries', 6, 22, 'Add authorization tests, safe input handling, protected secrets, rate controls and useful security logs. Demonstrate a denied cross-user request.', 'owasp', 'milestone'),
  ]},
  { id: 'ai', title: 'AI development', label: '04', weeks: [23, 40], description: 'Add a useful AI feature, then measure its quality and failure modes.', tasks: [
    task('ai-python', 'Python fundamentals & API development', 14, 23, 'Use functions, collections, exceptions, environments and tests; implement a small Python API with documented inputs and outputs.', 'python'),
    task('ai-container', 'Containerize the Python API', 8, 26, 'Connect the TypeScript interface to a containerized Python API. Start both from a clean checkout.', 'docker', 'milestone'),
    task('ai-services', 'Azure SDKs, identity & service integration', 10, 28, 'Use Azure SDKs with managed identity where applicable; explain local versus hosted configuration and permissions.', 'ai200'),
    task('ai-messaging', 'Messaging & background processing', 8, 30, 'Implement a background operation; handle retries, duplicates and provider timeouts without silently losing work.', 'ai200'),
    task('ai-retrieval', 'Data services, vectors & cited retrieval', 12, 32, 'Index synthetic support documents, retrieve relevant passages and show citations. Explain your data and vector-store choices.', 'ai200', 'milestone'),
    task('ai-safety', 'Unsupported answers & hostile instructions', 8, 35, 'Handle unsupported questions, scope access to user-permitted documents and evaluate hostile retrieved instructions with documented expected behavior.', 'ai200', 'milestone'),
    task('ai-evaluation', 'Evaluate quality, latency & cost', 10, 37, 'Create at least 20 representative cases, including unsupported and adversarial questions. Record quality, latency, estimated cost and limitations.', 'ai200', 'milestone'),
    task('ai-monitoring', 'Secure, monitor & troubleshoot Azure solutions', 10, 39, 'Add health checks, structured logs and failure alerts; demonstrate a provider failure and investigate it. Run short cloud trials and remove resources afterward.', 'ai200'),
  ]},
  { id: 'consolidation', title: 'Consolidation & applications', label: '05', weeks: [41, 52], description: 'Turn your work into evidence that an employer can assess.', tasks: [
    task('final-objectives', 'AI-200 objective-by-objective audit', 12, 41, 'Review the current study guide, identify gaps and demonstrate each objective. Recheck availability and syllabus before any booking.', 'ai200'),
    task('final-case-study', 'Publish the capstone case study', 8, 44, 'Publish the problem, architecture and data-flow diagrams, measured results, security decisions, limitations and cost estimate.', 'azure', 'milestone'),
    task('final-demo', 'Rehearse demonstration & recovery', 6, 46, 'Record a concise demo. Reproduce deployment from a clean checkout, an access denial, cited retrieval, provider failure and rollback.', 'actions', 'milestone'),
    task('final-practice', 'Practice & close exam gaps', 10, 48, 'Use legitimate practice materials. Target two spaced assessments of at least 85% when available; otherwise record current-objective demonstrations.', 'ai200'),
    task('final-applications', 'Portfolio, interviews & targeted applications', 6, 50, 'Link your earned credentials and case study; prepare technical explanations and record suitable applications without waiting for every exam.', 'azure', 'milestone'),
    task('final-review', 'Year review & next learning decision', 4, 52, 'Review evidence, job feedback, spending and skill gaps; choose the next step from demonstrated needs rather than badge count.', 'ai200'),
  ]},
];
export const tasks = phases.flatMap(phase => phase.tasks.map(t => ({ ...t, phaseId: phase.id })));
export const certifications = [
  { id: 'az900', name: 'AZ-900', title: 'Azure Fundamentals', priority: 'Finish first · budget-dependent exam', resource: 'az900' },
  { id: 'ai200', name: 'AI-200', title: 'Azure AI Cloud Developer Associate', priority: 'Main technical target · book when ready and affordable', resource: 'ai200' },
  { id: 'gh200', name: 'GH-200', title: 'GitHub Actions', priority: 'Learn now · paid exam deferred', resource: 'actions' },
  { id: 'sc900', name: 'SC-900', title: 'Security, Compliance & Identity', priority: 'Selected learning · paid exam deferred', resource: 'sc900' },
];
