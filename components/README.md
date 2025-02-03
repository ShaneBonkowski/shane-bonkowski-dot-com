## React Component Naming Conventions

### File names

Use PascalCase for React component file names.

Example: `AboutMe.tsx`
Incorrect: `aboutMe.tsx`, `about-me.tsx`

### Function names

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
