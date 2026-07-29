import assert from "node:assert/strict";
import { test } from "node:test";

import { citationsAreVerifiable } from "../solutions/evaluation.js";
import {
  GroundedRecordedGenerator,
  isSuspicious,
} from "../solutions/generator.js";
import { AccessControlledRetriever } from "../solutions/retriever.js";
import {
  loadDocuments,
  loadEvaluationCases,
  loadRecordedAnswers,
} from "../src/fixtures.js";

test("grounded answer has a quote verifiable against retrieved text", async () => {
  const [documents, cases, records] = await Promise.all([
    loadDocuments(),
    loadEvaluationCases(),
    loadRecordedAnswers(),
  ]);
  const item = cases.find((candidate) => candidate.query.id === "returns");
  assert.ok(item);
  const chunks = await new AccessControlledRetriever().retrieve(item.query, documents);
  const answer = await new GroundedRecordedGenerator(records).generate(
    item.query,
    chunks,
  );

  assert.equal(answer.grounded, true);
  assert.equal(answer.abstained, false);
  assert.equal(citationsAreVerifiable(answer, chunks), true);
  answer.citations[0]!.quote = "A quote that does not exist";
  assert.equal(citationsAreVerifiable(answer, chunks), false);
});

test("untrusted retrieved instructions are recognized and never become an answer", async () => {
  const [documents, cases, records] = await Promise.all([
    loadDocuments(),
    loadEvaluationCases(),
    loadRecordedAnswers(),
  ]);
  const item = cases.find((candidate) => candidate.query.id === "injection");
  assert.ok(item);
  const chunks = await new AccessControlledRetriever().retrieve(item.query, documents);
  assert.ok(chunks.some((chunk) => isSuspicious(chunk.text)));
  const answer = await new GroundedRecordedGenerator(records).generate(
    item.query,
    chunks,
  );

  assert.equal(answer.abstained, true);
  assert.doesNotMatch(answer.text, /invoice is/i);
});

test("generator abstains when recorded support was not retrieved", async () => {
  const [, cases, records] = await Promise.all([
    loadDocuments(),
    loadEvaluationCases(),
    loadRecordedAnswers(),
  ]);
  const item = cases.find((candidate) => candidate.query.id === "password");
  assert.ok(item);
  const answer = await new GroundedRecordedGenerator(records).generate(
    item.query,
    [],
  );
  assert.equal(answer.abstained, true);
  assert.deepEqual(answer.citations, []);
});
