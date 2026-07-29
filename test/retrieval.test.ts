import assert from "node:assert/strict";
import { test } from "node:test";

import { AccessControlledRetriever } from "../solutions/retriever.js";
import { loadDocuments } from "../src/fixtures.js";
import type { Query } from "../src/types.js";

test("retrieval filters access before ranking and returns relevant tenant data", async () => {
  const documents = await loadDocuments();
  const query: Query = {
    id: "acme",
    text: "What is my July invoice status?",
    actor: { tenantId: "acme", roles: ["customer"] },
  };
  const chunks = await new AccessControlledRetriever().retrieve(query, documents);
  const sources = chunks.map((chunk) => chunk.source);

  assert.ok(sources.includes("customers/acme/invoices"));
  assert.ok(!sources.includes("customers/northstar/invoices"));
  assert.ok(!sources.includes("internal/escalation"));
});

test("public users never retrieve tenant or staff documents", async () => {
  const documents = await loadDocuments();
  const query: Query = {
    id: "public",
    text: "invoice security escalation",
    actor: { roles: [] },
  };
  const chunks = await new AccessControlledRetriever().retrieve(query, documents);

  assert.ok(chunks.every((chunk) => chunk.access === "public"));
});

test("a zero retrieval limit returns no chunks", async () => {
  const documents = await loadDocuments();
  const query: Query = {
    id: "limit",
    text: "password reset",
    actor: { roles: [] },
  };
  assert.deepEqual(
    await new AccessControlledRetriever().retrieve(query, documents, 0),
    [],
  );
});
