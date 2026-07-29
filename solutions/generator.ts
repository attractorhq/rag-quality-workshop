import type { RecordedAnswer } from "../src/fixtures.js";
import type {
  Answer,
  Generator,
  Query,
  RetrievedChunk,
} from "../src/types.js";

const suspiciousPatterns = [
  /ignore (all |any )?(previous|prior) instructions?/i,
  /reveal (all|every|other)/i,
  /system prompt/i,
  /developer message/i,
];

export class GroundedRecordedGenerator implements Generator {
  readonly #answers: Map<string, RecordedAnswer>;

  constructor(answers: RecordedAnswer[]) {
    this.#answers = new Map(answers.map((answer) => [answer.queryId, answer]));
  }

  async generate(query: Query, chunks: RetrievedChunk[]): Promise<Answer> {
    const safeChunks = chunks.filter((chunk) => !isSuspicious(chunk.text));
    const recorded = this.#answers.get(query.id);
    if (recorded === undefined) {
      return abstain();
    }
    const support = safeChunks.find(
      (chunk) =>
        chunk.source === recorded.source && chunk.text.includes(recorded.quote),
    );
    if (support === undefined) {
      return abstain();
    }
    return {
      text: recorded.text,
      citations: [
        {
          chunkId: support.chunkId,
          source: support.source,
          quote: recorded.quote,
        },
      ],
      grounded: true,
      abstained: false,
    };
  }
}

export function isSuspicious(text: string): boolean {
  return suspiciousPatterns.some((pattern) => pattern.test(text));
}

function abstain(): Answer {
  return {
    text: "I do not have enough trusted information to answer that.",
    citations: [],
    grounded: true,
    abstained: true,
  };
}
