import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Needed since Google Firebase cant use NExt JS Image component
    unoptimized: true,
  },
};

export default nextConfig;
