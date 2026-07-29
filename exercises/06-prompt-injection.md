# Exercise 6: Treat retrieved instructions as untrusted

## Learning outcome

Keep data-plane content from silently becoming control-plane instructions.

## Task

Inspect `injected-note` in the corpus. Add detection for common instruction and
exfiltration phrases, exclude suspicious chunks from generation, and make the
pipeline abstain for the injection case. Do not treat keyword detection as a
complete production defense.

Reference: [`solutions/generator.ts`](../solutions/generator.ts).

```bash
npm run build
node --test dist/test/grounding-security.test.js
```

## Review

- Which defenses belong before retrieval, after retrieval, and at tool use?
- Why must authorization remain effective even if detection misses an attack?
- What evidence would an incident responder need without logging sensitive
  content?
