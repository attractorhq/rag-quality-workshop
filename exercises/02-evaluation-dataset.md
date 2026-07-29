# Exercise 2: Create an evaluation dataset

## Learning outcome

Turn quality claims into versioned cases that include harmful failure modes and
budget boundaries.

## Task

Inspect [`data/evaluation-cases.json`](../data/evaluation-cases.json) and the
`EvaluationCase` interface. Run:

```bash
npm run build
node --test dist/test/dataset.test.js
```

Add one multilingual or ambiguous support case. Define the minimum required
facts, sources, abstention decision, and cost. Keep the query ID unique and add
a matching recorded answer only when the corpus supports it.

## Review

- Does the set include ordinary success, no-answer, injection, and tenant
  isolation?
- Which production segments are still absent?
- Who should decide whether an abstention is correct?
