import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
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
        "common-p-sm": "1.5rem",
      },
      width: {
        "content-box-w": "90vw",
        "content-box-w-sm": "80vw",
        "content-box-dropdown-h": "8rem",
        "content-box-dropdown-h-sm": "15rem",
        "content-box-dropdown-w": "20vw",
        "content-box-dropdown-w-sm": "12vw",
        "header-btn-h": "7rem",
      },
      height: {
        "content-box-content-h": "15vh",
        "content-box-content-h-sm": "35vh",
      },
      fontSize: {
        // Mobile font sizes
        "header-1": "1.9rem",
        "header-2": "1.3rem",
        "header-3": "1rem",
        body: "0.8rem",
        small: "0.6rem",
        "logo-title": "0.7rem",
        "logo-subtitle": "0.55rem",
        "content-box-title": "0.8rem",
        "content-box-subtitle": "0.7rem",
        // Computer font sizes
        "header-1-sm": "2.8rem",
        "header-2-sm": "1.9rem",
        "header-3-sm": "1.475rem",
        "body-sm": "1rem",
        "small-sm": "1rem",
        "logo-title-sm": "1.3rem",
        "logo-subtitle-sm": "1rem",
        "content-box-title-sm": "1.3rem",
        "content-box-subtitle-sm": "1.1rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
