import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React strict mode
  reactStrictMode: false,

  // Disable all ESLint checks
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Enable serverless mode (if applicable)
  output: 'standalone', // Adjust if you're targeting serverless or standalone deployment
};

export default nextConfig;
