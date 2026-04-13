import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/wattwise",
  assetPrefix: "/wattwise/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
