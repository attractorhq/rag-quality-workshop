export type AccessLevel = "public" | "customer" | "staff";

export interface Document {
  id: string;
  title: string;
  content: string;
  source: string;
  access: AccessLevel;
  tenantId?: string;
  tags: string[];
}

export interface Query {
  id: string;
  text: string;
  actor: {
    tenantId?: string;
    roles: string[];
  };
}

export interface RetrievedChunk {
  documentId: string;
  chunkId: string;
  text: string;
  score: number;
  source: string;
  access: AccessLevel;
}

export interface Citation {
  chunkId: string;
  source: string;
  quote: string;
}

export interface Answer {
  text: string;
  citations: Citation[];
  grounded: boolean;
  abstained: boolean;
}

export interface TraceEvent {
  name: string;
  detail: string;
}

export interface Trace {
  queryId: string;
  retrievedChunkIds: string[];
  retrievalMs: number;
  generationMs: number;
  totalMs: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  answerGrounded: boolean;
  answerAbstained: boolean;
  events: TraceEvent[];
}

export interface Retriever {
  retrieve(query: Query, documents: Document[], limit?: number): Promise<RetrievedChunk[]>;
}

export interface Generator {
  generate(query: Query, chunks: RetrievedChunk[]): Promise<Answer>;
}

export interface EvaluationCase {
  query: Query;
  mustContain: string[];
  requiredSources: string[];
  shouldAbstain: boolean;
  maxCostUsd: number;
}
