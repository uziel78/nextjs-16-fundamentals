import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
        protocol: 'https',
        port: '',
        pathname: '/**',
      },
      {
        hostname: 'acoustic-mastiff-678.convex.cloud',
        protocol: 'https',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
