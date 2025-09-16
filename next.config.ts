import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  eslint: {
    // This will ignore all ESLint errors during production build
    
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

