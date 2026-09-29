import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error The automation script is intentionally dependency-free JavaScript.
import { sanitizeCandidate, sanitizeRepository } from "../scripts/refresh-repository-activity.mjs";

test("repository activity retains only safe metadata", () => {
  const result = sanitizeRepository({ full_name: "thvndx/example", private: false, html_url: "https://github.com/thvndx/example", pushed_at: "2026-09-01T00:00:00Z", language: "TypeScript", description: "must not be copied" }, { repository: "thvndx/example", publishLink: false }, "example");
  assert.deepEqual(result, { projectSlug: "example", repository: "thvndx/example", repositoryUrl: null, lastPushedAt: "2026-09-01T00:00:00Z", primaryLanguage: "TypeScript" });
});

test("private or mismatched repositories are rejected", () => {
  assert.equal(sanitizeRepository({ full_name: "thvndx/example", private: true, html_url: "https://github.com/thvndx/example" }, { repository: "thvndx/example", publishLink: false }, "example"), null);
  assert.equal(sanitizeRepository({ full_name: "other/example", private: false, html_url: "https://github.com/other/example" }, { repository: "thvndx/example", publishLink: false }, "example"), null);
});

test("candidate discovery excludes forks and private repositories", () => {
  assert.equal(sanitizeCandidate({ full_name: "thvndx/private", private: true, fork: false, html_url: "https://github.com/thvndx/private" }), null);
  assert.equal(sanitizeCandidate({ full_name: "thvndx/fork", private: false, fork: true, html_url: "https://github.com/thvndx/fork" }), null);
});
