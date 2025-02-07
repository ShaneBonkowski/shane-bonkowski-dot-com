/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // Automatically prexies CSS properties for various browsers
    autoprefixer: {},
  },
};

export default config;
