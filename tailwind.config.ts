import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "#000000",
        "secondary-color": "#454545",
        "secondary-hover-color": "#555555",
        "button-color": "#282828",
        "primary-text-color": "#FFFFFF",
        "secondary-text-color": "#9CA3AF",
        "link-color": "#69daff",
        "info-banner-bkg-color": "rgba(62, 62, 62, 1.00)",
      },
      spacing: {
        "common-ml": "2rem",
        "common-p": "1.5rem",
      },
      width: {
        "content-box-w": "64rem",
      },
      height: {
        "content-box-content-h": "30vh",
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
