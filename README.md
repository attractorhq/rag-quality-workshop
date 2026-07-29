# RAG Quality Workshop

Hands-on TypeScript exercises for taking a RAG prototype from plausible to
production-ready.

The workshop starts with a deliberately flawed support-search application. You
will turn its plausible answers into an evaluated, grounded, cited,
injection-resistant, access-controlled, observable, and cost-aware pipeline.

Everything runs against a synthetic, freely redistributable corpus and recorded
answers. No API key, model provider, paid service, or network connection is
used at runtime.

## Quick start

Requirements: Node.js 20 or newer.

```bash
npm ci
npm test
npm run demo
```

Tests execute the reference implementation and the known baseline behavior.
Read the exercises in order, copy the starter into your own branch, and use the
focused test command shown in each chapter.

## Learning path

1. [Measure the plausible baseline](exercises/01-baseline.md)
2. [Create an evaluation dataset](exercises/02-evaluation-dataset.md)
3. [Improve retrieval](exercises/03-retrieval.md)
4. [Require grounded answers](exercises/04-grounding.md)
5. [Make citations verifiable](exercises/05-citations.md)
6. [Treat retrieved instructions as untrusted](exercises/06-prompt-injection.md)
7. [Enforce access control before ranking](exercises/07-access-control.md)
8. [Trace quality, latency, and cost](exercises/08-monitoring-and-cost.md)

Each chapter states its learning outcome, task, relevant interfaces, test
command, and review questions. Reference code lives in [`solutions/`](solutions/).

## Stable interfaces

[`src/types.ts`](src/types.ts) defines `Document`, `Query`, `RetrievedChunk`,
`Answer`, `Trace`, `Retriever`, and `Generator`. The synthetic corpus, cases,
and recorded answers use those version 1 contracts.

The workshop intentionally keeps retrieval and generation small. The patterns
transfer to production systems; the toy algorithms are not a claim that token
overlap or recorded generation is sufficient for a real product.

## Development

```bash
npm ci
npm test
npm run typecheck
```

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and
[SUPPORT.md](SUPPORT.md). Licensed under [Apache-2.0](LICENSE).
