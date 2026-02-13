import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.reffortune.com",
      },
    ],
  },
};

export default nextConfig;
