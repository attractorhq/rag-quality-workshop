import type { Trace } from "../src/types.js";

export interface TraceSummary {
  count: number;
  groundedRate: number;
  abstentionRate: number;
  averageLatencyMs: number;
  totalEstimatedCostUsd: number;
}

export function summarizeTraces(traces: Trace[]): TraceSummary {
  if (traces.length === 0) {
    return {
      count: 0,
      groundedRate: 0,
      abstentionRate: 0,
      averageLatencyMs: 0,
      totalEstimatedCostUsd: 0,
    };
  }
  return {
    count: traces.length,
    groundedRate:
      traces.filter((trace) => trace.answerGrounded).length / traces.length,
    abstentionRate:
      traces.filter((trace) => trace.answerAbstained).length / traces.length,
    averageLatencyMs:
      traces.reduce((sum, trace) => sum + trace.totalMs, 0) / traces.length,
    totalEstimatedCostUsd: traces.reduce(
      (sum, trace) => sum + trace.estimatedCostUsd,
      0,
    ),
  };
}

export function findBudgetViolations(
  traces: Trace[],
  perQueryBudgetUsd: number,
): string[] {
  return traces
    .filter((trace) => trace.estimatedCostUsd > perQueryBudgetUsd)
    .map(
      (trace) =>
        `${trace.queryId}: estimated cost ${trace.estimatedCostUsd} exceeds ${perQueryBudgetUsd}`,
    );
}
