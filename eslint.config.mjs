import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Shared rules that apply to all files
const commonRestrictedSyntaxRules = [
  {
    selector: "BinaryExpression[operator='instanceof']",
    message: `Avoid using 'instanceof'. Use duck typing or alternative checks 
instead. There is a known issue with 'instanceof' in Next.js 
that can lead to unexpected behavior, especially with Hot Module 
Replacement (HMR).
    `,
  },
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message:
      'Use of dangerouslySetInnerHTML detected. Make sure to sanitize HTML with sanitizeHtml() (only allowed for client side rendering with "use client" files). Add an eslint-disable comment if this is safe. Make sure to use sanitizeHtml() instead of DOMPurify.sanitize() to ensure client-side is handled properly.',
  },
  {
    selector: "JSXElement[children.length=0][closingElement]",
    message:
      "Empty JSX elements should use self-closing syntax (/>) instead of separate opening and closing tags.",
  },
  {
    selector:
      "JSXElement[children.length=1][closingElement] > JSXText[value=/^\\s*$/]",
    message:
      "JSX elements containing only whitespace should use self-closing syntax (/>).",
  },
  {
    selector:
      "CallExpression[callee.object.name='localStorage'][callee.property.name=/^(getItem|setItem|removeItem|clear)$/]",
    message:
      'localStorage usage detected. Make sure to check to see if it is necc. to add "if (typeof window === \\"undefined\\") return;" before localStorage calls to prevent SSR errors. Add eslint-disable comment if already protected, or if not necc.',
  },
  {
    selector: "MethodDefinition[kind='constructor']",
    message:
      'Constructor detected. Add "if (typeof window === \\"undefined\\") return;" at the beginning of constructor for SSR protection, or add eslint-disable comment if SSR protection is not needed (e.g., for server-side only classes) or once you added it.',
  },
];

// TSX-specific rule
const tsxUseClientRule = {
  selector:
    "Program:not(:has(ExpressionStatement:first-child > Literal[value='use client']))",
  message:
    'This is a static site. All .tsx files should have "use client" directive at the top for proper client-side rendering. NOTE: If this is a page file in /app directory, you can ignore this warning by adding an eslint-disable comment.',
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-restricted-syntax": ["warn", ...commonRestrictedSyntaxRules],
    },
  },
  // Apply additional rule to all components/*.tsx files
  {
    files: ["**/components/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        ...commonRestrictedSyntaxRules,
        tsxUseClientRule,
      ],
    },
  },
];

export default eslintConfig;
