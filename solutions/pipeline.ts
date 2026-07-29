import { performance } from "node:perf_hooks";

import type {
  Answer,
  Document,
  Generator,
  Query,
  Retriever,
  Trace,
} from "../src/types.js";

export interface PipelineResult {
  answer: Answer;
  trace: Trace;
  chunks: Awaited<ReturnType<Retriever["retrieve"]>>;
}

export async function runPipeline(
  query: Query,
  documents: Document[],
  retriever: Retriever,
  generator: Generator,
): Promise<PipelineResult> {
  const started = performance.now();
  const retrievalStarted = performance.now();
  const chunks = await retriever.retrieve(query, documents);
  const retrievalFinished = performance.now();
  const answer = await generator.generate(query, chunks);
  const finished = performance.now();
  const inputTokens = estimateTokens(
    [query.text, ...chunks.map((chunk) => chunk.text)].join(" "),
  );
  const outputTokens = estimateTokens(answer.text);
  const estimatedCostUsd =
    (inputTokens * 0.2 + outputTokens * 0.6) / 1_000_000;

  return {
    answer,
    chunks,
    trace: {
      queryId: query.id,
      retrievedChunkIds: chunks.map((chunk) => chunk.chunkId),
      retrievalMs: retrievalFinished - retrievalStarted,
      generationMs: finished - retrievalFinished,
      totalMs: finished - started,
      inputTokens,
      outputTokens,
      estimatedCostUsd,
      answerGrounded: answer.grounded,
      answerAbstained: answer.abstained,
      events: [
        {
          name: "retrieval",
          detail: `${chunks.length} access-controlled chunks retrieved`,
        },
        {
          name: "generation",
          detail: answer.abstained
            ? "generator abstained"
            : `${answer.citations.length} verified citation(s) emitted`,
        },
      ],
    },
  };
}

export function estimateTokens(text: string): number {
  const characters = [...text].length;
  return characters === 0 ? 0 : Math.ceil(characters / 4);
}
