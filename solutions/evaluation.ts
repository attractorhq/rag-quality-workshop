import type {
  Answer,
  EvaluationCase,
  RetrievedChunk,
  Trace,
} from "../src/types.js";

export interface Check {
  name: string;
  passed: boolean;
  message: string;
}

export interface CaseEvaluation {
  id: string;
  passed: boolean;
  checks: Check[];
}

export function evaluateAnswer(
  evaluationCase: EvaluationCase,
  answer: Answer,
  chunks: RetrievedChunk[],
  trace: Trace,
): CaseEvaluation {
  const checks: Check[] = [
    {
      name: "abstention",
      passed: answer.abstained === evaluationCase.shouldAbstain,
      message: `Expected abstained=${evaluationCase.shouldAbstain}, observed ${answer.abstained}.`,
    },
    {
      name: "required_text",
      passed: evaluationCase.mustContain.every((text) => answer.text.includes(text)),
      message: "Answer must contain every case-specific fact.",
    },
    {
      name: "required_sources",
      passed: evaluationCase.requiredSources.every((source) =>
        answer.citations.some((citation) => citation.source === source),
      ),
      message: "Every required source must be cited.",
    },
    {
      name: "verifiable_citations",
      passed: citationsAreVerifiable(answer, chunks),
      message: "Citation source, chunk, and quote must match retrieved text.",
    },
    {
      name: "cost_budget",
      passed: trace.estimatedCostUsd <= evaluationCase.maxCostUsd,
      message: `Cost ${trace.estimatedCostUsd} must not exceed ${evaluationCase.maxCostUsd}.`,
    },
  ];
  return {
    id: evaluationCase.query.id,
    passed: checks.every((check) => check.passed),
    checks,
  };
}

export function citationsAreVerifiable(
  answer: Answer,
  chunks: RetrievedChunk[],
): boolean {
  if (!answer.abstained && answer.citations.length === 0) {
    return false;
  }
  return answer.citations.every((citation) =>
    chunks.some(
      (chunk) =>
        chunk.chunkId === citation.chunkId &&
        chunk.source === citation.source &&
        chunk.text.includes(citation.quote),
    ),
  );
}
