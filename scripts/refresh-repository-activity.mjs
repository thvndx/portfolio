import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const sourceUrlPattern = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const repoPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export function sanitizeRepository(repo, source, projectSlug) {
  if (!repo || repo.private !== false || typeof repo.full_name !== "string" || !repoPattern.test(repo.full_name)) return null;
  if (repo.full_name.toLowerCase() !== source.repository.toLowerCase()) return null;
  if (typeof repo.html_url !== "string" || !sourceUrlPattern.test(repo.html_url)) return null;
  return {
    projectSlug,
    repository: repo.full_name,
    repositoryUrl: source.publishLink ? repo.html_url : null,
    lastPushedAt: typeof repo.pushed_at === "string" ? repo.pushed_at : null,
    primaryLanguage: typeof repo.language === "string" ? repo.language.slice(0, 40) : null,
  };
}

export function sanitizeCandidate(repo) {
  if (!repo || repo.private !== false || repo.fork === true || typeof repo.full_name !== "string" || !repoPattern.test(repo.full_name)) return null;
  if (typeof repo.html_url !== "string" || !sourceUrlPattern.test(repo.html_url)) return null;
  return { repository: repo.full_name, repositoryUrl: repo.html_url };
}

async function github(path, token) {
  const response = await fetch(`https://api.github.com${path}`, { headers: { Accept: "application/vnd.github+json", "User-Agent": "conold-portfolio-refresh", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub API returned ${response.status} for an allowlisted request`);
  return response.json();
}

async function main() {
  const config = JSON.parse(await readFile(new URL("../portfolio.sources.json", import.meta.url), "utf8"));
  const token = process.env.GITHUB_TOKEN;
  const activity = [];
  for (const source of config.approved) {
    if (!repoPattern.test(source.repository) || !/^[a-z0-9-]+$/.test(source.projectSlug)) throw new Error("Invalid repository source configuration");
    const repo = await github(`/repos/${source.repository}`, token);
    const safe = sanitizeRepository(repo, source, source.projectSlug);
    if (safe) activity.push(safe);
  }
  const approved = new Set(config.approved.map((item) => item.repository.toLowerCase()));
  const candidates = [];
  for (const account of config.accounts) {
    if (!/^[A-Za-z0-9-]+$/.test(account)) throw new Error("Invalid discovery account");
    const repos = await github(`/users/${account}/repos?type=owner&sort=updated&per_page=100`, token) ?? [];
    for (const repo of repos) {
      if (approved.has(String(repo.full_name).toLowerCase())) continue;
      const safe = sanitizeCandidate(repo);
      if (safe) candidates.push(safe);
    }
  }
  activity.sort((a, b) => a.projectSlug.localeCompare(b.projectSlug));
  candidates.sort((a, b) => a.repository.localeCompare(b.repository));
  await writeFile(new URL("../src/data/repository-activity.generated.json", import.meta.url), `${JSON.stringify(activity, null, 2)}\n`);
  await writeFile(new URL("../src/data/portfolio-candidates.generated.json", import.meta.url), `${JSON.stringify(candidates, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main().catch((error) => { console.error(error.message); process.exit(1); });
