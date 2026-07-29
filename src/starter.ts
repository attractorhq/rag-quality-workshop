import type {
  Answer,
  Document,
  Generator,
  Query,
  RetrievedChunk,
  Retriever,
} from "./types.js";

/**
 * Deliberately flawed: no tokenization, access control, or relevance threshold.
 */
export class PlausibleRetriever implements Retriever {
  async retrieve(
    query: Query,
    documents: Document[],
    limit = 3,
  ): Promise<RetrievedChunk[]> {
    const words = query.text.toLowerCase().split(" ");
    return documents
      .map((document) => ({
        documentId: document.id,
        chunkId: `${document.id}:0`,
        text: document.content,
        score: words.filter((word) => document.content.toLowerCase().includes(word)).length,
        source: document.source,
        access: document.access,
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, limit);
  }
}

/**
 * Deliberately flawed: treats retrieved text as instructions and invents no
 * verifiable citations or abstention behavior.
 */
export class PlausibleGenerator implements Generator {
  async generate(_query: Query, chunks: RetrievedChunk[]): Promise<Answer> {
    const first = chunks[0];
    return {
      text: first?.text ?? "I am not sure, but it is probably supported.",
      citations: [],
      grounded: false,
      abstained: false,
    };
  }
}
