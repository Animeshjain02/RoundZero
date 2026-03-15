import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/dashboard/interviews",
        destination: "/dashboard/interview",
      },
    ];
  },
};

export default nextConfig;
