import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-restricted-syntax": [
        "warn",
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
            "Use of dangerouslySetInnerHTML detected. Make sure to sanitize HTML with DOMPurify.sanitize(). Add an eslint-disable comment if this is safe.",
        },
      ],
    },
  },
];

export default eslintConfig;
