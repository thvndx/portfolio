import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflowPath = new URL("../.github/workflows/portfolio-refresh.yml", import.meta.url);

test("portfolio refresh pins third-party actions and limits stored credentials", async () => {
  const workflow = await readFile(workflowPath, "utf8");
  const actionReferences = [...workflow.matchAll(/^\s*- uses:\s*([^\s#]+)/gm)].map((match) => match[1]);

  assert.ok(actionReferences.length > 0);
  for (const reference of actionReferences) {
    assert.match(reference, /@[0-9a-f]{40}$/);
  }

  const checkoutStep = workflow.match(
    /- uses: actions\/checkout@[0-9a-f]{40}[^\n]*\n((?:\s{8,}.+\n)*)/,
  );
  assert.ok(checkoutStep?.[1]);
  assert.match(checkoutStep[1], /persist-credentials:\s*false/);

  const authIndex = workflow.indexOf("gh auth setup-git --hostname github.com");
  const pushIndex = workflow.indexOf('git push --force-with-lease origin "HEAD:$branch"');
  assert.ok(authIndex >= 0);
  assert.ok(pushIndex > authIndex);
});
