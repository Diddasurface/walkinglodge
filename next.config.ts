import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['26.210.156.255'],
  async headers() {
    const immutableImageCache = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ]

    return [
      { source: '/images/:path*', headers: immutableImageCache },
      { source: '/uploads/:path*', headers: immutableImageCache },
    ]
  },
};

export default nextConfig;
