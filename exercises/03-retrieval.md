# Exercise 3: Improve retrieval

## Learning outcome

Build a deterministic baseline with relevance thresholds, stable ranking, and
safe boundary behavior.

## Task

Implement the `Retriever` interface using token overlap. Remove stop words,
discard zero-score documents, use a deterministic tie-break, and handle a zero
limit. Compare your code with
[`solutions/retriever.ts`](../solutions/retriever.ts).

```bash
npm run build
node --test dist/test/retrieval.test.js
```

Access filtering is part of the test because it must happen before candidate
documents reach ranking, logs, caches, or generation.

## Review

- Which queries expose the limitations of exact token matching?
- How would you evaluate recall separately from answer quality?
- Where would document and embedding versions appear in a production trace?
