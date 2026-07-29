import type { Document, Query, RetrievedChunk, Retriever } from "../src/types.js";

const ignoredTerms = new Set([
  "a",
  "all",
  "and",
  "any",
  "do",
  "does",
  "how",
  "i",
  "in",
  "is",
  "it",
  "my",
  "of",
  "the",
  "to",
  "what",
]);

export class AccessControlledRetriever implements Retriever {
  async retrieve(
    query: Query,
    documents: Document[],
    limit = 3,
  ): Promise<RetrievedChunk[]> {
    const queryTerms = tokens(query.text);
    return documents
      .filter((document) => canRead(query, document))
      .map((document) => {
        const documentTerms = new Set(
          tokens(`${document.title} ${document.content} ${document.tags.join(" ")}`),
        );
        const matches = queryTerms.filter((term) => documentTerms.has(term));
        return {
          documentId: document.id,
          chunkId: `${document.id}:0`,
          text: document.content,
          score: queryTerms.length === 0 ? 0 : matches.length / queryTerms.length,
          source: document.source,
          access: document.access,
        } satisfies RetrievedChunk;
      })
      .filter((chunk) => chunk.score > 0)
      .sort(
        (left, right) =>
          right.score - left.score || left.documentId.localeCompare(right.documentId),
      )
      .slice(0, Math.max(0, limit));
  }
}

export function canRead(query: Query, document: Document): boolean {
  if (document.access === "public") {
    return true;
  }
  if (document.access === "staff") {
    return query.actor.roles.includes("staff");
  }
  return (
    query.actor.roles.includes("customer") &&
    query.actor.tenantId !== undefined &&
    document.tenantId === query.actor.tenantId
  );
}

function tokens(value: string): string[] {
  return (value.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (term) => term.length > 1 && !ignoredTerms.has(term),
  );
}
