import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.mux.com'
      },
      {
        protocol: 'https',
        hostname: 'rftx628e5s.ufs.sh'
      }
    ]
  }

};

export default nextConfig;
