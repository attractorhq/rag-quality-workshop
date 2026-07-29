# Exercise 8: Trace quality, latency, and cost

## Learning outcome

Connect a user-visible answer to retrieval, generation, grounding, latency,
token use, and unit cost without recording unnecessary sensitive data.

## Task

Wrap the pipeline with a `Trace`. Estimate tokens deterministically, calculate
cost from explicit rates, aggregate grounding and abstention rates, and report
per-query budget violations. Budget comparisons must be inclusive.

References: [`solutions/pipeline.ts`](../solutions/pipeline.ts) and
[`solutions/monitoring.ts`](../solutions/monitoring.ts).

```bash
npm run build
node --test dist/test/pipeline.test.js dist/test/monitoring.test.js
```

## Review

- Which trace fields identify regressions after a prompt, model, or corpus
  change?
- Which fields require redaction, sampling, or shorter retention?
- What alert combines spend with useful outcomes rather than raw request count?
