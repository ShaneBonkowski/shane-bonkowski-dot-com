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
instead. There is a known issue with 'instanceof' in Next.js local dev mode
that can lead to unexpected behavior, especially with Hot Module 
Replacement (HMR).
    `,
  },
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message: `Use of dangerouslySetInnerHTML detected. Make sure to sanitize 
HTML with sanitizeHtml() instead of DOMPurify.sanitize() to ensure client-side
logic is handled properly. NOTE: this is only allowed with client-side rendering 
(e.g. "use client") files. Add eslint-disable comment if already protected 
upstream, or if dispositioned.`,
  },
  {
    selector: "JSXElement[children.length=0][closingElement]",
    message: `Empty JSX elements should use self-closing syntax (/>) instead of 
separate opening and closing tags.`,
  },
  {
    selector:
      "JSXElement[children.length=1][closingElement] > JSXText[value=/^\\s*$/]",
    message: `JSX elements containing only whitespace should use self-closing syntax (/>).`,
  },
  {
    selector:
      "CallExpression[callee.object.name='localStorage'][callee.property.name=/^(getItem|setItem|removeItem|clear)$/]",
    message: `localStorage usage detected. This is not allowed with SSR. Any client-side
code that uses localStorage must be protected with a check for SSR. This means
adding "if (typeof window === \\"undefined\\") return;" upstream of any localStorage 
calls. Add eslint-disable comment if already protected upstream, or if dispositioned.`,
  },
  {
    selector: "MethodDefinition[kind='constructor']",
    message: `use of 'constructor()' detected. Class construction on this website 
should be handled client-side. To be safe, it is heavily encouraged to add 
"if (typeof window === \\"undefined\\") return;" at the beginning of the constructor 
for SSR protection. NOTE: If using "super()", this must be called prior to returning.
Add eslint-disable comment if already protected upstream, or if dispositioned.`,
  },
  {
    selector: "MemberExpression[object.name='window']",
    message: `'window' object usage detected. Since this site is static, make 
sure to add "if (typeof window === \\"undefined\\") return;" check before 'window'
usage to prevent SSR errors. Add eslint-disable comment if already protected, 
upstream or if dispositioned.`,
  },
];

// TSX-specific rule
const tsxRestrictedSyntaxRules = [
  {
    selector:
      "Program:not(:has(ExpressionStatement:first-child > Literal[value='use client']))",
    message: `This is a static site. All .tsx files should have "use client"
directive at the top for proper client-side rendering. NOTE: This does not apply 
to files in the '/app' directory, since SSR is required for things like metadata 
injection. Add eslint-disable comment if already protected upstream, or if 
dispositioned.`,
  },
];

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-restricted-syntax": ["warn", ...commonRestrictedSyntaxRules],
    },
  },
  // Apply additional rule to all components/*.tsx files
  {
    files: ["**/components/*.tsx", "**/hooks/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        ...commonRestrictedSyntaxRules,
        ...tsxRestrictedSyntaxRules,
      ],
    },
  },
];

export default eslintConfig;
