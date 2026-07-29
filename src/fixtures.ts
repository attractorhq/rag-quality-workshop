import { readFile } from "node:fs/promises";

import type { Document, EvaluationCase } from "./types.js";

export interface RecordedAnswer {
  queryId: string;
  text: string;
  source: string;
  quote: string;
}

export async function loadDocuments(): Promise<Document[]> {
  return loadJson<Document[]>("corpus.json");
}

export async function loadEvaluationCases(): Promise<EvaluationCase[]> {
  return loadJson<EvaluationCase[]>("evaluation-cases.json");
}

export async function loadRecordedAnswers(): Promise<RecordedAnswer[]> {
  return loadJson<RecordedAnswer[]>("recorded-answers.json");
}

async function loadJson<T>(name: string): Promise<T> {
  const source = new URL(`../../data/${name}`, import.meta.url);
  return JSON.parse(await readFile(source, "utf8")) as T;
}
