---
name: TypeScript conventions
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript conventions

- Follow the repository's TypeScript version, lint/format rules, framework, and module conventions.
- Prefer straightforward types and inferred local types when readable; avoid unnecessary generics or type-level machinery.
- Preserve strictness and existing public interfaces. Avoid `any` and unsafe casts unless justified by existing patterns.
- Reuse existing components, hooks, utilities, and dependencies before introducing new ones.
- Keep state and effects minimal; do not introduce global state or abstractions for isolated behavior.
- Validate untrusted data at actual boundaries, not repeatedly inside already-typed internal code.
- Run targeted typecheck/lint/tests as appropriate; do not generate speculative test matrices.
