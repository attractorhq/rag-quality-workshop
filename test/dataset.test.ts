import assert from "node:assert/strict";
import { test } from "node:test";

import { loadEvaluationCases } from "../src/fixtures.js";

test("evaluation dataset has unique IDs and positive, abstention, ACL, and injection cases", async () => {
  const cases = await loadEvaluationCases();
  const ids = cases.map((item) => item.query.id);

  assert.equal(new Set(ids).size, ids.length);
  assert.ok(cases.some((item) => item.requiredSources.length > 0));
  assert.ok(cases.some((item) => item.shouldAbstain));
  assert.ok(cases.some((item) => item.query.actor.tenantId !== undefined));
  assert.ok(ids.includes("injection"));
});
