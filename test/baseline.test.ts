import assert from "node:assert/strict";
import { test } from "node:test";

import { loadDocuments } from "../src/fixtures.js";
import { PlausibleGenerator, PlausibleRetriever } from "../src/starter.js";
import type { Query } from "../src/types.js";

test("baseline records the unsafe behaviors the workshop will fix", async () => {
  const documents = await loadDocuments();
  const query: Query = {
    id: "baseline",
    text: "How do I reset my password?",
    actor: { roles: [] },
  };
  const chunks = await new PlausibleRetriever().retrieve(query, documents);
  const answer = await new PlausibleGenerator().generate(query, chunks);

  assert.ok(chunks.some((chunk) => chunk.access !== "public"));
  assert.equal(answer.grounded, false);
  assert.equal(answer.citations.length, 0);
  assert.equal(answer.abstained, false);
});
