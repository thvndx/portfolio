import assert from "node:assert/strict";
import test from "node:test";
import { featuredProjects, projects } from "../src/data/projects";

test("portfolio has the agreed project shape", () => {
  assert.equal(projects.length, 11);
  assert.equal(featuredProjects.length, 5);
  assert.equal(new Set(projects.map(({ slug }) => slug)).size, projects.length);
});

test("professional projects never expose repository or live URLs", () => {
  const sensitive = projects.filter(({ disclosure }) => disclosure === "sanitized-professional");
  assert.ok(sensitive.length > 0);
  for (const project of sensitive) {
    assert.equal(project.repositoryUrl, undefined);
    assert.equal(project.liveUrl, undefined);
  }
});

test("only flagship projects include long-form sections", () => {
  for (const project of projects) {
    if (project.featured) assert.ok(project.sections && project.sections.length >= 6);
    else assert.equal(project.sections, undefined);
  }
});
