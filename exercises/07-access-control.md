# Exercise 7: Enforce access control before ranking

## Learning outcome

Prevent cross-tenant and staff-data exposure across retrieval, caches, traces,
and generation.

## Task

Implement `canRead` for public, same-tenant customer, and staff documents.
Filter before computing a score. Verify that an Acme query cannot retrieve
Northstar or staff content and that a public user sees only public content.

Reference: [`solutions/retriever.ts`](../solutions/retriever.ts).

```bash
npm run build
node --test dist/test/retrieval.test.js
```

## Review

- Why is filtering after generation already too late?
- Which identity and policy versions should a retrieval trace include?
- How would shared caches preserve the same authorization boundary?
