import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@starquiz/db"],
};

export default nextConfig;
