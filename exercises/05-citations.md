# Exercise 5: Make citations verifiable

## Learning outcome

Distinguish a citation-shaped string from evidence that can be checked against
the exact context used for generation.

## Task

Write a validator that joins every answer citation to a retrieved `chunkId`,
checks the `source`, and confirms that the cited quote is present verbatim.
Non-abstaining answers without a citation must fail.

Reference:
[`solutions/evaluation.ts`](../solutions/evaluation.ts).

```bash
npm run build
node --test dist/test/grounding-security.test.js
```

## Review

- What should happen when source content changes after an answer is generated?
- Which stable document and chunk versions would you persist?
- How would the user report an accurate quote used in a misleading answer?
