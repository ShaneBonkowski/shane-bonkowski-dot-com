import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-color": "#000000",
        "secondary-color": "#454545",
        "button-color": "#282828",
        "text-color": "#FFFFFF",
        "hover-color": "#555555b0",
        "link-color": "#69daff",
        "link-color-dark": "#007aa3",
      },
      spacing: {
        "18": "4.5rem",
      },
      fontSize: {
        "header-1": "3rem",
        "header-2": "2.25rem",
        "header-3": "1.875rem",
        subheading: "1.5rem",
        body: "1rem",
        caption: "0.875rem",
        small: "0.75rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
