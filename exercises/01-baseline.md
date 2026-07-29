# Exercise 1: Measure the plausible baseline

## Learning outcome

Recognize why a fluent answer is not evidence of retrieval quality, grounding,
or safe authorization.

## Task

Read [`src/starter.ts`](../src/starter.ts). Run:

```bash
npm run build
node --test dist/test/baseline.test.js
```

Trace a public password query through both classes. Record which restricted
chunks are returned, whether the answer can be verified, what happens with no
relevant result, and which production decisions cannot be made from this demo.

## Review

- Why does returning a fixed top three create plausible irrelevant context?
- Which missing signal would hide a cross-tenant retrieval incident?
- What baseline metrics would you capture before changing the pipeline?
