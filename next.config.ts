import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // disbable react strict mode and eslint all checks
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // enable serverless mode
  
};

export default nextConfig;
