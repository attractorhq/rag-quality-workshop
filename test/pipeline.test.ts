import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluateAnswer } from "../solutions/evaluation.js";
import { GroundedRecordedGenerator } from "../solutions/generator.js";
import { summarizeTraces } from "../solutions/monitoring.js";
import { runPipeline } from "../solutions/pipeline.js";
import { AccessControlledRetriever } from "../solutions/retriever.js";
import {
  loadDocuments,
  loadEvaluationCases,
  loadRecordedAnswers,
} from "../src/fixtures.js";

test("reference pipeline passes every recorded evaluation case", async () => {
  const [documents, cases, records] = await Promise.all([
    loadDocuments(),
    loadEvaluationCases(),
    loadRecordedAnswers(),
  ]);
  const retriever = new AccessControlledRetriever();
  const generator = new GroundedRecordedGenerator(records);
  const evaluations = [];
  const traces = [];

  for (const item of cases) {
    const result = await runPipeline(item.query, documents, retriever, generator);
    traces.push(result.trace);
    evaluations.push(
      evaluateAnswer(item, result.answer, result.chunks, result.trace),
    );
  }

  assert.equal(
    evaluations.every((evaluation) => evaluation.passed),
    true,
    JSON.stringify(evaluations, null, 2),
  );
  const summary = summarizeTraces(traces);
  assert.equal(summary.count, cases.length);
  assert.equal(summary.groundedRate, 1);
  assert.ok(summary.abstentionRate > 0);
  assert.ok(summary.totalEstimatedCostUsd > 0);
});
