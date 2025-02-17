## Next.js App

This directory organizes the main files and components for the Next.js application (Next.js App Router). It follows specific naming conventions to maintain consistency and readability, ensuring the codebase remains organized and easy to navigate.

### File Naming Conventions

All app pages must be named `page.tsx`, placed within a directory named after the page (e.g., `app/about/page.tsx`).

### React Components

Use PascalCase for all React components, such as the main function that exports the contents of the page.

Example:

```js
export default function About() { ... }
```

### Function Naming Conventions

Use camelCase for regular JavaScript or TypeScript functions, including API handler functions and utilities.

Example:

```js
function fetchUserData() { ... }
```
