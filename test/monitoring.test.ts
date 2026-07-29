import assert from "node:assert/strict";
import { test } from "node:test";

import {
  findBudgetViolations,
  summarizeTraces,
} from "../solutions/monitoring.js";
import type { Trace } from "../src/types.js";

function trace(id: string, cost: number): Trace {
  return {
    queryId: id,
    retrievedChunkIds: [],
    retrievalMs: 2,
    generationMs: 3,
    totalMs: 5,
    inputTokens: 10,
    outputTokens: 10,
    estimatedCostUsd: cost,
    answerGrounded: true,
    answerAbstained: false,
    events: [],
  };
}

test("cost budget is inclusive and violations identify the query", () => {
  const traces = [trace("boundary", 0.001), trace("over", 0.0011)];

  assert.deepEqual(findBudgetViolations(traces, 0.001), [
    "over: estimated cost 0.0011 exceeds 0.001",
  ]);
  assert.equal(summarizeTraces(traces).averageLatencyMs, 5);
});

test("empty trace summary is finite and explicit", () => {
  assert.deepEqual(summarizeTraces([]), {
    count: 0,
    groundedRate: 0,
    abstentionRate: 0,
    averageLatencyMs: 0,
    totalEstimatedCostUsd: 0,
  });
});
