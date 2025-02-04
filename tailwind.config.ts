import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
        "info-banner-background-color": "rgba(62, 62, 62, 1.00)",
      },
      spacing: {
        "common-ml": "2rem",
        "common-padding": "1.5rem",
      },
      fontSize: {
        // Default font sizes
        "header-1": "2.8rem",
        "header-2": "1.9rem",
        "header-3": "1.475rem",
        body: "1rem",
        small: "1rem",
        // Mobile font sizes
        "header-1-sm": "1.9rem",
        "header-2-sm": "1.3rem",
        "header-3-sm": "1.15rem",
        "body-sm": "1rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
