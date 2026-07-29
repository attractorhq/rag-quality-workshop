# Exercise 4: Require grounded answers

## Learning outcome

Make generation conditional on retrieved support and abstain when evidence is
missing.

## Task

Implement `Generator.generate` using the recorded answers. Emit an answer only
when its supporting source and exact quote occur in retrieved chunks. Otherwise
return a clear abstention.

Reference: [`solutions/generator.ts`](../solutions/generator.ts).

```bash
npm run build
node --test dist/test/grounding-security.test.js
```

## Review

- Why is a recorded generator useful for an offline workshop?
- How would a live generator be constrained to the same evidence contract?
- Is an abstention always safer, and how would you measure its user cost?
