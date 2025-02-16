import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Needed since Google Firebase cant use NExt JS Image component
    unoptimized: true,
  },
  // Fixes issues with reloading taking a user to home page
  trailingSlash: true,
};

export default nextConfig;
