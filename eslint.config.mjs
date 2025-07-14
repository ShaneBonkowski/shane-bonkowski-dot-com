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
    message: `[Custom eslint.config.mjs rule] Avoid using 'instanceof'. Use duck 
typing or alternative checks instead. There is a known issue with 'instanceof' 
in Next.js local dev mode that can lead to unexpected behavior, especially with 
Hot Module Replacement (HMR).
    `,
  },
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message: `[Custom eslint.config.mjs rule] Use of dangerouslySetInnerHTML 
detected. Make sure to sanitize HTML with sanitizeHtml() instead of 
DOMPurify.sanitize() to ensure client-side logic is handled properly. NOTE: 
this is only allowed with client-side rendering (e.g. "use client") files. 
Add eslint-disable comment if already protected upstream, or if dispositioned.`,
  },
  {
    selector:
      "JSXElement[children.length=0][closingElement][openingElement.name.name!=br]",
    message: `[Custom eslint.config.mjs rule] Empty JSX elements should use 
self-closing syntax (/>) instead of separate opening and closing tags.`,
  },
  {
    selector:
      "JSXElement[children.length=1][closingElement] > JSXText[value=/^\\s*$/]",
    message: `[Custom eslint.config.mjs rule] JSX elements containing only 
whitespace should use self-closing syntax (/>).`,
  },
  {
    selector:
      "CallExpression[callee.object.name='localStorage'][callee.property.name=/^(getItem|setItem|removeItem|clear)$/]",
    message: `[Custom eslint.config.mjs rule] localStorage usage detected. This 
is not allowed with SSR. Any client-side code that uses localStorage must be 
protected with a check for SSR. This means adding "if (typeof window === \\"undefined\\") return;" 
upstream of any localStorage calls. Additional note for games: it is advised
to use a 'dataStore' for game-specific data that interacts w/ localStorage. See
examples in this codebase for more context. Add eslint-disable comment if already 
protected upstream, or if dispositioned. `,
  },
  {
    selector: "MethodDefinition[kind='constructor']",
    message: `[Custom eslint.config.mjs rule] use of 'constructor()' detected. 
Class construction on this website should be handled client-side. To be safe, 
it is heavily encouraged to add "if (typeof window === \\"undefined\\") return;" 
at the beginning of the constructor for SSR protection. NOTE: If using "super()", 
this must be called prior to returning. Add eslint-disable comment if already 
protected upstream, or if dispositioned.`,
  },
  {
    selector: "MemberExpression[object.name='window']",
    message: `'[Custom eslint.config.mjs rule] window' object usage detected. 
Since this site is static, make sure to add "if (typeof window === \\"undefined\\") return;" 
check before 'window' usage to prevent SSR errors. Add eslint-disable comment 
if already protected, upstream or if dispositioned.`,
  },
  {
    selector:
      "ExpressionStatement > CallExpression[callee.type='MemberExpression'][callee.object.name=/Store$/][callee.property.name=/^set[A-Z]/]",
    message: `[Custom eslint.config.mjs rule] Store setter methods must be assigned to update local variables. 
Example: 
❌ gameDataStore.setPlayerHealth(newHealth);
✅ this.health = gameDataStore.setPlayerHealth(newHealth);
This enforces the pattern of keeping local properties in sync with store updates.
This is a common source of bugs if not followed, since there is often a delay
between store updates and local property updates. Add eslint-disable comment if 
dispositioned.`,
  },
];

// TS-specific rule for all .ts files
const tsRestrictedSyntaxRules = [];

// TSX-specific rule for all .tsx files (including app directory)
const tsxRestrictedSyntaxRules = [
  {
    selector: "ExpressionStatement > CallExpression[callee.name='setTimeout']",
    message: `[Custom eslint.config.mjs rule] setTimeout must be assigned to a variable or ref so 
    it can be cleared on cleanup. See examples in this codebase for more context. 
    Add eslint-disable comment if already protected.`,
  },
  {
    selector:
      'JSXOpeningElement[name.name="input"]:has(JSXAttribute[name.name="type"][value.value="text"])',
    message: `[Custom eslint.config.mjs rule] Text inputs should have an 'onKeyDown' 
    handler for mobile keyboard management. This ensures proper virtual keyboard 
    handling on mobile devices (such as hiding the keyboard when "submit" is 
    pressed). See other uses of text inputs in this codebase for examples. Add 
    eslint-disable comment if this has been addressed or dispositioned.`,
  },
];

// TSX-specific rule for all .tsx files NOT IN APP DIRECTORY
const tsxRestrictedSyntaxRulesNotAppDir = [
  {
    selector:
      "Program:not(:has(ExpressionStatement:first-child > Literal[value='use client']))",
    message: `[Custom eslint.config.mjs rule] This is a static site. All .tsx 
files should have "use client" directive at the top for proper client-side 
rendering. NOTE: This does not apply to files in the '/app' directory, since SSR 
is required for things like metadata injection. Add eslint-disable comment if 
already protected upstream, or if dispositioned.`,
  },
];

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Apply TS-specific rules to all .ts files
  {
    files: ["**/*.{js,ts}"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        ...commonRestrictedSyntaxRules,
        ...tsRestrictedSyntaxRules,
      ],
    },
  },
  // Apply TSX-specific rules to all .tsx files (excluding app directory)
  {
    files: ["**/*.tsx"],
    ignores: ["**/app/**"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        ...commonRestrictedSyntaxRules,
        ...tsxRestrictedSyntaxRules,
        ...tsxRestrictedSyntaxRulesNotAppDir,
      ],
    },
  },
  // Apply TSX-specific rules to app directory
  {
    files: ["**/app/**/*.tsx"],
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
