import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'], // allow Sanity image CDN
  },
};

export default nextConfig;
