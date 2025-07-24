# Copilot Instructions: Code Generation Guide

You are an expert in JavaScript, TypeScript, React, Node.js, Next.js, and Tailwind CSS. You write clean, idiomatic, production-grade code that balances performance, readability, and maintainability.

---

## Code Style and Structure

- Write **concise**, **modular**, and **readable** JavaScript/TypeScript following [Standard.js](https://standardjs.com/) conventions.
- Prefer composition and iteration over duplication or deeply nested control flow.
- Use **clear, expressive variable names** with auxiliary verbs or semantic context (e.g., `isLoading`, `hasError`, `userData`, `fetchStatus`).
- Keep functions small and single-purpose; extract logic into helpers or utilities when reusable.
- Prefer clarity over cleverness.

---

## Syntax & Linting Rules (Standard.js)

- Always use `===` and `!==`; avoid `==` unless coercion is explicitly desired.
- Prefer `const` and `let` over `var`; default to `const`.

---

## Naming Conventions

- Use `kebab-case` for directory and file names (e.g., `components/auth-wizard/step-header.tsx`).
- Use `PascalCase` for React components, classes, and constructors.
- Use `camelCase` for variables and functions.

---

## React & Next.js Best Practices

- Use hooks correctly:
  - `useCallback` to memoize callbacks passed to children.
  - `useMemo` for expensive computations.
  - `useReducer` for complex state logic.
  - `useEffect` with proper cleanup and dependency management.
- Avoid inline functions or objects in JSX to prevent unnecessary re-renders.
- Use `children` and the render props pattern for reusable components.
- Use `React.forwardRef` only when required.
- Add error boundaries using `getDerivedStateFromError` and `componentDidCatch`, or libraries.

---

## UI & Styling with Tailwind CSS

- Use Tailwind CSS with a **mobile-first**, responsive approach.
- Extract repeated Tailwind class sets into utility functions or class name helpers when needed.
- Use `@apply` sparingly in semantic `*.module.css` files for complex styling.

---

## Performance Optimization

- Keep render trees shallow.
- Prefer modular styles over global CSS.
- Use `memo`, `useMemo`, and `useCallback` for performance-sensitive cases.

---

## Forms & Validation

- Validate and sanitize all user inputs.
- Ensure forms are accessible with `label`, `fieldset`, and `aria-*` attributes.

---

## Error Handling

- Handle edge cases and errors early with **early returns**.
- Avoid deep nesting in control flow.
- Provide user-friendly error messages and log errors clearly in dev.
- Use return-value-based error modeling in Server Actions when possible.

---

## Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.).
- Add appropriate ARIA roles and attributes.
- Ensure all interactive elements are keyboard-navigable and focusable.
- Test accessibility with screen readers and automated tools (e.g., axe, Lighthouse).

---

## Security

- Avoid using `dangerouslySetInnerHTML`, unless the content is explicitly sanitized.
- Do not expose sensitive data in client code or logs.

---

## Next.js Conventions

Follow official [Next.js documentation](https://nextjs.org/docs) for:

- Data fetching (`getStaticProps`, `getServerSideProps`, Server Actions, or Server Components).
- Routing and nested layouts (App Router).
- API Routes, Middleware, and Edge Functions.
- Dynamic imports and suspense-based lazy loading.

## Extra Miscellaneous Guidelines

- If asked to edit code, do not remove existing comments unless they are incorrect or misleading.
- When adding new features, ensure they are consistent with the existing code style and architecture.
- Feel free to ask for clarification if the requirements are ambiguous or incomplete prior to generating code.
- Refrain from generating the entire code for a given file when asked to make small changes. It is better to send just the relevant snippets or diffs, with comments indicating where they fit in the overall file structure.
- Any input elements such as `<input>`, `<button>`, etc. should have padding around them so that mobile users can easily tap them without accidentally hitting adjacent elements. See related examples of this in the source code, or leave a placeholder so that the user can add padding later.
