## React Components

This directory is used to organize all the generic React components in the project. It follows specific naming conventions to maintain consistency and readability.

### File Naming Conventions

Use PascalCase for React component file names.

Example: `AboutMe.tsx`
Incorrect: `aboutMe.tsx`, `about-me.tsx`

### Function Naming Conventions

Use PascalCase for React component function names.

Example:

```tsx
export default function AboutMe() { ... }
```

Incorrect:

```tsx
export default function aboutMe() { ... }
```

### Helper Functions Inside Components

Use camelCase for non-component functions inside React components.

Example: `fetchUserData()`
