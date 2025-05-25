import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark mode (default)
        "primary-color": "rgba(0, 0, 0, 1)",
        "secondary-color": "rgba(69, 69, 69, 1)",
        "secondary-hover-color": "rgba(85, 85, 85, 1)",
        "button-color": "rgba(40, 40, 40, 1)",
        "primary-text-color": "rgba(255, 255, 255, 1)",
        "secondary-text-color": "rgba(156, 163, 175, 1)",
        "link-color": "rgba(105, 218, 255, 1)",
        "info-banner-bkg-color": "rgba(62, 62, 62, 0.95)",
        "game-menu-bkg-color": "rgba(62, 62, 62, 0.95)",
        // Light mode
        "primary-color-light": "rgb(255, 255, 255)",
        "secondary-color-light": "rgba(69, 69, 69, 1)",
        "secondary-hover-color-light": "rgb(171, 171, 171)",
        "button-color-light": "rgb(228, 228, 228)",
        "primary-text-color-light": "rgba(0, 0, 0, 1)",
        "secondary-text-color-light": "rgb(108, 108, 108)",
        "link-color-light": "rgb(53, 116, 218)",
        "info-banner-bkg-color-light": "rgba(208, 208, 208, 0.95)",
        "game-menu-bkg-color-light": "rgba(208, 208, 208, 0.75)",
      },
      spacing: {
        "common-ml": "2rem",
        "common-p": "1.5rem",
        "common-p-sm": "1.5rem",
        "flip-tile-small-mx": "6vw",
        "flip-tile-med-mx": "12vw",
        "flip-tile-tiny-mb": "6vw",
        "flip-tile-low-mb": "13vh",
        "flip-tile-med-mb": "23vh",
        "flip-tile-high-mb": "30vh",
      },
      width: {
        "content-box-dropdown-h": "8rem",
        "content-box-dropdown-h-sm": "15rem",
        "content-box-dropdown-w": "30%",
        "content-box-dropdown-w-sm": "20%",
        "header-btn-h": "7rem",
      },
      fontSize: {
        // Mobile font sizes
        "header-1": "1.9rem",
        "header-2": "1.4rem",
        "header-3": "1rem",
        body: "1rem",
        small: "0.7rem",
        "logo-title": "0.8rem",
        "logo-subtitle": "0.7rem",
        "content-box-title": "1rem",
        "content-box-subtitle": "0.8rem",
        // Computer font sizes
        "header-1-sm": "2.8rem",
        "header-2-sm": "1.9rem",
        "header-3-sm": "1.475rem",
        "body-sm": "1rem",
        "small-sm": "1rem",
        "logo-title-sm": "1.3rem",
        "logo-subtitle-sm": "1rem",
        "content-box-title-sm": "1.1rem",
        "content-box-subtitle-sm": "0.9rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
