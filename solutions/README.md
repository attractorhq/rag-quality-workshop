# Reference solutions

These files provide one small, deterministic implementation of the workshop
contracts:

- `retriever.ts` filters authorization before stable token-overlap ranking.
- `generator.ts` ignores suspicious data instructions, requires retrieved
  support, and abstains otherwise.
- `evaluation.ts` checks expected facts, sources, citations, abstention, and
  cost.
- `pipeline.ts` records privacy-conscious trace metadata and estimates cost.
- `monitoring.ts` aggregates operational signals and budget violations.

They demonstrate invariants, not production-grade ranking or injection
detection. Use the review questions in each exercise to identify what a real
service still needs.
